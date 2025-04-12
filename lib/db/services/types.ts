import { Prisma, UserStatus, TokenType } from "@prisma/client"

// 用户相关接口
export interface CreateUserData {
    email: string | null
    email_verified?: Date | null
    name?: string | null
    image?: string | null
    status?: UserStatus
}

export interface LinkAccountData {
    type: string
    provider: string
    provider_account_id: string
    refresh_token?: string | null
    access_token?: string | null
    expires_at?: number | null
    token_type?: string | null
    scope?: string | null
    id_token?: string | null
    session_state?: string | null
    user_id: string
}

export interface CreateSessionData {
    session_token: string
    user_id: string
    expires: Date
    user_agent?: string | null
    ip_address?: string | null
    is_mobile?: boolean
}

export interface CreateVerificationTokenData {
    identifier: string
    token: string
    expires: Date
    type?: TokenType
    created_ip?: string
}

// 自定义错误类型
export class DatabaseError extends Error {
    constructor(message: string, public code: string, public originalError?: any) {
        super(message);
        this.name = 'DatabaseError';
    }
}

export class UserNotFoundError extends Error {
    constructor(message = 'User not found') {
        super(message);
        this.name = 'UserNotFoundError';
    }
}

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidationError';
    }
}

// 常用查询条件
export const ACTIVE_USER_FILTER = {
    status: { not: UserStatus.BANNED },
    deleted_at: null,
} as const; 