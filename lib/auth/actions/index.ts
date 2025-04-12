'use server';

import { AccountService, UserService } from "@/lib/db/services";
import { revalidatePath } from "next/cache";
import { getCurrentUser, signIn, signOut } from "../session";
import { AuthError, AuthProvider, AuthResponse, SignInOptions } from '../types';

// 辅助函数：检查用户是否已登录
async function ensureAuthenticated() {
    const user = await getCurrentUser();
    if (!user) {
        throw new AuthError('Unauthorized', 'AUTH_REQUIRED');
    }
    return user;
}

// 辅助函数：检查账号所属权
async function ensureAccountOwnership(provider: string, providerAccountId: string, userId: string): Promise<boolean> {
    const accountInfo = await AccountService.getUserByAccount(provider, providerAccountId);
    if (!accountInfo || accountInfo.users.id !== BigInt(userId)) {
        return false;
    }
    return true;
}

// 登录相关的操作
export async function signInWithProvider(provider: AuthProvider, options?: SignInOptions): Promise<void> {
    try {
        await signIn(provider, options);
    } catch (error: any) {
        // Check if the error is a redirect (part of normal OAuth flow)
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error; // Re-throw redirect to allow the OAuth flow to continue
        }
        console.error(`Error signing in with ${provider}:`, error);
        throw new AuthError(`Failed to sign in with ${provider}`, 'SIGN_IN_ERROR');
    }
}

export async function signInWithWechat(_: FormData, options?: SignInOptions) {
    return signInWithProvider('wechat', options);
}

export async function signInWithGithub(_: FormData, options?: SignInOptions) {
    return signInWithProvider('github', options);
}

export async function signInWithEmail(formData: FormData, options?: SignInOptions) {
    const email = formData.get('email') as string;
    if (!email) {
        throw new AuthError('Email is required', 'VALIDATION_ERROR');
    }
    return signInWithProvider('resend', { ...options, email });
}

// 账号绑定相关的操作
export async function bindAccount(provider: AuthProvider): Promise<void> {
    return signInWithProvider(provider, {
        redirectTo: '/profile',
        redirect: true
    });
}

export async function bindGithubAccount() {
    return bindAccount('github');
}

export async function bindWechatAccount() {
    return bindAccount('wechat');
}

export async function logout() {
    await signOut();
}

export async function deleteAccount(): Promise<AuthResponse> {
    try {
        const currentUser = await ensureAuthenticated();

        // 获取用户的所有第三方账号
        const userWithAccounts = await UserService.getUserById(currentUser.id);

        // 解绑所有第三方账号
        for (const account of userWithAccounts.auth_accounts) {
            try {
                await AccountService.unlinkAccount(account.provider, account.provider_account_id);
            } catch (error: any) {
                continue;
            }
        }

        // 登出用户
        await signOut();

        // 删除用户账户
        await UserService.deepDeleteUser(currentUser.id);

        return { success: true };
    } catch (error: any) {
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error; // Re-throw redirect to allow the OAuth flow to continue
        }
        if (error instanceof AuthError) {
            throw error;
        }
        console.error("Failed to delete account:", error);
        throw new AuthError('Failed to delete account', 'DELETE_ACCOUNT_ERROR');
    }
}

export async function unlinkAccount(formData: FormData): Promise<AuthResponse> {
    try {
        const provider = formData.get('provider') as string;
        const providerAccountId = formData.get('providerAccountId') as string;

        if (!provider || !providerAccountId) {
            throw new AuthError('Missing required fields', 'VALIDATION_ERROR');
        }

        // const currentUser = await ensureAuthenticated();
        // const isOwner = await ensureAccountOwnership(provider, providerAccountId, currentUser.id);
        // 解绑账号
        await AccountService.unlinkAccount(provider, providerAccountId);
        return { success: true };
    } catch (error: any) {
        // 检查是否为重定向错误
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error; // Re-throw redirect to allow the OAuth flow to continue
        }
        if (error instanceof AuthError) {
            throw error;
        }
        console.error('Error unlinking account:', error);
        throw new AuthError('Failed to unlink account', 'UNLINK_ERROR');
    }
}