"use client"

import { Typography } from 'antd'
import DomainList from './domain-list'

export const runtime = 'nodejs';

const { Title } = Typography

export default function DomainsPage() {
    return (
        <div style={{ padding: '16px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={3}>领域管理</Title>
                <Typography.Text type="secondary">管理和监控系统领域（domains）</Typography.Text>
            </div>
            <DomainList />
        </div>
    )
}