import type { ReactNode } from 'react'
import { SearchOutlined } from '@ant-design/icons'
import { Input } from './Input'
import { inputFieldClass } from '../../lib/ui'
import { cn } from '../../utils/cn'

export interface PageToolbarProps {
  search?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  actions?: ReactNode
  className?: string
}

export function PageToolbar({
  search = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  actions,
  className,
}: PageToolbarProps) {
  const showSearch = onSearchChange !== undefined

  if (!showSearch && !actions) {
    return null
  }

  return (
    <div
      className={cn(
        'flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center sm:gap-3',
        className,
      )}
    >
      {showSearch && (
        <div className="min-w-0 flex-1">
          <Input
            allowClear
            prefix={<SearchOutlined className="text-slate-400" />}
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className={cn(inputFieldClass, 'w-full')}
            aria-label={searchPlaceholder}
          />
        </div>
      )}
      {actions ? (
        <div
          className={cn(
            'flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row sm:items-center',
            '[&_.ant-btn-primary]:border-brand! [&_.ant-btn-primary]:bg-brand!',
            'hover:[&_.ant-btn-primary]:border-[#16a085]! hover:[&_.ant-btn-primary]:bg-[#16a085]!',
            '[&_.ant-btn]:w-full sm:[&_.ant-btn]:w-auto',
          )}
        >
          {actions}
        </div>
      ) : null}
    </div>
  )
}
