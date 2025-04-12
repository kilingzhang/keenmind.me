import fs from 'fs'
import path from 'path'

// 在这里集中配置运行时
const RUNTIME = process.env.RUNTIME || 'nodejs' // 可以通过环境变量传入，默认 edge

// 生成 db.ts 的内容
function generateDbContent(runtime: string): string {
    if (runtime === 'edge') {
        return `
import { createPrismaClient } from './edge';

let prismaInstance: ReturnType<typeof createPrismaClient> | null = null;

export const prisma = () => {
    if (!prismaInstance) {
        prismaInstance = createPrismaClient();
    }
    return prismaInstance;
};
`.trim()
    } else {
        return `
import { createPrismaClient } from './node';

let prismaInstance: ReturnType<typeof createPrismaClient> | null = null;

export const prisma = () => {
    if (!prismaInstance) {
        prismaInstance = createPrismaClient();
    }
    return prismaInstance;
};
`.trim()
    }
}

// 主函数
function main() {
    const dbFilePath = path.join(process.cwd(), 'lib', 'db', 'index.ts')
    const content = generateDbContent(RUNTIME)

    fs.writeFileSync(dbFilePath, content)
    console.log(`Generated db.ts for ${RUNTIME} runtime`)
}

main() 