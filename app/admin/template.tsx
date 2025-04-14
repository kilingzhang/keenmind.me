'use client'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { memo } from 'react'

const Template = memo(function Template({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider
            locale={zhCN}
            theme={{
                token: {
                    colorPrimary: '#4f46e5',
                    borderRadius: 8,
                    colorBgContainer: '#ffffff',
                    colorBgLayout: '#f5f5f5',
                    colorTextBase: '#1f2937',
                    colorBorder: '#e5e7eb',
                    fontSize: 14,
                    controlHeight: 36,
                    colorBgElevated: 'rgba(255, 255, 255, 0.7)',
                    boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.05)',
                },
                components: {
                    Card: {
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                        paddingLG: 24,
                        borderRadiusLG: 12,
                        colorBgContainer: 'rgba(255, 255, 255, 0.7)',
                    },
                    Table: {
                        borderRadius: 12,
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
                        colorBgContainer: 'rgba(255, 255, 255, 0.7)',
                    },
                    Button: {
                        borderRadius: 8,
                        controlHeight: 36,
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
                    },
                    Input: {
                        borderRadius: 8,
                        controlHeight: 36,
                    },
                    Select: {
                        borderRadius: 8,
                        controlHeight: 36,
                    },
                    Layout: {
                        colorBgHeader: 'rgba(255, 255, 255, 0.8)',
                        colorBgBody: '#f5f5f5',
                        colorBgTrigger: '#ffffff',
                    },
                    Menu: {
                        colorItemBg: 'transparent',
                        colorSubItemBg: 'transparent',
                        colorItemBgSelected: 'rgba(79, 70, 229, 0.1)',
                        colorItemTextSelected: '#4f46e5',
                        colorItemTextHover: '#4f46e5',
                        borderRadius: 8,
                    }
                },
            }}
            renderEmpty={() => <div className="p-4 text-center text-gray-500">暂无数据</div>}
            componentSize="middle"
            space={{ size: 'middle' }}
            virtual={true}
        >
            <div className="bg-gradient-to-br from-slate-50 via-white to-slate-50">
                {/* 背景动效 */}
                <div className="fixed inset-0 z-0">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-100/40 via-transparent to-transparent animate-pulse" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-purple-100/40 via-transparent to-transparent animate-pulse delay-1000" />
                </div>
                <div className="relative z-10">
                    {children}
                </div>
            </div>
        </ConfigProvider>
    )
})

export default Template 