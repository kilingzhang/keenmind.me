"use client"

import { useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Button, Modal, message as staticMessage, Tooltip, App, Typography, Dropdown, Card, Form, Input } from "antd"
import { PlusOutlined, DeleteOutlined, DownloadOutlined, EditOutlined, ExclamationCircleOutlined, SearchOutlined, ReloadOutlined, MoreOutlined } from "@ant-design/icons"
import type { ProColumns, ActionType, RequestData } from "@ant-design/pro-components"
import dayjs from "dayjs"

interface Topic {
    id: number
    slug: string
    name_zh: string
    name_en: string
    description_zh?: string | null
    description_en?: string | null
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

function TopicList() {
    const actionRef = useRef<ActionType>()
    const [selectedRows, setSelectedRows] = useState<Topic[]>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([])
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState<Topic | null>(null)
    const [form] = Form.useForm()
    const [loading, setLoading] = useState(false)

    // 编辑弹窗相关
    const handleEdit = (record: Topic) => {
        setEditing(record)
        setModalOpen(true)
        setTimeout(() => {
            form.setFieldsValue({
                slug: record.slug,
                name_zh: record.name_zh,
                name_en: record.name_en,
                description_zh: record.description_zh,
                description_en: record.description_en,
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
                await fetch(`/admin/api/knowledge/topics/${editing.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(values),
                })
                staticMessage.success('更新成功')
            } else {
                await fetch('/admin/api/knowledge/topics', {
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
    const handleBatchDelete = async (rows?: Topic[]) => {
        const toDelete = rows || selectedRows
        if (toDelete.length === 0) {
            staticMessage.warning('请先选择要删除的主题')
            return
        }
        Modal.confirm({
            title: `确定要${rows ? '' : '批量'}删除选中的 ${toDelete.length} 个主题吗？`,
            icon: <ExclamationCircleOutlined />,
            onOk: async () => {
                try {
                    await Promise.all(toDelete.map(row => fetch(`/admin/api/knowledge/topics/${row.id}`, { method: 'DELETE' })))
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
    const columns: ProColumns<Topic>[] = [
        { title: 'ID', dataIndex: 'id', width: 'auto', search: false },
        { title: 'Slug', dataIndex: 'slug', width: 'auto', copyable: true },
        { title: '中文名', dataIndex: 'name_zh', width: 'auto' },
        { title: '英文名', dataIndex: 'name_en', width: 'auto' },
        { title: '描述(中)', dataIndex: 'description_zh', width: 'auto', ellipsis: true },
        { title: '描述(英)', dataIndex: 'description_en', width: 'auto', ellipsis: true },
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
        <Button key="add" type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加主题</Button>,
        <Button key="batchDelete" icon={<DeleteOutlined />} danger disabled={selectedRows.length === 0} onClick={() => handleBatchDelete()}>批量删除</Button>,
        <Button key="export" icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>,
    ]

    return (
        <Card >
            <ProTable<Topic>
                columns={columns}
                actionRef={actionRef}
                rowKey={(record: Topic) => record.id}
                request={async (params: any): Promise<Partial<RequestData<Topic>>> => {
                    const { current, pageSize, ...filters } = params
                    // 过滤掉空字符串和 undefined 的参数
                    const queryParams = Object.entries({ ...filters, page: current, pageSize })
                        .filter(([_, v]) => v !== '' && v !== undefined)
                        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v as string)}`)
                        .join('&')
                    const res = await fetch(`/admin/api/knowledge/topics?${queryParams}`)
                    const data = await res.json() as any
                    return {
                        data: data.data,
                        total: data.total,
                        success: true,
                    }
                }}
                rowSelection={{
                    selectedRowKeys,
                    onChange: (keys: any[], rows: Topic[]) => {
                        setSelectedRowKeys(keys as number[])
                        setSelectedRows(rows)
                    },
                }}
                search={search}
                toolBarRender={toolBarRender}
                pagination={{ showQuickJumper: true }}
                options={{ reload: true, density: false, setting: false }}
                bordered
                size="small"
            />
            <Modal
                title={editing ? '编辑主题' : '添加主题'}
                open={modalOpen}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                confirmLoading={loading}
                destroyOnClose
            >
                <Form form={form} layout="vertical" preserve={false} initialValues={{ sort_order: 0 }}>
                    <Form.Item name="slug" label="Slug" rules={[{ required: true, message: '请输入唯一标识' }]}> <Input /> </Form.Item>
                    <Form.Item name="name_zh" label="中文名" rules={[{ required: true, message: '请输入中文名' }]}> <Input /> </Form.Item>
                    <Form.Item name="name_en" label="英文名" rules={[{ required: true, message: '请输入英文名' }]}> <Input /> </Form.Item>
                    <Form.Item name="description_zh" label="描述(中)"> <Input.TextArea rows={2} /> </Form.Item>
                    <Form.Item name="description_en" label="描述(英)"> <Input.TextArea rows={2} /> </Form.Item>
                    <Form.Item name="sort_order" label="排序"> <Input type="number" /> </Form.Item>
                </Form>
            </Modal>
        </Card>
    )
}

export default TopicList 