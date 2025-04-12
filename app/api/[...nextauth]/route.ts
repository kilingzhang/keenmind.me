import { NextRequest } from 'next/server';
import * as sessionAuth from '@/lib/auth/session';
import * as jwtAuth from '@/lib/auth/jwt';

export const runtime = 'nodejs';

async function getAuthHandlers(req: NextRequest) {
    // 从请求中获取 strategy 参数
    const searchParams = new URL(req.url).searchParams;
    const state = searchParams.get('state');
    // 根据 strategy 参数选择认证策略
    return state?.includes('strategy=jwt') ? jwtAuth.handlers : sessionAuth.handlers;
}

export async function GET(req: NextRequest) {
    const handlers = await getAuthHandlers(req);
    return handlers.GET(req);
}

export async function POST(req: NextRequest) {
    const handlers = await getAuthHandlers(req);
    return handlers.POST(req);
}
