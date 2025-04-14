'use client'

import { Typography } from 'antd'
import UserList from './user-list'
import { memo } from 'react'

const { Title } = Typography

export const runtime = 'nodejs'

const UsersPage = memo(function UsersPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Title level={4} className="!mb-0 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500">用户管理</Title>
                    <p className="text-slate-500 text-sm">管理和监控系统用户</p>
                </div>
            </div>
            <div className="backdrop-blur-sm">
                <UserList />
            </div>

            {/* 装饰元素 */}
            <div className="absolute right-20 top-20 w-64 h-64 bg-gradient-radial from-cyan-100/10 to-transparent opacity-60 pointer-events-none z-[0]" />
            <div className="absolute left-40 bottom-20 w-40 h-40 bg-gradient-radial from-pink-100/10 to-transparent opacity-60 pointer-events-none z-[0]" />
        </div>
    )
})

export default UsersPage 