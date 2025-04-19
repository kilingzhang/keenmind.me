export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server'
import { getDomainById, updateDomain, deleteDomain } from '@/lib/db/services/domain.service'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const id = Number(params.id)
    const domain = await getDomainById(id)
    return NextResponse.json(domain)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const id = Number(params.id)
    const data = await req.json() as {
        slug?: string
        name_zh?: string
        name_en?: string
        description_zh?: string | null
        description_en?: string | null
        icon?: string | null
        sort_order?: number | null
        extra?: any
        deleted_at?: Date | null
    }
    const updated = await updateDomain(id, data)
    return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const id = Number(params.id)
    const deleted = await deleteDomain(id)
    return NextResponse.json(deleted)
} 