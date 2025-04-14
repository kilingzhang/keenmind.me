'use client';

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

// 管理员 ID 列表
const ADMIN_IDS: string[] = [
    '487878605611',
]

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { data: session, status } = useSession()

    const isAdmin = session?.user?.id != null && ADMIN_IDS.includes(session.user.id)

    useEffect(() => {
        if (status === 'loading') return;

        if (!isAdmin) {
            router.replace('/profile')
        }
    }, [status, router, isAdmin])

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    if (!isAdmin) {
        return null
    }

    return <>{children}</>
} 