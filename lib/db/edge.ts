import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { createPrismaWrapper } from './wrapper';

export const createPrismaClient = () => {
    const prismaBase = new PrismaClient({
        log: [
            {
                emit: 'event',
                level: 'query',
            },
            {
                emit: 'event',
                level: 'error',
            },
            {
                emit: 'event',
                level: 'info',
            },
            {
                emit: 'event',
                level: 'warn',
            },
        ],
        errorFormat: 'pretty',
    }).$extends(withAccelerate());

    // 使用包装器处理 BigInt 转换，而不是中间件
    return createPrismaWrapper(prismaBase);
};
