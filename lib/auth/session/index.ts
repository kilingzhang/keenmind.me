import { AccountService } from "@/lib/db/services/account.service";
import { UserService } from "@/lib/db/services/user.service";
import { getRequestEnvs } from "@/lib/define";
import NextAuth, { Account, User as AuthUser, NextAuthConfig, Profile } from "next-auth";
import { baseOptions } from "../base";

const createOptions = (): NextAuthConfig => {
    const env = getRequestEnvs();
    return {
        ...baseOptions(),
        pages: {
            signIn: "/login",
        },
        session: {
            strategy: 'database',
            maxAge: 60 * 60 * 24 * 14,
        },
        cookies: {
            sessionToken: {
                name: `next-auth.session-token`,
                options: {
                    httpOnly: true,
                    sameSite: 'lax',
                    path: '/',
                    secure: env.NODE_ENV === 'production'
                }
            }
        },
        callbacks: {
            // @ts-ignore
            session: async ({ session, token, user }) => {
                if (!session?.user?.id) return null
                session.user = await UserService.getUserById(session.user.id)
                return session
            },
            // @ts-ignore
            authorized: async ({ request, auth }) => {
                console.log(request.nextUrl.pathname, 'session authorized');

                const url = request?.nextUrl?.pathname;
                const searchParams = request.nextUrl.searchParams;

                if (url.startsWith('/api/auth/')) {
                    return true;
                }

                // 获取 query forceLogin 的值
                const forceLogin = searchParams.get('forceLogin') === 'true';
                if (forceLogin) {
                    return false;
                }

                const error = searchParams.get('error');

                if (auth?.user && ['/login'].includes(url)) {
                    console.log(url, '/login redirecting to /profile');
                    const newUrl = new URL('/profile', request.nextUrl.origin);
                    // 过滤掉 callbackUrl 参数
                    newUrl.searchParams.delete('redirectTo');
                    if (error) {
                        newUrl.searchParams.set('error', error);
                    }
                    return Response.redirect(newUrl, 307);
                }

                if (
                    !auth?.user &&
                    !['/', '/login', '/forgot-password'].includes(url) &&
                    !url.startsWith('/api/auth/') &&
                    !url.startsWith('/_next/static/') &&
                    !url.startsWith('/_next/image/') &&
                    !['.ico', '.txt', '.svg', '.png', '.jpg', '.jpeg'].some(ext => url.endsWith(ext))
                ) {
                    console.log(url, 'redirecting to /login');
                    const newUrl = new URL('/login', request.nextUrl.origin);
                    return Response.redirect(newUrl, 307);
                }

                return true;
            },
            // 添加 signIn 回调来处理账号绑定
            signIn: async ({
                user,
                account,
                profile
            }: {
                user: AuthUser;
                account: Account | null;
                profile?: Profile;
            }) => {
                try {

                    const session = await auth();

                    if (account && session?.user) {

                        // 检查账号是否已被其他用户绑定
                        const existingAccount = await AccountService.getUserByAccount(
                            account.provider,
                            account.providerAccountId
                        );

                        if (existingAccount && existingAccount.user.id !== session.user.id) {
                            throw new Error('account already linked to another user');
                        }

                        // 如果用户没有邮箱,或者是临时邮箱且与第三方邮箱不一致,则更新邮箱
                        const isTemporaryEmail = session.user.email?.includes('@unbind.');
                        const shouldUpdateEmail = !session.user.email || (isTemporaryEmail && profile?.email && session.user.email !== profile.email);


                        // 如果账号未被绑定，创建绑定关系
                        if (!existingAccount && session?.user?.id) {
                            console.log('linking account session', session);
                            console.log('linking account user', user);
                            console.log('linking account account', account);
                            console.log('linking account profile', profile);
                            console.log('linking account shouldUpdateEmail', shouldUpdateEmail);
                            await AccountService.linkAccount({
                                user_id: session.user.id,
                                type: account.type,
                                provider: account.provider,
                                provider_account_id: account.providerAccountId,
                                refresh_token: account.refresh_token,
                                access_token: account.access_token,
                                expires_at: account.expires_at,
                                token_type: account.token_type,
                                scope: account.scope,
                                id_token: account.id_token,
                                session_state: account.session_state as string,
                            });

                            if (shouldUpdateEmail) {
                                await UserService.updateUser(session.user.id, { email: profile?.email });
                            }
                        }

                        return true;
                    }

                    return true;
                } catch (error) {
                    console.error('signing in account:', error);
                }
                return false;
            }
        }
    };
};

const handler = NextAuth(createOptions);

// 基础 NextAuth 实现
const { handlers, signIn, signOut, auth } = handler;

// 获取当前用户
async function getCurrentUser(): Promise<any> {
    const session = await auth()
    return session?.user
}

// 导出方法
export {
    auth,
    getCurrentUser, handlers,
    signIn,
    signOut
};
