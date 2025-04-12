import * as React from "react"
import { cn } from "@/lib/utils"
import { Slot } from '@radix-ui/react-slot'
import { LoadingIndicator } from './loading-indicator'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    loading?: boolean
    asChild?: boolean
}

export const getButtonClasses = (
    variant: ButtonProps['variant'] = 'default',
    size: ButtonProps['size'] = 'default',
    className?: string
) => {
    const baseClasses = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

    const variantClasses = {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline"
    }

    const sizeClasses = {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9"
    }

    return cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
    )
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((
    { className, variant = 'default', size = 'default', loading = false, asChild = false, disabled, children, ...props }, ref
) => {
    const Comp = asChild ? Slot : 'button';
    const buttonClasses = cn(
        getButtonClasses(variant, size, className),
        loading ? 'cursor-not-allowed opacity-70 transform scale-100 hover:scale-100' : 'hover:scale-105'
    );

    return (
        <Comp
            className={buttonClasses}
            ref={ref}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <div className="-ml-1 mr-3">
                    <LoadingIndicator size="sm" variant={variant === 'default' ? 'default' : variant} />
                </div>
            )}
            <span className={loading ? 'opacity-90' : ''}>
                {children}
            </span>
        </Comp>
    );
})

Button.displayName = "Button"

export { Button }