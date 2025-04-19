'use client'

import dynamic from 'next/dynamic'
import { CheckCircleOutlined, UserOutlined, DatabaseOutlined, CloudServerOutlined } from '@ant-design/icons'
import { Row, Col, Typography } from 'antd'

export const runtime = 'nodejs';

const { Title, Paragraph } = Typography

// 动态导入组件
const ProCard = dynamic(() => import('@ant-design/pro-components').then(mod => mod.ProCard), {
    loading: () => <div className="animate-pulse bg-gray-100/50 h-[200px] rounded-3xl" />
})

const StatisticCard = dynamic(() => import('@ant-design/pro-components').then(mod => mod.StatisticCard), {
    loading: () => <div className="animate-pulse bg-gray-100/50 h-[100px] rounded-3xl" />
})

export default function AdminDashboard() {
    return (
        <div>
            <div className="mb-8">
                <Title level={2} className="!text-2xl !font-medium bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500 !m-0">仪表盘概览</Title>
                <Paragraph className="text-slate-500 mt-2 !mb-0">欢迎回到犀知管理后台，今天是 {new Date().toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Paragraph>
            </div>

            <Row gutter={[24, 24]}>
                <Col xs={24} sm={12} lg={6}>
                    <StatisticCard
                        statistic={{
                            title: '系统状态',
                            value: '正常',
                            icon: <CheckCircleOutlined />,
                            valueStyle: { color: '#10b981' },
                            description: '所有服务运行正常'
                        }}
                        className="rounded-2xl border border-emerald-100/40 backdrop-blur-sm bg-white/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatisticCard
                        statistic={{
                            title: '活跃用户',
                            value: '2,815',
                            icon: <UserOutlined />,
                            valueStyle: { color: '#ec4899' },
                            description: '较昨日增长 12%'
                        }}
                        className="rounded-2xl border border-pink-100/40 backdrop-blur-sm bg-white/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatisticCard
                        statistic={{
                            title: '数据库状态',
                            value: '良好',
                            icon: <DatabaseOutlined />,
                            valueStyle: { color: '#6366f1' },
                            description: '当前延迟 5ms'
                        }}
                        className="rounded-2xl border border-indigo-100/40 backdrop-blur-sm bg-white/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    />
                </Col>
                <Col xs={24} sm={12} lg={6}>
                    <StatisticCard
                        statistic={{
                            title: '服务器负载',
                            value: '20%',
                            icon: <CloudServerOutlined />,
                            valueStyle: { color: '#0ea5e9' },
                            description: '正常运行中'
                        }}
                        className="rounded-2xl border border-sky-100/40 backdrop-blur-sm bg-white/60 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                    />
                </Col>
            </Row>

            <div className="mt-8">
                <ProCard
                    title="最近活动"
                    headerBordered={false}
                    bordered={false}
                    className="rounded-2xl border border-slate-100/40 backdrop-blur-sm bg-white/60 hover:shadow-lg transition-all duration-300"
                >
                    <div className="py-8 text-center text-slate-500">
                        <p>今天还没有管理活动</p>
                        <p className="text-xs text-slate-400 mt-2">随时查看此处获取系统更新</p>
                    </div>
                </ProCard>
            </div>
        </div>
    )
} 