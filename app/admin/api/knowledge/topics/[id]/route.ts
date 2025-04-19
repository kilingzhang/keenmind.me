export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server'
import { getTopicById, updateTopic, deleteTopic } from '@/lib/db/services/topic.service'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const id = Number(params.id)
    const topic = await getTopicById(id)
    return NextResponse.json(topic)
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const id = Number(params.id)
    const data = await req.json() as {
        slug?: string
        name_zh?: string
        name_en?: string
        description_zh?: string | null
        description_en?: string | null
        sort_order?: number | null
        extra?: any
        deleted_at?: Date | null
    }
    const updated = await updateTopic(id, data)
    return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const id = Number(params.id)
    const deleted = await deleteTopic(id)
    return NextResponse.json(deleted)
} 