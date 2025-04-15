'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingIndicator } from './ui/loading-indicator';

const PUBLIC_PATHS = [
    '/login',
    '/api/auth',
];

// 完全跳过认证检查的路径
const BYPASS_AUTH_PATHS = [
    '/',
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    // 首先定义认证相关的效果函数
    useEffect(() => {
        // 如果是完全跳过认证的路径，不执行认证相关逻辑
        if (BYPASS_AUTH_PATHS.some(path => pathname === path)) {
            return;
        }

        // 检查是否是公开路径
        const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));

        // 获取 forceLogin 参数
        const forceLogin = searchParams.get('forceLogin') === 'true';

        const fullPath = pathname + '?' + searchParams.toString(); // Combine path and search params

        if (status === 'loading') return;

        // 如果是公开路径且已登录，重定向到profile页
        if (isPublicPath && session) {
            router.replace('/profile');
            return;
        }

        // 如果强制登录，无论是否登录都重定向到登录页
        if (forceLogin) {
            const redirectTo = encodeURIComponent(fullPath);
            router.replace(`/login?redirectTo=${redirectTo}`);
            return;
        }

        // 如果不是公开路径且未登录，重定向到登录页
        if (!isPublicPath && !session) {
            const redirectTo = encodeURIComponent(fullPath);
            router.replace(`/login?redirectTo=${redirectTo}`);
            return;
        }
    }, [session, status, pathname, router, searchParams]);

    // 现在根据不同条件进行渲染
    // 如果是完全跳过认证的路径，直接返回子组件
    if (BYPASS_AUTH_PATHS.some(path => pathname === path)) {
        return <>{children}</>;
    }

    // 在加载状态时可以显示加载指示器
    if (status === 'loading') {
        return <LoadingIndicator fullscreen />;
    }

    // 3. Determine conditions that will lead to a redirect *before* rendering children
    const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));
    const forceLogin = searchParams.get('forceLogin') === 'true';
    let shouldRenderChildren = true; // Assume rendering children is okay initially

    if (forceLogin) {
        // If forceLogin is true, a redirect will happen.
        shouldRenderChildren = false;
    } else if (isPublicPath && session) {
        // If on a public path and logged in, a redirect to profile will happen.
        shouldRenderChildren = false;
    } else if (!isPublicPath && !session && status === 'unauthenticated') {
        // If on a protected path and not logged in (and status is confirmed),
        // a redirect to login will happen.
        shouldRenderChildren = false;
    }

    // 4. Render LoadingIndicator if a redirect is expected or children otherwise
    if (!shouldRenderChildren) {
        // Display loading indicator while redirect is being processed by useEffect
        return <LoadingIndicator fullscreen />;
    } else {
        // All checks passed, safe to render children
        return <>{children}</>;
    }
}