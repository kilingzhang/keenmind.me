export const runtime = 'nodejs';

import { NextResponse } from 'next/server'
import { UserService } from '@/lib/db/services/user.service'
import { Prisma, UserStatus } from '@/prisma/client'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const page = Number(searchParams.get('page')) || 1
        const pageSize = Number(searchParams.get('pageSize')) || 10

        // 提取所有可能的筛选条件
        const filters: Record<string, any> = {}
        const keyword = searchParams.get('keyword')
        const username = searchParams.get('username')
        const nickname = searchParams.get('nickname')
        const email = searchParams.get('email')
        const phone = searchParams.get('phone')
        const status = searchParams.get('status')

        if (keyword) filters.keyword = keyword
        if (username) filters.username = username
        if (nickname) filters.nickname = nickname
        if (email) filters.email = email
        if (phone) filters.phone = phone
        if (status) filters.status = status as UserStatus

        // 构建 Prisma where 条件
        const where: Prisma.usersWhereInput = {
            deleted_at: null,
        }

        // 添加特定字段筛选
        if (username) {
            where.username = { contains: username, mode: Prisma.QueryMode.insensitive }
        }
        if (nickname) {
            where.nickname = { contains: nickname, mode: Prisma.QueryMode.insensitive }
        }
        if (email) {
            where.email = { contains: email, mode: Prisma.QueryMode.insensitive }
        }
        if (phone) {
            where.phone = { contains: phone }
        }
        if (status) {
            where.status = status as UserStatus
        }

        // 关键词搜索（匹配多个字段）
        if (keyword) {
            where.OR = [
                { username: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
                { nickname: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
                { email: { contains: keyword, mode: Prisma.QueryMode.insensitive } },
                { phone: { contains: keyword } },
            ]
        }

        const { items, total } = await UserService.getUsers({
            page,
            pageSize,
            where,
        })

        return NextResponse.json({ items, total })
    } catch (error) {
        console.error('Failed to fetch users:', error)
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        )
    }
} 