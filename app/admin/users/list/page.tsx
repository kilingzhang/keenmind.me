'use client'

import { Typography } from 'antd'
import UserList from './user-list'
import { memo } from 'react'

export const runtime = 'nodejs';

const { Title } = Typography

const UsersPage = memo(function UsersPage() {
    return (
        <div style={{ padding: '16px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={3}>用户管理</Title>
                <Typography.Text type="secondary">管理和监控系统用户账户、权限与活动</Typography.Text>
            </div>
            <UserList />
        </div>
    )
})

export default UsersPage 