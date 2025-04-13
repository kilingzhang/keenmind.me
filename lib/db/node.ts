import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/prisma/client';
import { Pool } from 'pg';
import { createPrismaWrapper } from './wrapper';

// 配置连接池参数
const pool = new Pool({
    connectionString: `${process.env.DATABASE_URL}`,
    max: 5, // 最大连接数
    idleTimeoutMillis: 30000, // 空闲连接超时时间
    connectionTimeoutMillis: 2000, // 连接超时时间
    maxUses: 7500, // 每个连接最大使用次数
});

// @ts-ignore
const adapter = new PrismaPg(pool);

// 错误处理函数
const handlePrismaError = (error: any) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    const timestamp = new Date().toISOString();

    // 记录错误信息
    console.error(`[${timestamp}] Prisma Error:`, {
        code: errorCode,
        message: errorMessage,
        stack: error.stack
    });

    // 根据错误类型处理
    if (errorCode === 'P2002') {
        throw new Error('唯一约束冲突');
    } else if (errorCode === 'P2025') {
        throw new Error('记录不存在');
    } else if (errorCode && errorCode.startsWith('P2')) {
        throw new Error('数据库约束错误');
    }

    throw error;
};

export function createPrismaClient() {
    const prismaBase = new PrismaClient({
        adapter,
        log: ['query', 'info', 'warn', 'error'],
        errorFormat: 'pretty',
    });

    // 添加全局日志处理
    // @ts-ignore
    prismaBase.$on('query', (e: any) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] Query | Duration: ${e.duration}ms | ${e.query} | Params: ${e.params}`);
    });
    // @ts-ignore
    prismaBase.$on('info', (e: any) => {
        const timestamp = new Date().toISOString();
        console.log(`[${timestamp}] Info | ${e.message}`);
    });
    // @ts-ignore
    prismaBase.$on('warn', (e: any) => {
        const timestamp = new Date().toISOString();
        console.warn(`[${timestamp}] Warning | ${e.message}`);
    });
    // @ts-ignore
    prismaBase.$on('error', (e: any) => {
        handlePrismaError(e);
    });

    // 添加全局错误处理
    // @ts-ignore
    prismaBase.$use(async (params: any, next: any) => {
        try {
            return await next(params);
        } catch (error: any) {
            handlePrismaError(error);
        }
    });

    // 使用包装器替代中间件
    return createPrismaWrapper(prismaBase);
}
