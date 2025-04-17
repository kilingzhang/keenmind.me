'use client'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { memo } from 'react'
import { AuroraBackground } from '@/components/ui/aurora-background'

const Template = memo(function Template({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider
            locale={zhCN}
            theme={{
                token: {
                    colorPrimary: '#ec4899',
                    borderRadius: 12,
                    colorBgContainer: 'rgba(255, 255, 255, 0.65)',
                    colorBgLayout: 'transparent',
                    colorTextBase: '#1f2937',
                    colorBorder: '#f1f5f9',
                    fontSize: 14,
                    controlHeight: 36,
                    colorBgElevated: 'rgba(255, 255, 255, 0.75)',
                    boxShadowSecondary: '0 4px 12px rgba(0, 0, 0, 0.04)',
                },
                components: {
                    Card: {
                        boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.03)',
                        paddingLG: 24,
                        borderRadiusLG: 16,
                        colorBgContainer: 'rgba(255, 255, 255, 0.75)',
                    },
                    Table: {
                        borderRadius: 16,
                        boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.03)',
                        colorBgContainer: 'rgba(255, 255, 255, 0.75)',
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
                        headerBg: 'rgba(255, 255, 255, 0.8)',
                        bodyBg: 'transparent',
                        triggerBg: 'rgba(255, 255, 255, 0.75)',
                    },
                    Menu: {
                        itemBg: 'transparent',
                        subMenuItemBg: 'transparent',
                        itemSelectedBg: 'rgba(236, 72, 153, 0.12)',
                        itemSelectedColor: '#ec4899',
                        itemHoverColor: '#ec4899',
                        borderRadius: 12,
                        subMenuItemBorderRadius: 8,
                        itemHeight: 40,
                        horizontalItemSelectedBg: 'rgba(236, 72, 153, 0.08)',
                        colorItemTextHover: '#ec4899',
                        darkItemHoverColor: '#ec4899',
                        darkSubMenuItemBg: 'rgba(255, 255, 255, 0.02)',
                        popupBg: 'rgba(255, 255, 255, 0.9)',
                    }
                },
            }}
            renderEmpty={() => <div className="p-4 text-center text-gray-400">暂无数据</div>}
            componentSize="middle"
            space={{ size: 'middle' }}
            virtual={true}
        >
            <div className="relative">
                {/* 使用 AuroraBackground 组件替换旧的背景效果 */}
                <div className="fixed inset-0 z-[-1]">
                    <AuroraBackground
                        withStaticGradient={true}
                        withTopGradient={true}
                        withBottomGradient={true}
                        withLine={true}
                    />
                </div>

                <div className="relative">
                    {children}
                </div>
            </div>

            {/* 自定义动画样式 */}
            <style jsx global>{`
                /* 确保按钮可点击 */
                .ant-btn, .ant-dropdown-trigger, .ant-select-selector, .ant-input {
                    position: relative;
                    z-index: 1;
                }
                
                /* 提升表格和卡片的视觉质量 */
                .ant-table, .ant-card, .ant-pro-card {
                    backdrop-filter: blur(10px);
                    border: 1px solid rgba(241, 245, 249, 0.4) !important;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03) !important;
                    overflow: hidden;
                }
                
                /* 增强表单控件可见性 */
                .ant-input, .ant-select-selector, .ant-picker {
                    background: rgba(255, 255, 255, 0.6) !important;
                    backdrop-filter: blur(8px);
                    border: 1px solid rgba(241, 245, 249, 0.6) !important;
                }
                
                /* 美化滚动条 */
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }
                
                ::-webkit-scrollbar-track {
                    background: rgba(241, 245, 249, 0.3);
                }
                
                ::-webkit-scrollbar-thumb {
                    background: rgba(203, 213, 225, 0.5);
                    border-radius: 4px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: rgba(148, 163, 184, 0.5);
                }
                
                /* 确保模态框和抽屉组件正确显示 */
                .ant-modal-content, .ant-drawer-content {
                    background: rgba(255, 255, 255, 0.9) !important;
                    backdrop-filter: blur(16px) !important;
                }
                
                /* 子菜单样式美化 */
                .ant-menu-submenu-title {
                    transition: all 0.3s ease !important;
                }
                
                .ant-menu-submenu-open > .ant-menu-submenu-title {
                    color: #ec4899 !important;
                    background: rgba(236, 72, 153, 0.05) !important;
                }
                
                .ant-menu-submenu-active > .ant-menu-submenu-title {
                    color: #ec4899 !important;
                }
                
                .ant-menu-submenu-title .ant-menu-submenu-arrow {
                    transition: all 0.3s ease !important;
                }
                
                .ant-menu-submenu-open > .ant-menu-submenu-title .ant-menu-submenu-arrow {
                    color: #ec4899 !important;
                    transform: rotate(180deg) !important;
                }
                
                .ant-menu-submenu-vertical > .ant-menu-submenu-title .ant-menu-submenu-arrow {
                    right: 16px !important;
                }
                
                .ant-menu-submenu-vertical .ant-menu-item {
                    padding-left: 38px !important;
                    height: 32px !important;
                    line-height: 32px !important;
                    margin: 4px 8px !important;
                }
                
                .ant-menu-item:active {
                    background: rgba(236, 72, 153, 0.10) !important;
                }
                
                .ant-menu-submenu-vertical > .ant-menu {
                    border-radius: 8px !important;
                    padding: 4px 0 !important;
                    background-color: rgba(255, 255, 255, 0.03) !important;
                }
                
                .ant-menu-submenu .ant-menu-submenu-popup {
                    backdrop-filter: blur(16px) !important;
                }
                
                .ant-menu-sub.ant-menu-inline {
                    background: rgba(0, 0, 0, 0.01) !important;
                    border-radius: 8px !important;
                    margin: 4px 8px !important;
                }
            `}</style>
        </ConfigProvider>
    )
})

export default Template 