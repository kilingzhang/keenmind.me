'use client'

import AdminAuthGuard from '@/components/admin/auth-guard'
import dynamic from 'next/dynamic'
import { HomeOutlined, UserOutlined, AppstoreOutlined, BookOutlined } from '@ant-design/icons'
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
                    path: '/admin/users/accounts',
                    name: '账户',
                },
                {
                    path: '/admin/users/roles',
                    name: '角色',
                },
                {
                    path: '/admin/users/permissions',
                    name: '权限',
                }
            ]
        },
        {
            path: '/admin/knowledge',
            name: '知识管理',
            icon: <BookOutlined />,
            routes: [
                {
                    path: '/admin/knowledge/domains',
                    name: '领域',
                },
                {
                    path: '/admin/knowledge/topics',
                    name: '主题',
                },
                {
                    path: '/admin/knowledge/tags',
                    name: '标签',
                },
                {
                    path: '/admin/knowledge/points',
                    name: '知识点',
                },
                {
                    path: '/admin/knowledge/questions',
                    name: '问题',
                },
                {
                    path: '/admin/knowledge/answers',
                    name: '答案',
                },
                {
                    path: '/admin/knowledge/users-answers',
                    name: '用户回答',
                },
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