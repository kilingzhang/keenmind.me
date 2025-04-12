import { headers } from 'next/headers';

export function getClientIp(): string {
    const headersList = headers();

    // 尝试从各种可能的请求头中获取IP
    // 优先使用 x-forwarded-for 的第一个 IP 地址，这通常是真实的客户端 IP
    const forwardedFor = headersList.get('x-forwarded-for');
    if (forwardedFor) {
        const ips = forwardedFor.split(',').map(ip => ip.trim());
        if (ips.length > 0 && ips[0] && ips[0] !== 'unknown') {
            return ips[0];
        }
    }

    // 尝试其他常见的代理 IP 头信息
    const realIp = headersList.get('x-real-ip');
    if (realIp && realIp !== 'unknown') {
        return realIp;
    }

    const cfIp = headersList.get('cf-connecting-ip');
    if (cfIp && cfIp !== 'unknown') {
        return cfIp;
    }

    const clientIp = headersList.get('x-client-ip');
    if (clientIp && clientIp !== 'unknown') {
        return clientIp;
    }

    const forwardedIp = headersList.get('x-forwarded');
    if (forwardedIp && forwardedIp !== 'unknown') {
        return forwardedIp;
    }

    const appEngineIp = headersList.get('x-appengine-user-ip');
    if (appEngineIp && appEngineIp !== 'unknown') {
        return appEngineIp;
    }

    // 如果无法获取真实 IP，返回一个明确的标识
    return 'unknown';
} 