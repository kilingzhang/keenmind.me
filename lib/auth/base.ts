import { PrismaAdapter } from "./adapter-prisma";
import { NextAuthConfig } from "next-auth";
import { getRequestEnvs } from "@/lib/define";
import GitHub from "next-auth/providers/github";
import Resend from "next-auth/providers/resend";
import WeChat from "./provider-wechat";
import { getVerificationHtml, getVerificationText } from "@/lib/email/templates/verification";

export const baseOptions = (strategy: 'jwt' | 'session' = 'session'): NextAuthConfig => {
    const env = getRequestEnvs();
    return {
        debug: false,
        trustHost: true,
        adapter: PrismaAdapter(),
        secret: env.AUTH_SECRET,
        providers: [
            GitHub({
                clientId: env.AUTH_GITHUB_ID,
                clientSecret: env.AUTH_GITHUB_SECRET,
                allowDangerousEmailAccountLinking: true,
                checks: ['none'],
                authorization: {
                    params: {
                        state: `strategy=${strategy}`
                    },
                },
            }),
            WeChat({
                clientId: env.AUTH_WECHAT_APP_ID,
                clientSecret: env.AUTH_WECHAT_APP_SECRET,
                platformType: 'OfficialAccount',
                authorization: {
                    params: {
                        state: `strategy=${strategy}`
                    },
                },
            }),
            Resend({
                apiKey: env.AUTH_RESEND_API_KEY,
                from: env.AUTH_RESEND_EMAIL_FROM,
                async sendVerificationRequest(params) {
                    const { identifier: to, provider, url, theme } = params
                    const { host } = new URL(url)

                    const html = getVerificationHtml({ url, host })
                    const text = getVerificationText({ url, host })

                    const res = await fetch("https://api.resend.com/emails", {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${provider.apiKey}`,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            from: provider.from,
                            to,
                            subject: `${host} Login Verification`,
                            html,
                            text,
                        }),
                    })

                    if (!res.ok) {
                        throw new Error("Resend error: " + JSON.stringify(await res.json()))
                    }
                },
            }),
        ],
    };
};