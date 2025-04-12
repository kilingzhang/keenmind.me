/**
 * 移除对象中的undefined值
 * @template T - 输入对象类型
 * @param {T} obj - 要处理的对象
 * @returns {Partial<T>} 处理后的对象
 */
export function stripUndefined<T extends object>(obj: T): Partial<T> {
    return Object.fromEntries(
        Object.entries(obj).filter(([_, value]) => value !== undefined)
    ) as Partial<T>;
}

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
} 