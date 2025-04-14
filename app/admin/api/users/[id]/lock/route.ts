export const runtime = 'nodejs';

import { NextResponse } from 'next/server'
import { UserService } from '@/lib/db/services/user.service'

export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        await UserService.updateUserStatus(params.id, 'lock')
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to lock user:', error)
        return NextResponse.json(
            { error: 'Failed to lock user' },
            { status: 500 }
        )
    }
} 