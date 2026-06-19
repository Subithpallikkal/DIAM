import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface DetailFieldRowProps {
  label: string
  children: ReactNode
  className?: string
}

export function DetailFieldList({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'divide-y divide-border overflow-hidden rounded-lg border border-border bg-white',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function DetailFieldRow({ label, children, className }: DetailFieldRowProps) {
  return (
    <div className={cn('flex items-start gap-3 px-3 py-2.5', className)}>
      <span className="w-28 shrink-0 pt-0.5 text-xs font-medium text-slate-500">{label}</span>
      <div className="min-w-0 flex-1 text-sm text-brand-dark">{children}</div>
    </div>
  )
}
