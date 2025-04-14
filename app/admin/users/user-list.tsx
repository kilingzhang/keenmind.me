'use client'

import { useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import type { ProColumns, ActionType, RequestData } from '@ant-design/pro-components'
import { LockOutlined, UnlockOutlined, SearchOutlined, ReloadOutlined, DownloadOutlined, UserSwitchOutlined, MoreOutlined, EditOutlined } from '@ant-design/icons'
import { Tag, Button, Space, Modal, message as staticMessage, Tooltip, Card, Dropdown, type MenuProps, App, notification } from 'antd'
import dayjs from 'dayjs'
import type { users, UserStatus } from '@/prisma/client'

interface UsersResponse {
    items: users[]
    total: number
}

// 动态导入组件
const ProTable = dynamic(
    () => import('@ant-design/pro-components').then(mod => mod.ProTable),
    {
        loading: () => <div className="animate-pulse bg-gray-100 h-[400px] rounded-lg" />,
        ssr: false,
    }
) as any // FIXME: 临时解决类型问题，等待 @ant-design/pro-components 更新

// 用户状态标签颜色映射
const statusColorMap: Record<UserStatus, string> = {
    ACTIVE: 'success',
    INACTIVE: 'default',
    LOCKED: 'warning',
    BANNED: 'error'
}

// 用户状态中文映射
const statusTextMap: Record<UserStatus, string> = {
    ACTIVE: '正常',
    INACTIVE: '未激活',
    LOCKED: '已锁定',
    BANNED: '已封禁'
}

function UserListContent() {
    const actionRef = useRef<ActionType>()
    const { message, modal } = App.useApp()
    const [loadingStates, setLoadingStates] = useState<{
        [key: string]: boolean
    }>({})
    const [selectedRows, setSelectedRows] = useState<users[]>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
    const [searchLoading, setSearchLoading] = useState(false)
    const [batchLoading, setBatchLoading] = useState(false)
    const [dataCache, setDataCache] = useState<{
        [key: string]: {
            data: users[]
            total: number
            timestamp: number
        }
    }>({})

    // 设置加载状态的辅助函数
    const setLoading = (id: string | 'export' | 'batch', loading: boolean) => {
        setLoadingStates(prev => ({
            ...prev,
            [id]: loading
        }))
    }

    // 清空数据缓存
    const clearCache = () => {
        console.log(`[${new Date().toISOString()}] Clearing data cache`)
        setDataCache({})
    }

    // 处理编辑
    const handleEdit = (record: users) => {
        modal.info({
            title: '编辑用户',
            content: '编辑用户功能开发中...',
        })
    }

    // 处理锁定
    const handleLock = async (record: users) => {
        try {
            const confirmed = await new Promise(resolve => {
                modal.confirm({
                    title: '确认锁定',
                    content: `确定要锁定用户 ${record.username || record.nickname || record.id} 吗？`,
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => resolve(true),
                    onCancel: () => resolve(false),
                })
            })

            if (!confirmed) return

            setLoading(record.id.toString(), true)
            const response = await fetch(`/admin/api/users/${record.id}/lock`, {
                method: 'POST',
            })

            if (!response.ok) {
                const errorData = await response.json() as { error?: string }
                throw new Error(errorData.error || 'Failed to lock user')
            }

            message.success('用户已锁定')
            clearCache() // 清空缓存

            // 调试日志
            if (actionRef.current) {
                console.log(`[${new Date().toISOString()}] Attempting to reload table after lock for user: ${record.id}`)
                actionRef.current.reload()
            } else {
                console.error(`[${new Date().toISOString()}] actionRef.current is null after lock for user: ${record.id}`)
            }
        } catch (error) {
            console.error('Failed to lock user:', error)
            message.error(error instanceof Error ? error.message : '锁定用户失败')
        } finally {
            setLoading(record.id.toString(), false)
        }
    }

    // 处理解锁
    const handleUnlock = async (record: users) => {
        try {
            const confirmed = await new Promise(resolve => {
                modal.confirm({
                    title: '确认解锁',
                    content: `确定要解锁用户 ${record.username || record.nickname || record.id} 吗？`,
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => resolve(true),
                    onCancel: () => resolve(false),
                })
            })

            if (!confirmed) return

            setLoading(record.id.toString(), true)
            const response = await fetch(`/admin/api/users/${record.id}/unlock`, {
                method: 'POST',
            })

            if (!response.ok) {
                const errorData = await response.json() as { error?: string }
                throw new Error(errorData.error || 'Failed to unlock user')
            }

            message.success('用户已解锁')
            clearCache() // 清空缓存

            // 调试日志
            if (actionRef.current) {
                console.log(`[${new Date().toISOString()}] Attempting to reload table after unlock for user: ${record.id}`)
                actionRef.current.reload()
            } else {
                console.error(`[${new Date().toISOString()}] actionRef.current is null after unlock for user: ${record.id}`)
            }
        } catch (error) {
            console.error('Failed to unlock user:', error)
            message.error(error instanceof Error ? error.message : '解锁用户失败')
        } finally {
            setLoading(record.id.toString(), false)
        }
    }

    // 处理导出
    const handleExport = async () => {
        try {
            setLoading('export', true)
            // TODO: 实现实际的导出逻辑
            message.info('导出功能开发中')
        } finally {
            setLoading('export', false)
        }
    }

    // 批量操作
    const handleBatchAction = async (action: 'lock' | 'unlock') => {
        if (selectedRows.length === 0) {
            message.warning('请先选择用户')
            return
        }

        try {
            setBatchLoading(true)
            const actionName = action === 'lock' ? '锁定' : '解锁'

            const confirmed = await new Promise(resolve => {
                modal.confirm({
                    title: `确认批量${actionName}`,
                    content: `确定要${actionName}选中的 ${selectedRows.length} 个用户吗？`,
                    okText: '确认',
                    cancelText: '取消',
                    onOk: () => resolve(true),
                    onCancel: () => resolve(false),
                })
            })

            if (!confirmed) return

            // 批量处理
            const promises = selectedRows.map(user =>
                fetch(`/admin/api/users/${user.id}/${action}`, {
                    method: 'POST',
                })
            )

            const results = await Promise.allSettled(promises)
            const succeeded = results.filter(r => r.status === 'fulfilled').length
            const failed = results.filter(r => r.status === 'rejected').length

            if (failed > 0) {
                message.warning(`批量${actionName}完成，成功: ${succeeded}，失败: ${failed}`)
            } else {
                message.success(`批量${actionName}成功，共处理 ${succeeded} 个用户`)
            }

            // 清空选择并刷新
            clearCache() // 清空缓存
            setSelectedRowKeys([])
            setSelectedRows([])
            actionRef.current?.reload()
        } catch (error) {
            console.error(`Batch ${action} failed:`, error)
            message.error(`批量操作失败: ${error instanceof Error ? error.message : '未知错误'}`)
        } finally {
            setBatchLoading(false)
        }
    }

    // 批量操作菜单
    const batchActionItems: MenuProps['items'] = [
        {
            key: 'lock',
            label: '批量锁定',
            icon: <LockOutlined />,
            onClick: () => handleBatchAction('lock'),
        },
        {
            key: 'unlock',
            label: '批量解锁',
            icon: <UnlockOutlined />,
            onClick: () => handleBatchAction('unlock'),
        },
    ]

    // 定义表格列
    const columns: ProColumns<users>[] = [
        {
            title: '用户ID',
            dataIndex: 'id',
            copyable: true,
            width: 'auto',
            render: (_, record) => record.id.toString(),
        },
        {
            title: '用户名',
            dataIndex: 'username',
            copyable: true,
            width: 'auto',
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
            width: 'auto',
        },
        {
            title: '邮箱',
            dataIndex: 'email',
            copyable: true,
            render: (_, record) => (
                <Space>
                    {record.email}
                    {record.email_verified && <Tag color="success">已验证</Tag>}
                </Space>
            ),
        },
        {
            title: '手机',
            dataIndex: 'phone',
            copyable: true,
            render: (_, record) => (
                <Space>
                    {record.phone}
                    {record.phone_verified && <Tag color="success">已验证</Tag>}
                </Space>
            ),
        },
        {
            title: '状态',
            dataIndex: 'status',
            width: 'auto',
            valueEnum: {
                ACTIVE: { text: '正常', status: 'Success' },
                INACTIVE: { text: '未激活', status: 'Default' },
                LOCKED: { text: '已锁定', status: 'Warning' },
                BANNED: { text: '已封禁', status: 'Error' },
            },
            render: (_, record) => (
                <Tag color={statusColorMap[record.status]}>
                    {statusTextMap[record.status]}
                </Tag>
            ),
        },
        {
            title: '注册时间',
            dataIndex: 'created_at',
            valueType: 'dateTime',
            width: 'auto',
            search: false,
            sorter: (a, b) => dayjs(a.created_at).unix() - dayjs(b.created_at).unix(),
        },
        {
            title: '最后登录',
            dataIndex: 'last_login_at',
            valueType: 'dateTime',
            width: 'auto',
            search: false,
            sorter: (a, b) => dayjs(a.last_login_at).unix() - dayjs(b.last_login_at).unix(),
        },
        {
            title: '操作',
            width: 60,
            valueType: 'option',
            fixed: 'right',
            render: (_, record) => {
                const items: MenuProps['items'] = [
                    {
                        key: 'edit',
                        label: '编辑',
                        icon: <EditOutlined />,
                        onClick: () => handleEdit(record),
                    },
                    record.status === 'ACTIVE' ? {
                        key: 'lock',
                        label: '锁定',
                        icon: <LockOutlined />,
                        danger: true,
                        onClick: () => handleLock(record),
                    } : {
                        key: 'unlock',
                        label: '解锁',
                        icon: <UnlockOutlined />,
                        onClick: () => handleUnlock(record),
                    },
                ];

                return (
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <Button type="link" icon={<MoreOutlined />} loading={loadingStates[record.id.toString()]} />
                    </Dropdown>
                )
            },
        },
    ]

    // 缓存请求数据
    const cacheKey = (params: any) => {
        const { current, pageSize, ...filters } = params
        return JSON.stringify({ current, pageSize, filters })
    }

    // 检查缓存是否有效
    const isCacheValid = (key: string) => {
        const cache = dataCache[key]
        if (!cache) return false

        // 缓存有效期：30秒
        const now = Date.now()
        return now - cache.timestamp < 30000
    }

    return (
        <Card>
            <ProTable<users>
                columns={columns}
                actionRef={actionRef}
                rowKey={(record: users) => record.id.toString()}
                request={async (
                    params: {
                        current?: number
                        pageSize?: number
                        keyword?: string
                        username?: string
                        nickname?: string
                        email?: string
                        phone?: string
                        status?: string
                    } & Record<string, any>
                ): Promise<Partial<RequestData<users>>> => {
                    // 调试日志
                    console.log(`[${new Date().toISOString()}] ProTable request triggered with params:`, params)

                    const key = cacheKey(params)

                    // 检查缓存
                    if (isCacheValid(key)) {
                        console.log(`[${new Date().toISOString()}] Using cached data for key: ${key}`)
                        const { data, total } = dataCache[key]
                        return {
                            data,
                            success: true,
                            total
                        }
                    }

                    console.log(`[${new Date().toISOString()}] Cache invalid or not found for key: ${key}. Fetching new data...`)
                    setSearchLoading(true)
                    try {
                        const { current, pageSize, ...filters } = params

                        // 构建查询参数
                        const queryParams = new URLSearchParams({
                            page: (current || 1).toString(),
                            pageSize: (pageSize || 10).toString(),
                        })

                        // 添加所有非空筛选条件
                        Object.entries(filters).forEach(([key, value]) => {
                            if (value !== undefined && value !== null && value !== '') {
                                queryParams.append(key, String(value))
                            }
                        })

                        const response = await fetch(`/admin/api/users?${queryParams}`, {
                            cache: 'no-cache'
                        })

                        if (!response.ok) {
                            console.error(`[${new Date().toISOString()}] API request failed:`, response.status, response.statusText)
                            throw new Error('Failed to fetch users')
                        }

                        const { items, total } = await response.json() as UsersResponse
                        console.log(`[${new Date().toISOString()}] Fetched ${items.length} users, total: ${total}`)

                        // 更新缓存
                        setDataCache(prev => ({
                            ...prev,
                            [key]: {
                                data: items,
                                total,
                                timestamp: Date.now()
                            }
                        }))

                        return {
                            data: items,
                            success: true,
                            total,
                        }
                    } catch (error) {
                        console.error(`[${new Date().toISOString()}] Error fetching users:`, error)
                        message.error('获取用户列表失败，请稍后重试')
                        return {
                            data: [],
                            success: false,
                            total: 0,
                        }
                    } finally {
                        setSearchLoading(false)
                    }
                }}
                search={{
                    labelWidth: 'auto',
                    defaultCollapsed: true,
                    optionRender: ({ searchText, resetText }: { searchText: string, resetText: string }, { form }: { form: any }) => [
                        <Button
                            key="search"
                            type="primary"
                            onClick={() => form?.submit()}
                            icon={<SearchOutlined />}
                            loading={searchLoading}
                        >
                            {searchText}
                        </Button>,
                        <Button
                            key="reset"
                            onClick={() => {
                                form?.resetFields()
                                form?.submit()
                            }}
                            icon={<ReloadOutlined />}
                        >
                            {resetText}
                        </Button>,
                    ],
                }}
                form={{
                    syncToUrl: true,
                }}
                dateFormatter="string"
                rowSelection={{
                    selectedRowKeys,
                    onChange: (keys: any[], rows: users[]) => {
                        setSelectedRowKeys(keys)
                        setSelectedRows(rows)
                    },
                }}
                toolBarRender={() => [
                    <Dropdown
                        key="batch"
                        menu={{ items: batchActionItems }}
                        disabled={selectedRows.length === 0}
                    >
                        <Button
                            type="primary"
                            loading={batchLoading}
                            disabled={selectedRows.length === 0}
                            icon={<UserSwitchOutlined />}
                        >
                            批量操作 {selectedRows.length > 0 ? `(${selectedRows.length})` : ''}
                        </Button>
                    </Dropdown>,
                    <Tooltip key="tooltip" title={selectedRows.length === 0 ? '请先选择用户' : undefined}>
                        <Button
                            key="export"
                            type="primary"
                            loading={loadingStates['export']}
                            disabled={selectedRows.length === 0}
                            onClick={handleExport}
                            icon={<DownloadOutlined />}
                        >
                            导出所选用户 {selectedRows.length > 0 ? `(${selectedRows.length})` : ''}
                        </Button>
                    </Tooltip>,
                ]}
                pagination={{
                    defaultPageSize: 10,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                }}
            />
        </Card>
    )
}

export default function UserList() {
    return (
        <App>
            <UserListContent />
        </App>
    )
} 