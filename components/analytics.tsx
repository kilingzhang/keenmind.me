'use client';

import { useReportWebVitals } from 'next/web-vitals';

export function Analytics() {
    useReportWebVitals((metric) => {
        const { id, name, label, value } = metric;

        // 可以发送到自定义分析服务
        console.log(`Web Vital: ${name} | Value: ${value}`);

        // 或添加到应用内的性能监控
        if (window.performance && name === 'LCP') {
            // 记录最大内容绘制时间
            const performanceEntries = window.performance.getEntriesByType('navigation');
            if (performanceEntries.length > 0) {
                const navigationEntry = performanceEntries[0] as PerformanceNavigationTiming;
                const dcl = navigationEntry.domContentLoadedEventEnd - navigationEntry.fetchStart;
                const load = navigationEntry.loadEventEnd - navigationEntry.fetchStart;

                console.log(`DOMContentLoaded: ${dcl}ms`);
                console.log(`Load: ${load}ms`);
            }
        }
    });

    return null;
} 