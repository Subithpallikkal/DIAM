import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Space, Typography } from 'antd'

const { Title, Text } = Typography

interface BreadcrumbItem {
  title: string
  href?: string
}

interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: BreadcrumbItem[]
  extra?: ReactNode
}

export function PageHeader({ title, subtitle, breadcrumbs, extra }: PageHeaderProps) {
  return (
    <div className="flex shrink-0 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb
            className="mb-2 hidden text-sm sm:block"
            items={breadcrumbs.map((item) => ({
              title: item.href ? <Link to={item.href}>{item.title}</Link> : item.title,
            }))}
          />
        )}
        <Space direction="vertical" size={4} className="w-full">
          <Title level={3} className="!m-0 !text-xl sm:!text-2xl">
            {title}
          </Title>
          {subtitle && (
            <Text type="secondary" className="text-sm sm:text-base">
              {subtitle}
            </Text>
          )}
        </Space>
      </div>
      {extra && (
        <div className="w-full shrink-0 sm:w-auto [&_.ant-btn]:w-full sm:[&_.ant-btn]:w-auto">
          {extra}
        </div>
      )}
    </div>
  )
}
