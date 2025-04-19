'use client'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { memo } from 'react'

const Template = memo(function Template({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider
            locale={zhCN}
            theme={{
                // 只保留最基本的主题色配置，其他使用默认值
                token: {
                    colorPrimary: '#1890ff', // 使用 antd 默认蓝色
                },
            }}
            componentSize="middle"
        >
            <div>
                {children}
            </div>
        </ConfigProvider>
    )
})

export default Template 