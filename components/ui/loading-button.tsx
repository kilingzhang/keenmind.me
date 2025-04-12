'use client';

import * as React from 'react';
import { Button } from './button';

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    loading?: boolean;
    children: React.ReactNode;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
    formAction?: (formData: FormData) => Promise<void>;
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(({
    loading = false,
    formAction,
    type = formAction ? 'submit' : 'button',
    ...props
}, ref) => {
    return (
        <Button
            ref={ref}
            loading={loading}
            formAction={formAction}
            type={type}
            {...props}
        />
    );
});

LoadingButton.displayName = 'LoadingButton';