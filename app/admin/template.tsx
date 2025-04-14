'use client'

import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { memo } from 'react'

const Template = memo(function Template({ children }: { children: React.ReactNode }) {
    return (
        <ConfigProvider
            locale={zhCN}
            theme={{
                token: {
                    colorPrimary: '#4f46e5',
                },
            }}
            renderEmpty={() => <div className="p-4 text-center text-gray-500">暂无数据</div>}
            componentSize="middle"
            space={{ size: 'middle' }}
            virtual={true}
        >
            {children}
        </ConfigProvider>
    )
})

export default Template 