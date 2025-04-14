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
                    colorPrimary: '#ec4899',
                    borderRadius: 12,
                    colorBgContainer: 'rgba(255, 255, 255, 0.6)',
                    colorBgLayout: '#f9fafb',
                    colorTextBase: '#1f2937',
                    colorBorder: '#f1f5f9',
                    fontSize: 14,
                    controlHeight: 36,
                    colorBgElevated: 'rgba(255, 255, 255, 0.7)',
                    boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.03)',
                },
                components: {
                    Card: {
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.02)',
                        paddingLG: 24,
                        borderRadiusLG: 16,
                        colorBgContainer: 'rgba(255, 255, 255, 0.6)',
                    },
                    Table: {
                        borderRadius: 16,
                        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.02)',
                        colorBgContainer: 'rgba(255, 255, 255, 0.6)',
                    },
                    Button: {
                        borderRadius: 12,
                        controlHeight: 36,
                    },
                    Input: {
                        borderRadius: 12,
                        controlHeight: 36,
                    },
                    Select: {
                        borderRadius: 12,
                        controlHeight: 36,
                    },
                    Layout: {
                        headerBg: 'rgba(255, 255, 255, 0.7)',
                        bodyBg: 'transparent',
                        triggerBg: 'rgba(255, 255, 255, 0.6)',
                    },
                    Menu: {
                        itemBg: 'transparent',
                        subMenuItemBg: 'transparent',
                        itemSelectedBg: 'rgba(236, 72, 153, 0.08)',
                        itemSelectedColor: '#ec4899',
                        itemHoverColor: '#ec4899',
                        borderRadius: 12,
                    }
                },
            }}
            renderEmpty={() => <div className="p-4 text-center text-gray-400">暂无数据</div>}
            componentSize="middle"
            space={{ size: 'middle' }}
            virtual={true}
        >
            <div className="relative">
                {/* 背景效果 - 降低z-index确保不会遮挡交互元素 */}
                <div className="fixed inset-0 z-[-1]">
                    {/* 主背景 - 静态渐变 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-pink-50 to-cyan-50" />

                    {/* 顶部渐变装饰 */}
                    <div className="absolute top-0 inset-x-0 h-1/4 bg-gradient-to-b from-cyan-50 to-transparent opacity-70" />

                    {/* 底部渐变装饰 */}
                    <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-pink-50 to-transparent opacity-70" />

                    {/* 极简柔和流动效果 */}
                    <div className="absolute inset-0 opacity-30 pointer-events-none">
                        <div className="absolute inset-0 bg-gradient-radial from-pink-100/20 to-transparent animate-pulse-very-slow" style={{ transformOrigin: 'center' }} />
                        <div className="absolute inset-0 bg-gradient-radial from-cyan-100/20 to-transparent animate-pulse-very-slow delay-1000" style={{ transformOrigin: 'center' }} />
                    </div>

                    {/* 极淡的装饰线条 */}
                    <div className="absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-200/20 to-transparent pointer-events-none"></div>
                </div>

                <div className="relative">
                    {children}
                </div>
            </div>

            {/* 自定义动画样式 */}
            <style jsx global>{`
                @keyframes pulse-very-slow {
                    0% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(1.05); }
                    100% { opacity: 0.1; transform: scale(1); }
                }
                .animate-pulse-very-slow {
                    animation: pulse-very-slow 10s ease-in-out infinite;
                }
                .delay-1000 {
                    animation-delay: 5s;
                }
                .bg-gradient-radial {
                    background-image: radial-gradient(var(--tw-gradient-stops));
                }
                
                /* 确保按钮可点击 */
                .ant-btn {
                    position: relative;
                    z-index: 1;
                }
            `}</style>
        </ConfigProvider>
    )
})

export default Template 