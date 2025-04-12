import { PrismaClient } from '@prisma/client';

// 将 BigInt 转换为 String 的工具函数
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

// 将 String 转换回 BigInt 的工具函数
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

/**
 * PrismaClient 包装器，用于处理 BigInt 与 String 的转换
 * 适用于 Node 和 Edge 环境
 */
export class PrismaWrapper {
    private prisma: any;

    constructor(prismaClient: any) {
        this.prisma = prismaClient;
        return this.createProxy();
    }

    private createProxy() {
        const handler = {
            get: (target: any, prop: string | symbol) => {
                const value = target.prisma[prop];

                // 如果是函数，则包装它以处理参数和返回值
                if (typeof value === 'function') {
                    return (...args: any[]) => {
                        // 转换参数中的字符串为 BigInt
                        const convertedArgs = args.map(arg => convertStringToBigInt(arg));
                        return value.apply(target.prisma, convertedArgs).then((result: any) => {
                            // 转换结果中的 BigInt 为字符串
                            return convertBigIntToString(result);
                        });
                    };
                }

                // 如果是模型，返回代理
                if (typeof value === 'object' && value !== null) {
                    return new Proxy(value, {
                        get: (modelTarget: any, modelProp: string | symbol) => {
                            const modelValue = modelTarget[modelProp];

                            // 处理模型方法
                            if (typeof modelValue === 'function') {
                                return (...args: any[]) => {
                                    // 转换参数中的字符串为 BigInt
                                    const convertedArgs = args.map(arg => convertStringToBigInt(arg));
                                    return modelValue.apply(modelTarget, convertedArgs).then((result: any) => {
                                        // 转换结果中的 BigInt 为字符串
                                        return convertBigIntToString(result);
                                    });
                                };
                            }

                            return modelValue;
                        }
                    });
                }

                return value;
            }
        };

        return new Proxy(this, handler);
    }
}

/**
 * 创建包装后的 PrismaClient 实例
 * @param prismaClient 原始 PrismaClient 实例
 * @returns 包装后的 PrismaClient 实例
 */
export function createPrismaWrapper(prismaClient: any) {
    return new PrismaWrapper(prismaClient) as unknown as PrismaClient;
} 