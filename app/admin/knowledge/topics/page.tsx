"use client"

import { Typography } from 'antd'
import TopicList from './topic-list'

export const runtime = 'nodejs';

const { Title } = Typography

export default function TopicsPage() {
    return (
        <div style={{ padding: '16px' }}>
            <div style={{ marginBottom: '24px' }}>
                <Title level={3}>主题管理</Title>
                <Typography.Text type="secondary">管理和监控系统主题（topics）</Typography.Text>
            </div>
            <TopicList />
        </div>
    )
} 