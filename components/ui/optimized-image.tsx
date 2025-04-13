"use client"

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface OptimizedImageProps {
    src: string
    alt: string
    width: number
    height: number
    priority?: boolean
    className?: string
    sizes?: string
}

export function OptimizedImage({
    src,
    alt,
    width,
    height,
    priority = false,
    className = '',
    sizes = '100vw'
}: OptimizedImageProps) {
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        // 预加载关键图片
        if (priority) {
            const img = new window.Image()
            img.src = src
            img.onload = () => setIsLoaded(true)
        } else {
            setIsLoaded(true)
        }
    }, [src, priority])

    return (
        <div className="relative">
            {!isLoaded && priority && (
                <div
                    className="absolute inset-0 bg-slate-100 animate-pulse rounded-md"
                    style={{ aspectRatio: `${width}/${height}` }}
                />
            )}
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                priority={priority}
                loading={priority ? "eager" : "lazy"}
                sizes={sizes}
                className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}
                onLoad={() => setIsLoaded(true)}
            />
        </div>
    )
} 