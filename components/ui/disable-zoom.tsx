'use client';

import { useEffect } from 'react';

export default function DisableZoom() {
    useEffect(() => {
        // 防止缩放的处理函数
        const handleTouchMove = (e: TouchEvent) => {
            // 检测是否为多点触控（缩放手势）
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        };

        // 阻止双击缩放
        const handleTouchEnd = (e: TouchEvent) => {
            const now = Date.now();
            // @ts-ignore - 我们在元素上添加了自定义属性
            const lastTouch = document.lastTouch || 0;

            if (now - lastTouch < 300) {
                e.preventDefault();
            }
            // @ts-ignore
            document.lastTouch = now;
        };

        // 添加事件监听器
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd, { passive: false });

        // 清理函数
        return () => {
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
        };
    }, []);

    return null; // 这个组件不渲染任何内容
} 