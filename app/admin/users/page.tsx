'use client'

import { Typography } from 'antd'
import UserList from './user-list'
import { memo } from 'react'

const { Title } = Typography

export const runtime = 'nodejs'

const UsersPage = memo(function UsersPage() {
    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <Title level={4} className="!mb-0 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 animate-gradient">用户管理</Title>
                    <p className="text-slate-600 text-sm">管理和监控系统用户</p>
                </div>
            </div>
            <div className="backdrop-blur-sm">
                <UserList />
            </div>
        </div>
    )
})

export default UsersPage 