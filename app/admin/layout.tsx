'use client'

import AdminAuthGuard from '@/components/admin/auth-guard'
import dynamic from 'next/dynamic'
import { HomeOutlined, UserOutlined, SettingOutlined, AppstoreOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Template from './template'
import 'antd/dist/reset.css'

// 动态导入 ProLayout
const ProLayout = dynamic(
    () => import('@ant-design/pro-components').then(mod => mod.ProLayout),
    {
        loading: () => <div className="animate-pulse bg-gray-100/30 min-h-screen" />,
        ssr: false // 禁用服务端渲染以避免水合问题
    }
)

const route = {
    path: '/admin',
    routes: [
        {
            path: '/admin/dashboard',
            name: '仪表盘',
            icon: <HomeOutlined />,
        },
        {
            path: '/admin/users',
            name: '用户管理',
            icon: <UserOutlined />,
            routes: [
                {
                    path: '/admin/users',
                    name: '用户列表',
                },
                {
                    path: '/admin/users/roles',
                    name: '角色管理',
                },
                {
                    path: '/admin/users/permissions',
                    name: '权限设置',
                }
            ]
        },
        {
            path: '/admin/ability_points',
            name: '技术能力管理',
            icon: <UserOutlined />,
            routes: [
                {
                    path: '/admin/ability_points',
                    name: '技术能力列表',
                }
            ]
        },
        {
            path: '/',
            name: '返回前台',
            icon: <AppstoreOutlined />,
            target: '_blank'
        }
    ],
}

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    return (
        <AdminAuthGuard>
            <Template>
                <ProLayout
                    layout="mix"
                    title="犀知管理"
                    logo="/logo.png"
                    route={route}
                    location={{
                        pathname,
                    }}
                    menuItemRender={(item, dom) => (
                        item.target === '_blank' ?
                            <a href={item.path} target="_blank" rel="noopener noreferrer" className="flex items-center">
                                {dom}
                            </a>
                            :
                            <Link href={item.path || '/admin'} className="flex items-center">
                                {dom}
                            </Link>
                    )}
                    fixSiderbar
                    defaultCollapsed={false}
                    siderWidth={220}
                    className="admin-layout"
                    contentStyle={{ padding: '24px' }}
                >
                    <div className="p-6">
                        {children}
                    </div>
                </ProLayout>
                <style jsx global>{`
                    .admin-layout .ant-layout {
                        background: transparent !important;
                    }
                    .admin-layout .ant-pro-sider {
                        background: rgba(255, 255, 255, 0.7) !important;
                        backdrop-filter: blur(12px);
                        border-right: 1px solid rgba(241, 245, 249, 0.6);
                        z-index: 10 !important;
                        transition: all 0.3s ease;
                    }
                    .admin-layout .ant-pro-layout-header {
                        background: rgba(255, 255, 255, 0.7) !important;
                        backdrop-filter: blur(12px);
                        border-bottom: 1px solid rgba(241, 245, 249, 0.6);
                        z-index: 10 !important;
                        transition: all 0.3s ease;
                    }
                    .admin-layout .ant-menu-item:hover {
                        background-color: rgba(236, 72, 153, 0.08) !important;
                    }
                    .admin-layout .ant-pro-layout-content {
                        background: transparent !important;
                        position: relative;
                        z-index: 1;
                    }
                    .admin-layout .ant-pro-layout-header-title {
                        color: transparent !important;
                        background-image: linear-gradient(to right, #ec4899, #06b6d4) !important;
                        -webkit-background-clip: text !important;
                        background-clip: text !important;
                        font-weight: 600 !important;
                    }
                    /* Logo样式 */
                    .ant-pro-sider-logo {
                        padding: 16px !important;
                    }
                    .ant-pro-sider-logo img {
                        border-radius: 8px;
                        box-shadow: 0 2px 12px rgba(0,0,0,0.04);
                        transition: all 0.3s ease;
                    }
                    .ant-pro-sider-logo img:hover {
                        transform: scale(1.05);
                    }
                    /* 菜单项美化 */
                    .ant-menu-item {
                        border-radius: 12px !important;
                        margin: 4px 12px 4px 8px !important;
                    }
                    .ant-menu-item.ant-menu-item-selected {
                        box-shadow: 0 2px 8px rgba(236, 72, 153, 0.15);
                    }
                    /* 子菜单项美化 */
                    .ant-menu-sub .ant-menu-item {
                        margin: 4px 12px 4px 4px !important;
                        padding-left: 32px !important;
                        height: 36px !important;
                        line-height: 36px !important;
                    }
                    .ant-menu-submenu-title {
                        border-radius: 12px !important;
                        margin: 4px 12px 4px 8px !important;
                    }
                    /* 可视化子菜单层次 */
                    .ant-menu-sub {
                        background-color: rgba(249, 250, 251, 0.5) !important;
                        border-radius: 8px !important;
                        margin: 4px 8px !important;
                    }
                    .ant-menu-submenu-selected > .ant-menu-submenu-title {
                        color: #ec4899 !important;
                        background-color: rgba(236, 72, 153, 0.08) !important;
                    }
                    /* 菜单图标 */
                    .ant-menu-item .anticon,
                    .ant-menu-submenu-title .anticon {
                        margin-right: 10px !important;
                        font-size: 18px !important;
                        transition: all 0.3s !important;
                    }
                    .ant-menu-item:hover .anticon,
                    .ant-menu-submenu-title:hover .anticon,
                    .ant-menu-item-selected .anticon,
                    .ant-menu-submenu-selected > .ant-menu-submenu-title .anticon {
                        color: #ec4899 !important;
                    }
                    .ant-menu-title-content {
                        transition: all 0.2s !important;
                    }
                    /* 确保可点击性 */
                    .ant-pro-layout a, 
                    .ant-pro-layout button,
                    .ant-pro-layout input,
                    .ant-pro-layout .ant-dropdown-trigger {
                        position: relative;
                        z-index: 20;
                    }
                    /* 菜单折叠状态 */
                    .ant-menu-inline-collapsed .ant-menu-item,
                    .ant-menu-inline-collapsed .ant-menu-submenu-title {
                        padding-left: 16px !important;
                        padding-right: 16px !important;
                    }
                    .ant-menu-inline-collapsed .ant-menu-item .anticon,
                    .ant-menu-inline-collapsed .ant-menu-submenu-title .anticon {
                        margin-right: 0 !important;
                        font-size: 18px !important;
                    }
                    /* 菜单展开/折叠切换按钮 */
                    .ant-pro-layout-collapsed-button {
                        background: rgba(255, 255, 255, 0.6) !important;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
                        border: 1px solid rgba(241, 245, 249, 0.6) !important;
                    }
                `}</style>
            </Template>
        </AdminAuthGuard>
    )
} 