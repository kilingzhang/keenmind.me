'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

interface LoadingIndicatorProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    fullscreen?: boolean;
}

export function LoadingIndicator({
    message,
    size = 'md',
    variant = 'default',
    fullscreen = false,
}: LoadingIndicatorProps) {
    const sizeStyles = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    };

    const variantStyles = {
        default: 'border-primary',
        destructive: 'border-destructive',
        outline: 'border-input',
        secondary: 'border-secondary',
        ghost: 'border-accent',
        link: 'border-primary'
    };

    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        if (fullscreen) {
            return (
                <div className="min-h-screen min-w-full flex items-center justify-center bg-white">
                    {children}
                </div>
            );
        }
        return <>{children}</>;
    };

    return (
        <Wrapper>
            <div className="flex items-center space-x-4">
                <div className="relative">
                    <div className={cn(
                        sizeStyles[size],
                        variantStyles[variant],
                        'rounded-full animate-spin transition-all duration-700 border-4 border-t-transparent'
                    )}></div>
                </div>
                {message && (
                    <span className={cn(
                        'font-medium text-foreground/70 animate-pulse transition-all duration-200',
                        {
                            'text-sm': size === 'sm',
                            'text-base': size === 'md',
                            'text-lg': size === 'lg'
                        }
                    )}>
                        {message}
                    </span>
                )}
            </div>
        </Wrapper>
    );
}