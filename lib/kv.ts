import { getRequestContext } from "@cloudflare/next-on-pages";

// 内存KV实现，用于开发环境
const memoryKV = new Map();

/**
 * KV接口类型定义
 */
interface KVNamespace {
    get(key: string, options?: { type?: 'text' | 'json' | 'arrayBuffer' | 'stream' }): Promise<any>;
    put(key: string, value: string | ArrayBuffer | ReadableStream, options?: { expirationTtl?: number }): Promise<void>;
    delete(key: string): Promise<void>;
}

/**
 * 获取KV实例
 * 优先从Cloudflare Workers环境获取，失败则返回基于内存的KV实现
 */
export const getKV = (): KVNamespace => {
    try {
        // 尝试从Cloudflare Workers环境获取KV
        return getRequestContext().env.KEENMIND_KV;
    } catch (error) {
        // 开发环境或无法获取KV时返回基于内存的KV实现
        return {
            get: async (key: string, options?: { type?: 'text' | 'json' | 'arrayBuffer' | 'stream' }) => {
                const value = memoryKV.get(key) || null;
                if (!value) return null;

                // 根据请求的类型返回不同格式的数据
                if (options?.type === 'json') {
                    try {
                        return JSON.parse(value);
                    } catch {
                        return null;
                    }
                }
                return value;
            },
            put: async (key: string, value: string | ArrayBuffer | ReadableStream, options?: { expirationTtl?: number }) => {
                // 在内存中存储值（忽略TTL）
                memoryKV.set(key, typeof value === 'string' ? value : '[非文本数据]');
                return Promise.resolve();
            },
            delete: async (key: string) => {
                memoryKV.delete(key);
                return Promise.resolve();
            }
        };
    }
};

/**
 * 通用KV缓存操作工具
 */
export class KVService {
    /**
     * 从KV缓存中获取JSON数据
     */
    static async getJSON<T>(key: string): Promise<T | null> {
        const kv = getKV();
        const data = await kv.get(key, { type: 'json' });
        return data as T | null;
    }

    /**
     * 将数据存入KV缓存
     */
    static async put(key: string, value: any, ttl?: number): Promise<void> {
        const kv = getKV();
        const valueStr = typeof value === 'string' ? value : JSON.stringify(value);

        const options = ttl ? { expirationTtl: ttl } : undefined;
        await kv.put(key, valueStr, options);
    }

    /**
     * 从KV缓存中删除数据
     */
    static async delete(key: string): Promise<void> {
        const kv = getKV();
        await kv.delete(key);
    }
} 