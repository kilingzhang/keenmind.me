import { NextResponse, type NextRequest } from 'next/server'
import { signIn } from '@/lib/auth/jwt';
import { BuiltInProviderType } from 'next-auth/providers';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const provider = request.nextUrl.searchParams.get('provider') as BuiltInProviderType || 'github'
    const redirect = await signIn(provider, {
        redirectTo: `/mapi/redirect?provider=${provider}`,
        redirect: false,
    });
    return NextResponse.json({ redirect })
}
