import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

export interface MobileListCardProps {
  title: string
  badge?: ReactNode
  children?: ReactNode
  actions?: ReactNode
  className?: string
}

export function MobileListCard({ title, badge, children, actions, className }: MobileListCardProps) {
  return (
    <article
      className={cn(
        'overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3 px-4 pt-4">
        <h3 className="m-0 min-w-0 flex-1 text-base font-semibold leading-snug text-slate-900">
          {title}
        </h3>
        {badge ? <div className="shrink-0">{badge}</div> : null}
      </div>

      {children ? <div className="flex flex-col gap-2.5 px-4 pb-4 pt-3">{children}</div> : null}

      {actions ? (
        <div className="grid grid-cols-2 gap-2 border-t border-slate-100 bg-slate-50/50 p-3">
          {actions}
        </div>
      ) : null}
    </article>
  )
}

export interface MobileListRowProps {
  icon: ReactNode
  children: ReactNode
}

export function MobileListRow({ icon, children }: MobileListRowProps) {
  return (
    <div className="flex items-start gap-2.5 text-sm text-slate-600">
      <span className="mt-0.5 shrink-0 text-base text-slate-400">{icon}</span>
      <span className="min-w-0 wrap-break-word">{children}</span>
    </div>
  )
}

export interface MobileListActionButtonProps {
  label: string
  onClick: () => void
  variant?: 'muted' | 'outline' | 'danger'
  className?: string
}

export function MobileListActionButton({
  label,
  onClick,
  variant = 'muted',
  className,
}: MobileListActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-xl px-3 py-2.5 text-sm font-medium transition',
        variant === 'muted' && 'bg-slate-100 text-slate-800 hover:bg-slate-200',
        variant === 'outline' && 'border border-slate-200 bg-white text-slate-800 hover:bg-slate-50',
        variant === 'danger' && 'bg-rose-50 text-rose-700 hover:bg-rose-100',
        className,
      )}
    >
      {label}
    </button>
  )
}

type MobileCardBadgeTone = 'success' | 'danger' | 'warning' | 'info' | 'neutral'

const badgeToneClass: Record<MobileCardBadgeTone, { wrap: string; dot: string }> = {
  success: { wrap: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  danger: { wrap: 'bg-rose-50 text-rose-700', dot: 'bg-rose-500' },
  warning: { wrap: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  info: { wrap: 'bg-sky-50 text-sky-700', dot: 'bg-sky-500' },
  neutral: { wrap: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400' },
}

export function MobileCardBadge({
  label,
  tone = 'neutral',
}: {
  label: string
  tone?: MobileCardBadgeTone
}) {
  const colors = badgeToneClass[tone]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        colors.wrap,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', colors.dot)} />
      {label}
    </span>
  )
}
