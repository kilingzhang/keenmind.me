import { prisma } from '../index';

export async function getTopics({ page = 1, pageSize = 10, search = '', name_zh, name_en, slug }: { page?: number, pageSize?: number, search?: string, name_zh?: string, name_en?: string, slug?: string }) {
    const where: any = {
        deleted_at: null,
    };
    if (name_zh) where.name_zh = name_zh;
    if (name_en) where.name_en = name_en;
    if (slug) where.slug = slug;
    if (!name_zh && !name_en && !slug && search) {
        where.OR = [
            { name_zh: { contains: search } },
            { name_en: { contains: search } },
            { slug: { contains: search } },
        ];
    }
    const [data, total] = await Promise.all([
        prisma().topics.findMany({
            where,
            orderBy: { sort_order: 'asc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma().topics.count({ where }),
    ])
    return { data, total }
}

export async function getTopicById(id: number) {
    return prisma().topics.findUnique({ where: { id, deleted_at: null } })
}

export async function createTopic(input: {
    slug: string
    name_zh: string
    name_en: string
    description_zh?: string | null
    description_en?: string | null
    sort_order?: number | null
    extra?: any
    deleted_at?: Date | null
}) {
    return prisma().topics.create({ data: input })
}

export async function updateTopic(id: number, input: {
    slug?: string
    name_zh?: string
    name_en?: string
    description_zh?: string | null
    description_en?: string | null
    sort_order?: number | null
    extra?: any
    deleted_at?: Date | null
}) {
    return prisma().topics.update({ where: { id }, data: input })
}

export async function deleteTopic(id: number) {
    return prisma().topics.update({ where: { id }, data: { deleted_at: new Date() } })
} 