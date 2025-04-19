"use client"

import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Button, Modal, message as staticMessage, Tooltip, App, Typography, Dropdown, Card, Form, Input } from "antd"
import { PlusOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, ExclamationCircleOutlined, SearchOutlined, ReloadOutlined, MoreOutlined } from "@ant-design/icons"
import type { ProColumns, ActionType, RequestData } from "@ant-design/pro-components"
import dayjs from "dayjs"

interface Domain {
    id: number
    slug: string
    name_zh: string
    name_en: string
    description_zh?: string | null
    description_en?: string | null
    icon?: string | null
    sort_order?: number | null
    extra?: any
    deleted_at?: string | null
    created_at?: string
    updated_at?: string
}

const ProTable = dynamic(
    () => import("@ant-design/pro-components").then(mod => mod.ProTable),
    {
        loading: () => <div style={{ padding: '100px', textAlign: 'center' }}>加载中...</div>, ssr: false,
    }
) as any

function DomainList() {
    const actionRef = useRef<ActionType>()
    const [selectedRows, setSelectedRows] = useState<Domain[]>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState<Domain | null>(null)
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    // 编辑弹窗相关
    const handleEdit = (record: Domain) => {
        console.log('编辑数据:', record)
        setEditing(record)
        setModalOpen(true)
        // 确保在下一个事件循环中设置表单值
        setTimeout(() => {
            form.setFieldsValue({
                slug: record.slug,
                name_zh: record.name_zh,
                name_en: record.name_en,
                description_zh: record.description_zh,
                description_en: record.description_en,
                icon: record.icon,
                sort_order: record.sort_order || 0
            })
        }, 100)
    }
    const handleAdd = () => {
        setEditing(null)
        form.resetFields()
        setModalOpen(true)
    }
    const handleModalOk = async () => {
        setLoading(true)
        try {
            const values = await form.validateFields()
            if (editing) {
                await fetch(`/admin/api/knowledge/domains/${editing.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                })
                staticMessage.success('更新成功')
            } else {
                await fetch('/admin/api/knowledge/domains', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                })
                staticMessage.success('添加成功')
            }
            setModalOpen(false)
            actionRef.current?.reload()
        } catch {
            staticMessage.error('操作失败')
        } finally {
            setLoading(false)
        }
    }
    const handleModalCancel = () => {
        setModalOpen(false)
        setEditing(null)
        form.resetFields()
    }

    // 批量删除
    const handleBatchDelete = async (rows?: Domain[]) => {
        const toDelete = rows || selectedRows
        if (toDelete.length === 0) {
            staticMessage.warning('请先选择要删除的领域')
            return
        }
        Modal.confirm({
            title: `确定要${rows ? '' : '批量'}删除选中的 ${toDelete.length} 个领域吗？`,
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                try {
                    await Promise.all(toDelete.map(row => fetch(`/admin/api/knowledge/domains/${row.id}`, { method: 'DELETE' })))
                    staticMessage.success(`${rows ? '' : '批量'}删除成功`)
                    setSelectedRows([])
                    setSelectedRowKeys([])
                    actionRef.current?.reload()
                } catch {
                    staticMessage.error(`${rows ? '' : '批量'}删除失败`)
                }
            },
        })
    }

    // 导出
    const handleExport = async () => {
        staticMessage.info('导出功能开发中...')
    }

    // 表格列
    const columns: ProColumns<Domain>[] = [
        { title: 'ID', dataIndex: 'id', width: 'auto', search: false },
        { title: 'Slug', dataIndex: 'slug', width: 'auto', copyable: true },
        { title: '中文名', dataIndex: 'name_zh', width: 'auto' },
        { title: '英文名', dataIndex: 'name_en', width: 'auto' },
        { title: '描述(中)', dataIndex: 'description_zh', width: 'auto', ellipsis: true },
        { title: '描述(英)', dataIndex: 'description_en', width: 'auto', ellipsis: true },
        { title: '图标', dataIndex: 'icon', width: 'auto', search: false },
        { title: '排序', dataIndex: 'sort_order', width: 'auto', search: false },
        {
            title: '创建时间',
            dataIndex: 'created_at',
            valueType: 'dateTime',
            width: 'auto',
            search: false,
            render: (_, record) => record.created_at ? dayjs(record.created_at).format('YYYY-MM-DD HH:mm:ss') : '-',
        },
        {
            title: '操作',
            key: 'action',
            width: 'auto',
            valueType: 'option',
            // fixed: 'right',
            render: (_, record) => {
                const items = [
                    {
                        key: 'edit',
                        label: '编辑',
                        icon: <EditOutlined />,
                        onClick: () => handleEdit(record),
                    },
                    {
                        key: 'delete',
                        label: '删除',
                        icon: <DeleteOutlined />,
                        danger: true,
                        onClick: () => handleBatchDelete([record]),
                    },
                ]
                return (
                    <Dropdown menu={{ items }} trigger={['click']}>
                        <Button type="text" icon={<MoreOutlined />} />
                    </Dropdown>
                )
            },
        },
    ]

    // 搜索表单配置
    const search = {
        labelWidth: 'auto',
        defaultCollapsed: true,
        optionRender: ({ searchText, resetText }: { searchText: string, resetText: string }, { form }: { form: any }) => [
            <Button key="search" type="primary" size="small" onClick={() => form?.submit()} icon={<SearchOutlined />}>{searchText}</Button>,
            <Button key="reset" size="small" onClick={() => { form?.resetFields(); form?.submit() }} icon={<ReloadOutlined />}>{resetText}</Button>,
        ],
    }

    // 工具栏
    const toolBarRender = () => [
        <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加领域</Button>,
        <Button key="batchDelete" icon={<DeleteOutlined />} danger disabled={selectedRows.length === 0} onClick={() => handleBatchDelete()}>批量删除</Button>,
        <Button key="export" icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>,
    ]

    return (
        <Card >
            <ProTable<Domain>
                columns={columns}
                actionRef={actionRef}
                rowKey={(record: Domain) => record.id}
                request={async (params: any): Promise<Partial<RequestData<Domain>>> => {
                    const { current, pageSize, ...filters } = params
                    // 过滤掉空字符串和 undefined 的参数
                    const validFilters: Record<string, any> = {}
                    Object.entries(filters).forEach(([key, value]) => {
                        if (value !== '' && value !== undefined) {
                            validFilters[key] = value
                        }
                    })
                    const queryParams = new URLSearchParams({
                        page: (current || 1).toString(),
                        pageSize: (pageSize || 10).toString(),
                        ...validFilters,
                    })
                    const res = await fetch(`/admin/api/knowledge/domains?${queryParams}`)
                    const json = await res.json() as any
                    return {
                        data: json.data,
                        success: true,
                        total: json.total,
                    }
                }}
                search={search}
                dateFormatter="string"
                rowSelection={{
                    selectedRowKeys,
                    onChange: (keys: any[], rows: Domain[]) => {
                        setSelectedRowKeys(keys)
                        setSelectedRows(rows)
                    },
                }}
                toolBarRender={toolBarRender}
                pagination={{
                    defaultPageSize: 10,
                    showQuickJumper: true,
                    showSizeChanger: true,
                    pageSizeOptions: ['10', '20', '50', '100'],
                }}
            />
            <Modal
                title={editing ? '编辑领域' : '添加领域'}
                open={modalOpen}
                onCancel={handleModalCancel}
                onOk={handleModalOk}
                confirmLoading={loading}
                destroyOnClose
            >
                <Form
                    form={form}
                    layout="vertical"
                    preserve={false}
                >
                    <Form.Item name="slug" label="Slug" rules={[{ required: true, message: '请输入 Slug' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="name_zh" label="中文名" rules={[{ required: true, message: '请输入中文名' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="name_en" label="英文名" rules={[{ required: true, message: '请输入英文名' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="description_zh" label="描述(中)">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item name="description_en" label="描述(英)">
                        <Input.TextArea rows={2} />
                    </Form.Item>
                    <Form.Item name="icon" label="图标">
                        <Input />
                    </Form.Item>
                    <Form.Item name="sort_order" label="排序" initialValue={0}>
                        <Input type="number" />
                    </Form.Item>
                </Form>
            </Modal>
        </Card>
    )
}

export default DomainList 