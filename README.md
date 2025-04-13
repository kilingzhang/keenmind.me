# 项目简介

这是一个使用 [`c3`](https://developers.cloudflare.com/pages/get-started/c3) 引导创建的 [Next.js](https://nextjs.org/) 项目。

## 技术栈

- **前端框架**: [Next.js](https://nextjs.org/)
- **部署平台**: [Cloudflare Pages](https://pages.cloudflare.com/)
- **包管理工具**: [Bun](https://bun.sh/)
- **开发工具**: [Wrangler](https://developers.cloudflare.com/workers/wrangler/)

## 功能特点

- 基于 Next.js 的现代化前端应用
- 完整的 Cloudflare Pages 集成
- 高性能的全球 CDN 分发
- 支持 Cloudflare 资源绑定（KV、R2、D1 等）
- 开发与生产环境一致性保障

## 项目结构

```
项目根目录/
├── app/                # Next.js 应用目录（路由、页面）
├── components/         # React 组件
├── public/             # 静态资源
├── styles/             # CSS 样式文件
├── next.config.js      # Next.js 配置
├── wrangler.toml       # Wrangler 配置
└── package.json        # 项目依赖
```

## 开始使用

首先，安装依赖：

```bash
bun install
```

然后，运行开发服务器：

```bash
bun dev
```

在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看结果。

## 开发指南

### 创建新页面

在 `app` 目录中创建新文件或文件夹来添加路由。例如：

- `app/about/page.js` 将创建 `/about` 路由
- `app/blog/[slug]/page.js` 将创建动态路由 `/blog/:slug`

### 样式编写

本项目支持以下样式方案：

- CSS 模块 (`.module.css`)
- 全局样式 (`app/globals.css`)
- Tailwind CSS (如已配置)

### API 路由

在 `app/api` 目录中创建路由处理程序：

```javascript
// app/api/example/route.js
export async function GET() {
  return new Response(JSON.stringify({ message: '成功' }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
```

## 部署指南

### 本地预览

在部署前，先在本地预览您的 Pages 应用：

```bash
bun run preview
```

### 部署到 Cloudflare Pages

使用以下命令部署到 Cloudflare Pages：

```bash
bun run deploy
```

或者，您也可以通过 GitHub 集成实现自动部署。

## Cloudflare 集成

除了上面提到的 `dev` 脚本外，`c3` 还添加了一些额外的脚本，使您能够将应用程序与 [Cloudflare Pages](https://pages.cloudflare.com/) 环境集成：
  - `pages:build` 使用 [`@cloudflare/next-on-pages`](https://github.com/cloudflare/next-on-pages) CLI 为 Pages 构建应用程序
  - `preview` 使用 [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI 在本地预览您的 Pages 应用程序
  - `deploy` 使用 [Wrangler](https://developers.cloudflare.com/workers/wrangler/) CLI 部署您的 Pages 应用程序

> __注意：__ 虽然 `dev` 脚本对本地开发最为理想，但您也应该定期或在部署前预览您的 Pages 应用程序，以确保它能在 Pages 环境中正常工作（更多详情请参阅 [`@cloudflare/next-on-pages` 推荐的工作流程](https://github.com/cloudflare/next-on-pages/blob/main/internal-packages/next-dev/README.md#recommended-development-workflow)）

### 绑定（Bindings）

Cloudflare [绑定](https://developers.cloudflare.com/pages/functions/bindings/) 允许您与 Cloudflare 平台上可用的资源交互。

您可以在开发过程中、本地预览应用程序时以及已部署的应用程序中使用绑定：

- 要在开发模式下使用绑定，您需要在 `next.config.js` 文件的 `setupDevBindings` 下定义它们，此模式使用 `@cloudflare/next-on-pages` 的 `next-dev` 子模块。更多详情请参阅其[文档](https://github.com/cloudflare/next-on-pages/blob/05b6256/internal-packages/next-dev/README.md)。

- 要在预览模式下使用绑定，您需要根据 `wrangler pages dev` 命令将它们添加到 `pages:preview` 脚本中。更多详情请参阅其[文档](https://developers.cloudflare.com/workers/wrangler/commands/#dev-1)或 [Pages 绑定文档](https://developers.cloudflare.com/pages/functions/bindings/)。

- 要在已部署的应用程序中使用绑定，您需要在 Cloudflare [仪表板](https://dash.cloudflare.com/)中配置它们。更多详情请参阅 [Pages 绑定文档](https://developers.cloudflare.com/pages/functions/bindings/)。

#### KV 示例

`c3` 为您添加了一个示例，展示如何使用 KV 绑定。

要启用此示例：
- 搜索包含以下注释的 JavaScript/TypeScript 行：
  ```ts
  // KV Example:
  ```
  并取消下方被注释行的注释。
- 在 `wrangler.toml` 文件中也做同样的操作，其中注释为：
  ```
  # KV Example:
  ```
- 如果您使用 TypeScript，运行 `cf-typegen` 脚本更新 `env.d.ts` 文件：
  ```bash
  bun cf-typegen
  ```

完成这些操作后，您可以运行 `dev` 或 `preview` 脚本，并访问 `/api/hello` 路由查看示例效果。

最后，如果您还希望在已部署的应用程序中看到此示例生效，请确保在 Pages 应用程序的 [仪表板 KV 绑定设置部分](https://dash.cloudflare.com/?to=/:account/pages/view/:pages-project/settings/functions#kv_namespace_bindings_section) 中添加 `MY_KV_NAMESPACE` 绑定。配置完成后，请确保重新部署您的应用程序。

## 贡献指南

欢迎提交 Pull Request 或 Issue 来改进项目！

### 贡献流程

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m '添加一些特性'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

### 代码规范

- 遵循项目现有的代码风格
- 保持提交信息简洁明了
- 添加必要的文档和测试

## 许可证

本项目采用 [MIT 许可证](LICENSE)。
