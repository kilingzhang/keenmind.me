'use client'

import dynamic from 'next/dynamic'
import { UserOutlined, CheckCircleOutlined } from '@ant-design/icons'

// 动态导入组件
const ProCard = dynamic(() => import('@ant-design/pro-components').then(mod => mod.ProCard), {
    loading: () => <div className="animate-pulse bg-gray-100 h-[200px] rounded-lg" />
})

const StatisticCard = dynamic(() => import('@ant-design/pro-components').then(mod => mod.StatisticCard), {
    loading: () => <div className="animate-pulse bg-gray-100 h-[100px] rounded-lg" />
})

export const runtime = 'nodejs';

export default function AdminDashboard() {
    return (
        <ProCard
            title="仪表盘概览"
            headerBordered
            bordered={false}
            gutter={[16, 16]}
            loading={false}
        >
            <StatisticCard
                statistic={{
                    title: '总用户数',
                    value: 0,
                    icon: <UserOutlined />,
                    description: '所有注册用户数量'
                }}
            />
            <StatisticCard
                statistic={{
                    title: '今日活跃用户',
                    value: 0,
                    icon: <UserOutlined />,
                    description: '今日登录的用户数量'
                }}
            />
            <StatisticCard
                statistic={{
                    title: '系统状态',
                    value: '正常',
                    icon: <CheckCircleOutlined />,
                    valueStyle: { color: '#52c41a' },
                    description: '当前系统运行状态'
                }}
            />
        </ProCard>
    )
} 