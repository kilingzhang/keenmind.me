import { createPrismaClient } from './node';

let prismaInstance: ReturnType<typeof createPrismaClient> | null = null;

export const prisma = () => {
    if (!prismaInstance) {
        prismaInstance = createPrismaClient();
    }
    return prismaInstance;
};