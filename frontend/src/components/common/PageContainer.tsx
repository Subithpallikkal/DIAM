import type { ReactNode } from 'react'
import { cn } from '../../utils/cn'

interface PageContainerProps {
  children: ReactNode
  className?: string
}

/** Fills the app content area width and height. */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto flex h-full min-h-0 w-full max-w-none flex-1 flex-col gap-1 md:gap-1.5',
        className,
      )}
    >
      {children}
    </div>
  )
}

interface PageBodyProps {
  children: ReactNode
  className?: string
  /** Use on list pages so the table + pagination fill the viewport height. */
  variant?: 'scroll' | 'fill'
}

/** Main content area below the page header. */
export function PageBody({ children, className, variant = 'scroll' }: PageBodyProps) {
  return (
    <div
      data-page-body
      data-page-body-variant={variant}
      className={cn(
        'flex min-h-0 w-full flex-1 flex-col',
        variant === 'fill'
          ? 'flex flex-col overflow-hidden [&>*:only-child]:min-h-0 [&>*:only-child]:flex-1'
          : 'overflow-x-hidden overflow-y-auto',
        className,
      )}
    >
      {children}
    </div>
  )
}
