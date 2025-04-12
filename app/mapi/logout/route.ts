import { NextResponse, type NextRequest } from 'next/server'
import { signOut } from '@/lib/auth/jwt';
import { cookies } from 'next/headers';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    await signOut({
        redirect: false,
    });
    // 删除 cookie
    cookies().delete('__Secure-next-auth.jwt-session-token')
    cookies().delete('next-auth.jwt-session-token')
    return NextResponse.json({})
}
