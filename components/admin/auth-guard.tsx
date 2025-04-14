'use client';

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { checkAdminById } from '@/lib/auth/admin'

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const { data: session, status } = useSession()
    const [isAuthorized, setIsAuthorized] = useState(false)

    useEffect(() => {
        if (status === 'loading') return;

        const isAdmin = session?.user?.id != null && checkAdminById(session.user.id)
        setIsAuthorized(isAdmin)

        if (!isAdmin) {
            router.replace('/profile')
        }
    }, [status, router, session])

    if (status === 'loading') {
        return (
            <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600"></div>
            </div>
        )
    }

    if (!isAuthorized) {
        return null
    }

    return <>{children}</>
} 