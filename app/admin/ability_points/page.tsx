'use client'

import { Button, Input, Typography } from 'antd'
import { memo } from 'react'

const { Title } = Typography

export const runtime = 'nodejs'

const AbilityPointsPage = memo(function AbilityPointsPage() {
    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                    <Title level={3} className="!mb-0 !text-2xl !font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500">能力点管理</Title>
                    <p className="text-slate-500 text-sm">管理和监控系统能力点</p>
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold mb-4">能力点列表</h2>
                    <div className="flex items-center justify-between">
                        <Input placeholder="搜索能力点" />
                        <Button type="primary">添加能力点</Button>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default AbilityPointsPage