export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server'
import { getDomains, createDomain } from '@/lib/db/services/domain.service'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url)
    const page = Number(searchParams.get('page') || 1)
    const pageSize = Number(searchParams.get('pageSize') || 10)
    const search = searchParams.get('search') || ''
    const result = await getDomains({ page, pageSize, search })
    return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
    const data = await req.json() as {
        slug: string
        name_zh: string
        name_en: string
        description_zh?: string | null
        description_en?: string | null
        icon?: string | null
        sort_order?: number | null
        extra?: any
        deleted_at?: Date | null
    }
    const created = await createDomain(data)
    return NextResponse.json(created)
} 