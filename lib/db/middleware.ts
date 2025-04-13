import { PrismaClient } from '@/prisma/client';
import { prisma } from './index';
import { getClientIp } from '../ip';

/**
 * @deprecated 这些中间件已被弃用，请使用 wrapper.ts 中的 PrismaWrapper 代替
 * 中间件仅在 Node.js 环境下工作，不支持 Edge 运行时
 */

// 将 BigInt 转换为 String 的中间件
export function createBigIntMiddleware() {
    return async (params: any, next: any) => {
        const result = await next(params);

        // 递归处理结果中的 BigInt
        const convertBigIntToString = (obj: any): any => {
            if (obj === null || obj === undefined) {
                return obj;
            }

            if (typeof obj === 'bigint') {
                return obj.toString();
            }

            if (obj instanceof Date) {
                return obj;
            }

            if (Array.isArray(obj)) {
                return obj.map(convertBigIntToString);
            }

            // 仅处理普通对象，排除特殊对象类型
            if (obj !== null && typeof obj === 'object') {
                const newObj: any = {};
                for (const key in obj) {
                    // 仅转换尾缀是 _id 的字段，且保留 provider_account_id
                    if ((key.endsWith('_id') || key === 'id') && key !== 'provider_account_id' && typeof obj[key] === 'bigint') {
                        newObj[key] = obj[key].toString();
                    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                        // 递归处理嵌套对象，但不改变字段键名
                        newObj[key] = convertBigIntToString(obj[key]);
                    } else {
                        // 其他类型原样保留
                        newObj[key] = obj[key];
                    }
                }
                return newObj;
            }

            return obj;
        };

        const newResult = convertBigIntToString(result);
        console.log(newResult);

        return newResult;
    };
}

// 将 String 转换回 BigInt 的中间件
export function createStringToBigIntMiddleware() {
    return async (params: any, next: any) => {
        // 递归处理参数中的 String 数字
        const convertStringToBigInt = (obj: any): any => {
            if (obj === null || obj === undefined) {
                return obj;
            }

            if (typeof obj === 'string' && /^\d+$/.test(obj)) {
                return BigInt(obj);
            }

            if (Array.isArray(obj)) {
                return obj.map(convertStringToBigInt);
            }

            // 仅处理普通对象，排除特殊对象类型
            if (obj !== null && typeof obj === 'object' && obj.constructor === Object) {
                const newObj: any = {};
                for (const key in obj) {
                    // 仅转换尾缀是 _id 的字段，且保留 provider_account_id
                    if ((key.endsWith('_id') || key === 'id') && key !== 'provider_account_id' && typeof obj[key] === 'string' && /^\d+$/.test(obj[key])) {
                        newObj[key] = BigInt(obj[key]);
                    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                        // 递归处理嵌套对象，但不改变字段键名
                        newObj[key] = convertStringToBigInt(obj[key]);
                    } else {
                        // 其他类型原样保留
                        newObj[key] = obj[key];
                    }
                }
                return newObj;
            }

            return obj;
        };

        const newParams = {
            ...params,
            args: convertStringToBigInt(params.args)
        };

        return await next(newParams);
    };
}
