import { Adapter, AdapterAccount } from "next-auth/adapters";
import {
    UserService,
    AccountService,
    SessionService,
    VerificationTokenService
} from "@/lib/db/services";
import { getClientIp } from "@/lib/ip";

function toAdapterUser(user: any) {
    return {
        id: user.id,
        email: user.email,
        emailVerified: user.email_verified,
        name: user?.nickname || user?.username,
        image: user.avatar,
    }
}

function toAdapterSession(session: any) {
    return {
        sessionToken: session.session_token,
        userId: session.user_id,
        expires: session.expires,
    }
}

function toAdapterAccount(dbAccount: any): AdapterAccount {
    return {
        id: dbAccount.id,
        type: dbAccount.type,
        provider: dbAccount.provider,
        providerAccountId: dbAccount.provider_account_id,
        userId: dbAccount.user_id,
    }
}

export function PrismaAdapter(): Adapter {
    return {
        createUser: async (data) => {
            const dbUser = await UserService.createUser({
                email: data.email,
                email_verified: data.emailVerified,
                nickname: data.name,
                avatar: data.image,
            })
            return toAdapterUser(dbUser)
        },
        getUser: async (id) => {
            const dbUser = await UserService.getActiveUserById(Number(id))
            return dbUser ? toAdapterUser(dbUser) : null
        },
        getUserByEmail: async (email) => {
            const dbUser = await UserService.getUserByEmail(email)
            return dbUser ? toAdapterUser(dbUser) : null
        },
        getUserByAccount: async ({ provider, providerAccountId }) => {
            const result = await AccountService.getUserByAccount(provider, providerAccountId)
            if (!result?.users) return null
            return toAdapterUser(result.users)
        },
        updateUser: async ({ id, ...data }) => {
            const dbUser = await UserService.updateUser(Number(id!), {
                email: data.email,
                email_verified: data.emailVerified,
                nickname: data.name,
                avatar: data.image,
            })
            return toAdapterUser(dbUser)
        },

        deleteUser: async (id) => {
            const dbUser = await UserService.deepDeleteUser(Number(id))
            return toAdapterUser(dbUser)
        },

        linkAccount: async (data) => {
            const dbAccount = await AccountService.linkAccount({
                type: data.type,
                provider: data.provider,
                provider_account_id: data.providerAccountId,
                refresh_token: data.refresh_token,
                access_token: data.access_token,
                expires_at: data.expires_at,
                token_type: data.token_type,
                scope: data.scope,
                id_token: data.id_token,
                session_state: data.session_state as string | null,
                user_id: Number(data.userId),
            })
            return toAdapterAccount(dbAccount)
        },
        unlinkAccount: async ({ provider, providerAccountId }) => {
            await AccountService.unlinkAccount(provider, providerAccountId)
        },
        getSessionAndUser: async (sessionToken) => {
            const result = await SessionService.getSessionAndUser(sessionToken) as any;
            if (!result || !result.user) return null

            return {
                user: toAdapterUser(result.user),
                session: toAdapterSession(result),
            }
        },
        createSession: async (data) => {
            const userAgent = globalThis?.navigator?.userAgent
            const ipAddress = ""
            const isMobile = userAgent?.toLowerCase().includes("mobile")

            const dbSession = await SessionService.createSession({
                session_token: data.sessionToken,
                user_id: Number(data.userId),
                expires: data.expires,
                user_agent: userAgent,
                ip_address: ipAddress,
                is_mobile: isMobile,
            })
            return toAdapterSession(dbSession)
        },
        updateSession: async (data) => {
            const dbSession = await SessionService.updateSession(data.sessionToken!, {
                expires: data.expires,
            })
            return toAdapterSession(dbSession)
        },
        deleteSession: async (sessionToken) => {
            const dbSession = await SessionService.deleteSession(sessionToken)
            return toAdapterSession(dbSession)
        },
        createVerificationToken: async (data) => {
            const ipAddress = getClientIp();
            return await VerificationTokenService.createVerificationToken({
                ...data,
                created_ip: ipAddress !== 'unknown' ? ipAddress : undefined,
            })
        },
        /* eslint-disable react-hooks/rules-of-hooks */
        useVerificationToken: async ({ identifier, token }) => {
            return await VerificationTokenService.useVerificationToken(identifier, token)
        }
        /* eslint-enable react-hooks/rules-of-hooks */
    }
}
