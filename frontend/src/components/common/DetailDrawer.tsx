import type { ReactNode } from 'react'
import { CloseOutlined } from '@ant-design/icons'
import { Drawer } from 'antd'
import { Loader } from './Loader'
import { cn } from '../../utils/cn'

export interface DetailDrawerProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  subtitle?: string
  loading?: boolean
  width?: number | string
  children: ReactNode
  footer?: ReactNode
  className?: string
}

export function DetailDrawer({
  open,
  onClose,
  title,
  subtitle,
  loading = false,
  width = 520,
  children,
  footer,
  className,
}: DetailDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      placement="right"
      width={width}
      destroyOnClose
      closable={false}
      mask
      className={cn(
        '[&_.ant-drawer-content]:rounded-l-lg [&_.ant-drawer-body]:flex [&_.ant-drawer-body]:h-full [&_.ant-drawer-body]:flex-col [&_.ant-drawer-body]:overflow-hidden [&_.ant-drawer-body]:p-0',
        className,
      )}
      styles={{ wrapper: { maxWidth: '100vw' } }}
    >
      <div className="flex h-full min-h-0 flex-col bg-surface">
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border bg-white px-4 py-3">
          <div className="min-w-0 flex-1 pr-2">
            {title ? (
              <h2 className="m-0 truncate text-base font-semibold text-brand-dark">{title}</h2>
            ) : (
              <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
            )}
            {subtitle && <p className="m-0 mt-0.5 truncate text-xs text-slate-500">{subtitle}</p>}
          </div>
          <button
            type="button"
            aria-label="Close details"
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-border bg-white text-slate-500 transition-colors hover:border-brand hover:text-brand"
          >
            <CloseOutlined className="text-sm" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader />
            </div>
          ) : (
            children
          )}
        </div>

        {footer ? (
          <div className="shrink-0 border-t border-border bg-white px-4 py-3">{footer}</div>
        ) : null}
      </div>
    </Drawer>
  )
}
