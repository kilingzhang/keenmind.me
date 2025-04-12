'use client';

import { useSession } from 'next-auth/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingIndicator } from './ui/loading-indicator';

const PUBLIC_PATHS = [
    '/login',
    '/api/auth',
];

export default function AuthGuard({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // 检查是否是公开路径
        const isPublicPath = PUBLIC_PATHS.some(path => pathname.startsWith(path));

        // 获取 forceLogin 参数
        const forceLogin = searchParams.get('forceLogin') === 'true';

        if (status === 'loading') return;

        // 如果是公开路径且已登录，重定向到profile页
        if (isPublicPath && session) {
            router.replace('/profile');
            return;
        }

        // 如果强制登录，无论是否登录都重定向到登录页
        if (forceLogin) {
            const redirectTo = session ? encodeURIComponent(pathname) : encodeURIComponent(pathname + '?' + searchParams.toString());
            router.replace(`/login?redirectTo=${redirectTo}`);
            return;
        }

        // 如果不是公开路径且未登录，重定向到登录页
        if (!isPublicPath && pathname !== '/' && !session) {
            const redirectTo = encodeURIComponent(pathname + '?' + searchParams.toString());
            router.replace(`/login?redirectTo=${redirectTo}`);
            return;
        }
    }, [session, status, pathname, router, searchParams]);

    // 在加载状态时可以显示加载指示器
    if (status === 'loading') {
        return <LoadingIndicator fullscreen />;
    }

    return <>{children}</>;
}