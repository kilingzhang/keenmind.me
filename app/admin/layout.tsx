'use client'

import AdminAuthGuard from '@/components/admin/auth-guard'
import dynamic from 'next/dynamic'
import { HomeOutlined, UserOutlined, SettingOutlined } from '@ant-design/icons'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Template from './template'
import 'antd/dist/reset.css'

// 动态导入 ProLayout
const ProLayout = dynamic(
    () => import('@ant-design/pro-components').then(mod => mod.ProLayout),
    {
        loading: () => <div className="animate-pulse bg-gray-100" />,
        ssr: false // 禁用服务端渲染以避免水合问题
    }
)

const route = {
    path: '/admin',
    routes: [
        {
            path: '/admin',
            name: '仪表盘',
            icon: <HomeOutlined />,
        },
        {
            path: '/admin/users',
            name: '用户管理',
            icon: <UserOutlined />,
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
                    title="犀知后台"
                    logo={null}
                    route={route}
                    location={{
                        pathname,
                    }}
                    menuItemRender={(item, dom) => (
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
                    <div className="p-4">
                        {children}
                    </div>
                </ProLayout>
                <style jsx global>{`
                    .admin-layout .ant-layout {
                        background: transparent !important;
                    }
                    .admin-layout .ant-pro-sider {
                        background: rgba(255, 255, 255, 0.6) !important;
                        backdrop-filter: blur(10px);
                        border-right: 1px solid rgba(241, 245, 249, 0.5);
                        z-index: 10 !important;
                    }
                    .admin-layout .ant-pro-layout-header {
                        background: rgba(255, 255, 255, 0.6) !important;
                        backdrop-filter: blur(10px);
                        border-bottom: 1px solid rgba(241, 245, 249, 0.5);
                        z-index: 10 !important;
                    }
                    .admin-layout .ant-menu-item:hover {
                        background-color: rgba(236, 72, 153, 0.05) !important;
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
                        font-weight: 500 !important;
                    }
                    /* 确保可点击性 */
                    .ant-pro-layout a, 
                    .ant-pro-layout button,
                    .ant-pro-layout input,
                    .ant-pro-layout .ant-dropdown-trigger {
                        position: relative;
                        z-index: 20;
                    }
                `}</style>
            </Template>
        </AdminAuthGuard>
    )
} 