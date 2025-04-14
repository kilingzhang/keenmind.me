#!/bin/bash

set -e

# 镜像名
IMAGE_NAME="kilingzhang/go-reverse-proxy:latest"

# 写入 Dockerfile
cat <<EOF > Dockerfile
FROM golang:1.22 AS builder

WORKDIR /app

RUN cat <<EOGO > main.go
package main

import (
	"flag"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
)

func newProxy(target *url.URL) http.Handler {
	proxy := httputil.NewSingleHostReverseProxy(target)
	originalDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		originalDirector(req)
		req.Host = target.Host
		log.Printf("代理请求 %s %s", req.Method, req.URL.String())
	}
	proxy.ErrorHandler = func(rw http.ResponseWriter, req *http.Request, err error) {
		log.Printf("代理错误: %v", err)
		http.Error(rw, "代理失败", http.StatusBadGateway)
	}
	return proxy
}

func main() {
	targetStr := flag.String("target", "", "目标网站地址，如 https://example.com")
	flag.Parse()

	if *targetStr == "" {
		log.Fatal("必须指定 -target 参数")
	}
	target, err := url.Parse(*targetStr)
	if err != nil {
		log.Fatalf("无效的目标地址: %v", err)
	}

	proxy := newProxy(target)
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if !strings.HasSuffix(r.URL.Path, "favicon.ico") {
			log.Printf("%s %s", r.Method, r.URL.Path)
		}
		proxy.ServeHTTP(w, r)
	})

	log.Printf("启动代理服务，监听 8080，目标站：%s", target)
	log.Fatal(http.ListenAndServe(":8080", nil))
}
EOGO

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o proxy main.go

FROM gcr.io/distroless/static:nonroot

COPY --from=builder /app/proxy /proxy

EXPOSE 8080

ENTRYPOINT ["/proxy"]
EOF

# 构建镜像
echo "🚀 开始构建镜像: $IMAGE_NAME"
# 使用 --platform=linux/amd64 参数解决 Apple Silicon 与 amd64 镜像不一致的警告
docker build --platform=linux/amd64 -t "$IMAGE_NAME" .
docker push "$IMAGE_NAME"

echo "✅ 镜像构建完成: $IMAGE_NAME"
# 示例运行命令：
# docker run -d \\
#   --name go-reverse-proxy \\
#   -p 18080:8080 \\
#   -e TZ=Asia/Shanghai \\
#   --restart always \\
#   kilingzhang/go-reverse-proxy:latest \\
#   -target https://example.com
#
# 参数说明：
# --name               容器名称，便于管理
# -p 8080:8080         将本地 8080 端口映射到容器端口
# -e TZ=Asia/Shanghai  设置时区，日志时间更准确
# --restart            设置自动重启策略，此处为始终自动重启
# 最后的 -target 参数  是程序必须的，指定反向代理目标地址