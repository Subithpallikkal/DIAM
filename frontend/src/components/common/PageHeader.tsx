import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Breadcrumb, Space } from 'antd'

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
    <div className="flex shrink-0 flex-col gap-1.5 md:flex-row md:items-center md:justify-between md:gap-3">
      <div className="min-w-0 flex-1">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb
            className="mb-0.5 hidden text-xs md:block"
            items={breadcrumbs.map((item) => ({
              title: item.href ? <Link to={item.href}>{item.title}</Link> : item.title,
            }))}
          />
        )}
        <Space direction="vertical" size={0} className="w-full">
          <h1 className="m-0 text-base font-semibold tracking-tight text-[#34495e] md:text-lg">
            {title}
          </h1>
          {subtitle && (
            <p className="m-0 hidden text-xs text-slate-500 md:block">{subtitle}</p>
          )}
        </Space>
      </div>
      {extra && (
        <div className="w-full shrink-0 sm:w-auto [&_.ant-btn-primary]:!border-[#1abc9c] [&_.ant-btn-primary]:!bg-[#1abc9c] [&_.ant-btn]:w-full hover:[&_.ant-btn-primary]:!border-[#16a085] hover:[&_.ant-btn-primary]:!bg-[#16a085] sm:[&_.ant-btn]:w-auto">
          {extra}
        </div>
      )}
    </div>
  )
}
