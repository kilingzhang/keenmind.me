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
        loading: () => <div className="min-h-screen animate-pulse bg-gray-100" />,
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
        },
        {
            path: '/admin/settings',
            name: '系统设置',
            icon: <SettingOutlined />,
        },
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
                        <Link href={item.path || '/admin'}>
                            {dom}
                        </Link>
                    )}
                    fixSiderbar
                    defaultCollapsed={false}
                >
                    {children}
                </ProLayout>
            </Template>
        </AdminAuthGuard>
    )
} 