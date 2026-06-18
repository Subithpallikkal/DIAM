import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

interface PageBodyProps {
  children: ReactNode
  className?: string
}

/** Fills the app content area width and height. */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto flex h-full min-h-0 w-full max-w-[1400px] flex-col gap-4 sm:gap-5',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** Scrollable main section; keeps header/filters visible on list pages. */
export function PageBody({ children, className }: PageBodyProps) {
  return (
    <div
      data-page-body
      className={cn('min-h-0 w-full flex-1 overflow-x-hidden overflow-y-auto', className)}
    >
      {children}
    </div>
  )
}
