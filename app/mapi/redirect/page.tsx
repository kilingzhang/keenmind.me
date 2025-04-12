import { cookies } from "next/headers";
import { getRequestEnvs } from "@/lib/define";
import { BuiltInProviderType } from "next-auth/providers";
import RedirectUI from './redirect-ui';

export const runtime = 'nodejs';

export default async function RedirectPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined };
}) {
    const provider = (searchParams.provider as BuiltInProviderType) || 'github';
    const env = getRequestEnvs();
    const key =
        env.NODE_ENV === 'production'
            ? '__Secure-next-auth.jwt-session-token'
            : 'next-auth.jwt-session-token';
    const token = cookies().get(key)?.value || '';
    const scheme = `keenmind.me://login?provider=${provider}&token=${token}`;

    return <RedirectUI scheme={scheme} />;
}
