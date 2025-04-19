import { prisma } from '../index';

export async function getDomains({ page = 1, pageSize = 10, search = '', name_zh, name_en, slug }: { page?: number, pageSize?: number, search?: string, name_zh?: string, name_en?: string, slug?: string }) {
    const where: any = {
        deleted_at: null,
    };
    // 精确筛选优先
    if (name_zh) where.name_zh = name_zh;
    if (name_en) where.name_en = name_en;
    if (slug) where.slug = slug;
    // 只有没有精确筛选时才用 search
    if (!name_zh && !name_en && !slug && search) {
        where.OR = [
            { name_zh: { contains: search } },
            { name_en: { contains: search } },
            { slug: { contains: search } },
        ];
    }
    const [data, total] = await Promise.all([
        prisma().domains.findMany({
            where,
            orderBy: { sort_order: 'asc' },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma().domains.count({ where }),
    ])
    return { data, total }
}

export async function getDomainById(id: number) {
    return prisma().domains.findUnique({ where: { id, deleted_at: null } })
}

export async function createDomain(input: {
    slug: string
    name_zh: string
    name_en: string
    description_zh?: string | null
    description_en?: string | null
    icon?: string | null
    sort_order?: number | null
    extra?: any
    deleted_at?: Date | null
}) {
    return prisma().domains.create({ data: input })
}

export async function updateDomain(id: number, input: {
    slug?: string
    name_zh?: string
    name_en?: string
    description_zh?: string | null
    description_en?: string | null
    icon?: string | null
    sort_order?: number | null
    extra?: any
    deleted_at?: Date | null
}) {
    return prisma().domains.update({ where: { id }, data: input })
}

export async function deleteDomain(id: number) {
    return prisma().domains.update({ where: { id }, data: { deleted_at: new Date() } })
} 