// 认证相关的类型定义

// 登录提供商类型
export type AuthProvider = 'wechat' | 'github' | 'resend';

// 登录选项类型
export interface SignInOptions {
    redirectTo?: string;
    redirect?: boolean;
    email?: string;
}

// 账号解绑请求类型
export interface UnlinkAccountRequest {
    provider: string;
    providerAccountId: string;
}

// 认证错误类型
export class AuthError extends Error {
    constructor(message: string, public code: string) {
        super(message);
        this.name = 'AuthError';
    }
}

// 认证响应类型
export interface AuthResponse {
    success: boolean;
    error?: {
        code: string;
        message: string;
    };
}