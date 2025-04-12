'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";
import { toast } from 'sonner';
import { debounce } from 'lodash';

type ErrorType = 'auth' | 'network' | 'validation' | 'unknown';

interface ErrorConfig {
    message: string;
    type: ErrorType;
    retryable?: boolean;
}

function parseError(error: string): ErrorConfig {
    try {
        const parsed = JSON.parse(error);
        return {
            message: parsed.message || error,
            type: parsed.type || 'unknown',
            retryable: parsed.retryable ?? false
        };
    } catch {
        return {
            message: error,
            type: 'unknown',
            retryable: false
        };
    }
}

function ErrorHandlerContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const errorShown = useRef(false);

    // 记录错误日志
    const logError = useCallback((errorConfig: ErrorConfig) => {
        console.error('Error occurred:', {
            ...errorConfig,
            timestamp: new Date().toISOString(),
            url: window.location.href
        });
        // 这里可以添加发送错误日志到服务器的逻辑
    }, []);

    // 处理重试逻辑
    const handleRetry = useCallback(() => {
        window.location.reload();
    }, []);

    // 使用防抖优化URL更新
    const updateUrl = useCallback(
        debounce((newPathname: string) => {
            router.replace(newPathname);
        }, 300),
        [router]
    );

    useEffect(() => {
        const error = searchParams.get('error');
        if (error && !errorShown.current) {
            const errorConfig = parseError(error);
            errorShown.current = true;

            // 根据错误类型显示不同样式的提示
            switch (errorConfig.type) {
                case 'auth':
                    toast.error(errorConfig.message, {
                        description: '请重新登录'
                    });
                    break;
                case 'network':
                    toast.error(errorConfig.message, {
                        description: '请检查网络连接',
                        action: {
                            label: '重试',
                            onClick: handleRetry
                        }
                    });
                    break;
                default:
                    toast.error(errorConfig.message);
            }

            // 记录错误日志
            logError(errorConfig);

            // 构建新的 URL，移除 error 参数
            const newSearchParams = new URLSearchParams(searchParams);
            newSearchParams.delete('error');
            const newPathname = newSearchParams.toString()
                ? `${window.location.pathname}?${newSearchParams.toString()}`
                : window.location.pathname;

            updateUrl(newPathname);
        }
    }, [searchParams, router, logError, handleRetry, updateUrl]);

    return null;
}

export default function ErrorHandler() {
    return (
        <ErrorHandlerContent />
    );
}