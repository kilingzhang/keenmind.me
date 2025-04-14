'use client'

import dynamic from 'next/dynamic'
import { CheckCircleOutlined } from '@ant-design/icons'

// 动态导入组件
const ProCard = dynamic(() => import('@ant-design/pro-components').then(mod => mod.ProCard), {
    loading: () => <div className="animate-pulse bg-gray-100/50 h-[200px] rounded-3xl" />
})

const StatisticCard = dynamic(() => import('@ant-design/pro-components').then(mod => mod.StatisticCard), {
    loading: () => <div className="animate-pulse bg-gray-100/50 h-[100px] rounded-3xl" />
})

export const runtime = 'nodejs';

export default function AdminDashboard() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500">仪表盘概览</h1>
                <p className="text-slate-500 mt-1">欢迎回到犀知管理后台</p>
            </div>

            <ProCard
                headerBordered={false}
                bordered={false}
                gutter={[16, 16]}
                loading={false}
                className="!bg-transparent !border-0 !shadow-none"
            >
                <StatisticCard
                    statistic={{
                        title: '系统状态',
                        value: '正常',
                        icon: <CheckCircleOutlined />,
                        valueStyle: { color: '#ec4899' },
                        description: '当前系统运行状态'
                    }}
                    className="rounded-3xl border border-pink-100/20 backdrop-blur-sm bg-white/60"
                />
            </ProCard>

            {/* 装饰元素 */}
            <div className="absolute right-0 bottom-0 w-64 h-64 bg-gradient-radial from-cyan-100/10 to-transparent opacity-60 pointer-events-none z-[0]" />
            <div className="absolute left-0 bottom-40 w-40 h-40 bg-gradient-radial from-pink-100/10 to-transparent opacity-60 pointer-events-none z-[0]" />

            <style jsx global>{`
                .ant-pro-card-statistic-wrapper .ant-statistic-title {
                    color: #64748b !important;
                }
                .ant-pro-card-statistic-wrapper .ant-statistic-content {
                    color: #334155 !important;
                }
                .ant-pro-card-statistic {
                    padding: 24px !important;
                }
            `}</style>
        </div>
    )
} 