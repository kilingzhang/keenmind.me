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
        loading: () => <div style={{ height: "100vh" }}>加载中...</div>,
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
                    path: '/admin/users/list',
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
            path: '/admin/domains',
            name: '领域管理',
            icon: <UserOutlined />,
            routes: [
                {
                    path: '/admin/domains/list',
                    name: '领域列表',
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
                            <a href={item.path} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
                                {dom}
                            </a>
                            :
                            <Link href={item.path || '/admin'} style={{ display: 'flex', alignItems: 'center' }}>
                                {dom}
                            </Link>
                    )}
                    fixSiderbar
                    defaultCollapsed={false}
                    siderWidth={220}
                    contentStyle={{ padding: '24px' }}
                >
                    <div style={{ padding: '24px' }}>
                        {children}
                    </div>
                </ProLayout>
            </Template>
        </AdminAuthGuard>
    )
} 