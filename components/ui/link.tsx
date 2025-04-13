"use client"

import NextLink from 'next/link'
import { ReactNode } from 'react'

interface OptimizedLinkProps {
    href: string
    children: ReactNode
    className?: string
    prefetch?: boolean
    onClick?: () => void
}

export function Link({
    href,
    children,
    className = '',
    prefetch = true,
    onClick
}: OptimizedLinkProps) {
    return (
        <NextLink
            href={href}
            className={className}
            prefetch={prefetch}
            onClick={onClick}
        >
            {children}
        </NextLink>
    )
} 