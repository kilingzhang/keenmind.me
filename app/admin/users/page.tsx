'use client'

import { Typography } from 'antd'
import UserList from './user-list'
import { memo } from 'react'

const { Title } = Typography

export const runtime = 'nodejs'

const UsersPage = memo(function UsersPage() {
    return (
        <div className="space-y-6 relative">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-2">
                    <Title level={3} className="!mb-0 !text-2xl !font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-cyan-500">用户管理</Title>
                    <p className="text-slate-500 text-sm">管理和监控系统用户账户、权限与活动</p>
                </div>
            </div>

            <div className="rounded-2xl overflow-hidden relative z-10">
                <UserList />
            </div>

            {/* 增强的装饰元素 */}
            <div className="absolute -right-20 top-10 w-80 h-80 bg-gradient-radial from-cyan-100/20 to-transparent rounded-full blur-3xl opacity-70 pointer-events-none z-[0]" />
            <div className="absolute -left-40 bottom-10 w-96 h-96 bg-gradient-radial from-pink-100/20 to-transparent rounded-full blur-3xl opacity-70 pointer-events-none z-[0]" />
            <div className="absolute right-1/4 bottom-1/3 w-48 h-48 bg-gradient-radial from-purple-100/10 to-transparent rounded-full blur-2xl opacity-60 pointer-events-none z-[0]" />

            {/* 全局样式增强 */}
            <style jsx global>{`
                .ant-table-wrapper {
                    border-radius: 16px;
                    overflow: hidden;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
                }
                
                .ant-table {
                    background: rgba(255, 255, 255, 0.85) !important;
                    backdrop-filter: blur(12px);
                }
                
                .ant-table-thead > tr > th {
                    background: rgba(249, 250, 251, 0.8) !important;
                    font-weight: 500;
                }
                
                .ant-table-row:hover > td {
                    background: rgba(249, 250, 251, 0.7) !important;
                }
                
                .ant-pagination-item-active {
                    border-color: #ec4899 !important;
                }
                
                .ant-pagination-item-active a {
                    color: #ec4899 !important;
                }
                
                .ant-btn-primary {
                    background: #1890ff !important;
                    border: none !important;
                    box-shadow: 0 2px 4px rgba(24, 144, 255, 0.2) !important;
                }
                
                .ant-tag {
                    border-radius: 10px;
                    padding: 0 10px;
                    font-size: 12px;
                    line-height: 20px;
                }
                
                .ant-pro-card {
                    background: rgba(255, 255, 255, 0.85) !important;
                    backdrop-filter: blur(12px);
                    border-radius: 16px !important;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
                    border: 1px solid rgba(241, 245, 249, 0.4) !important;
                }
            `}</style>
        </div>
    )
})

export default UsersPage 