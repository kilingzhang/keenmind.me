import { UserService } from "@/lib/db/services/user.service";
import { getRequestEnvs } from "@/lib/define";
import NextAuth, { NextAuthConfig } from "next-auth";
import { getToken } from "next-auth/jwt";
import { baseOptions } from "../base";

// 生成唯一ID的函数
function generateUUID(): string {
    // 优先使用Web Crypto API (适用于Edge和现代浏览器)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    // 降级方案：手动实现UUID v4
    const uuid = new Array(36);
    for (let i = 0; i < 36; i++) {
        if (i === 8 || i === 13 || i === 18 || i === 23) {
            uuid[i] = '-';
        } else if (i === 14) {
            uuid[i] = '4';
        } else {
            const random = (typeof crypto !== 'undefined' && crypto.getRandomValues)
                ? crypto.getRandomValues(new Uint8Array(1))[0]
                : Math.floor(Math.random() * 16);
            uuid[i] = (i === 19)
                ? (random & 0x3 | 0x8).toString(16)
                : random.toString(16);
        }
    }
    return uuid.join('');
}

const createOptions = (): NextAuthConfig => {
    const env = getRequestEnvs();
    return {
        ...baseOptions('jwt'),
        session: {
            strategy: 'jwt',
            maxAge: 60 * 60 * 24 * 14,
        },
        cookies: {
            sessionToken: {
                name: `next-auth.jwt-session-token`,
                options: {
                    httpOnly: true,
                    sameSite: 'lax',
                    path: '/',
                    secure: env.NODE_ENV === 'production'
                }
            }
        },
        callbacks: {
            jwt: async ({ token, user, account, profile, trigger, }) => {
                if (user) {
                    token.user = await UserService.getUserById(user?.id as string)
                    token.trigger = trigger
                    token.sessionToken = generateUUID()
                }
                return token
            },
            authorized: async ({ request, auth }) => {

                const publicPaths = ['/mapi/login', '/mapi/logout'];
                if (publicPaths.some(path => request.nextUrl.pathname.startsWith(path))) {
                    return true;
                }

                const env = getRequestEnvs()
                const key = env.NODE_ENV === 'production' ? '__Secure-next-auth.jwt-session-token' : 'next-auth.jwt-session-token'
                const payload = await getToken({ req: request, secret: env.AUTH_SECRET, cookieName: key, salt: key })

                if (!payload) {
                    return Response.json({ error: "Unauthorized" }, { status: 403 })
                }
                // 检查令牌是否过期
                const expires = new Date((payload.exp ?? 0) * 1000)
                if (expires < new Date()) {
                    return Response.json({ error: "Token expired" }, { status: 403 })
                }

                // 后续 实现 检查令牌是否匹配
                // const sessionToken = payload.sessionToken
                // if (sessionToken !== payload.sessionToken) {
                //     return Response.json({ error: "Invalid token" }, { status: 403 })
                // }
                return true
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


