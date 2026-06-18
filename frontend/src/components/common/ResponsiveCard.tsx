import type { ReactNode } from 'react'
import { Card, type CardProps } from 'antd'
import { cn } from '../../utils/cn'

interface ResponsiveCardProps extends CardProps {
  children: ReactNode
}

export function ResponsiveCard({ className, ...props }: ResponsiveCardProps) {
  return (
    <Card
      {...props}
      bordered={props.bordered ?? false}
      className={cn(
        '!rounded-2xl !shadow-sm',
        '[&_.ant-card-head]:flex-wrap [&_.ant-card-head]:gap-2',
        '[&_.ant-card-head-title]:min-w-0 [&_.ant-card-head-title]:flex-1',
        '[&_.ant-card-extra]:ml-0 [&_.ant-card-extra]:w-full sm:[&_.ant-card-extra]:w-auto',
        className,
      )}
    />
  )
}
