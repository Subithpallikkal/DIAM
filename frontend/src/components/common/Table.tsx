import { Table as AntTable, Pagination, type TableProps } from 'antd'
import { Grid } from 'antd'
import type { TablePaginationConfig } from 'antd/es/table/interface'
import { useCallback, useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from 'react'
import { cn } from '../../utils/cn'

export function TableActions({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-nowrap items-center justify-center gap-0 whitespace-nowrap">
      {children}
    </div>
  )
}

function useTableBodyHeight(enabled: boolean, revision: number) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLDivElement>(null)
  const [scrollY, setScrollY] = useState(240)

  const update = useCallback(() => {
    if (!enabled) return

    const bodySlot = bodyRef.current
    if (!bodySlot) return

    const header = bodySlot.querySelector('.ant-table-thead') as HTMLElement | null
    const headerHeight = header?.offsetHeight ?? 30
    const next = bodySlot.clientHeight - headerHeight

    if (next > 80) {
      setScrollY(next)
    }
  }, [enabled])

  useLayoutEffect(() => {
    if (!enabled) return

    update()

    const resizeObserver = new ResizeObserver(update)
    if (wrapperRef.current) resizeObserver.observe(wrapperRef.current)
    if (bodyRef.current) resizeObserver.observe(bodyRef.current)
    if (footerRef.current) resizeObserver.observe(footerRef.current)

    const mutationObserver = new MutationObserver(update)
    if (bodyRef.current) {
      mutationObserver.observe(bodyRef.current, { childList: true, subtree: true })
    }

    window.addEventListener('resize', update)

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
      window.removeEventListener('resize', update)
    }
  }, [enabled, update, revision])

  return { wrapperRef, bodyRef, footerRef, scrollY }
}

function usePinnedTableBodyScroll(
  bodyRef: RefObject<HTMLDivElement | null>,
  scrollY: number,
  enabled: boolean,
  revision: number,
) {
  useLayoutEffect(() => {
    if (!enabled) return

    const bodySlot = bodyRef.current
    if (!bodySlot) return

    const scrollTargets = bodySlot.querySelectorAll<HTMLElement>(
      '.ant-table-body, .ant-table-tbody-virtual-holder, .ant-table-content',
    )

    scrollTargets.forEach((element) => {
      element.style.height = `${scrollY}px`
      element.style.maxHeight = `${scrollY}px`
      element.style.overflowY = 'auto'
    })
  }, [bodyRef, scrollY, enabled, revision])
}

const tableShellClass = cn(
  'flex w-full min-w-0 flex-col overflow-hidden rounded border border-border bg-white shadow-none',
  '[&_.ant-table]:rounded-none [&_.ant-table]:bg-white',
  '[&_.ant-table-thead>tr>th]:border-b! [&_.ant-table-thead>tr>th]:border-r! [&_.ant-table-thead>tr>th]:border-[#455a64]!',
  '[&_.ant-table-thead>tr>th]:bg-[#52606d]! [&_.ant-table-thead>tr>th]:px-2.5! [&_.ant-table-thead>tr>th]:py-1.5!',
  '[&_.ant-table-thead>tr>th]:text-xs! [&_.ant-table-thead>tr>th]:font-bold! [&_.ant-table-thead>tr>th]:leading-none! [&_.ant-table-thead>tr>th]:text-white!',
  '[&_.ant-table-thead>tr>th:last-child]:border-r-0!',
  '[&_.ant-table-thead>tr>th::before]:hidden!',
  '[&_.ant-table-thead>tr>th_.ant-table-column-sorter]:text-white/70!',
  '[&_.ant-table-thead>tr>th_.ant-table-column-sorter-up.active]:text-brand!',
  '[&_.ant-table-thead>tr>th_.ant-table-column-sorter-down.active]:text-brand!',
  '[&_.ant-table-thead>tr>th_.ant-table-filter-trigger.active]:text-brand!',
  '[&_.ant-table-filter-dropdown]:rounded-md!',
  '[&_.ant-table-tbody>tr>td]:border-b [&_.ant-table-tbody>tr>td]:border-r [&_.ant-table-tbody>tr>td]:border-border',
  '[&_.ant-table-tbody>tr>td]:bg-white [&_.ant-table-tbody>tr>td]:px-2.5 [&_.ant-table-tbody>tr>td]:py-1',
  '[&_.ant-table-tbody>tr>td]:text-xs [&_.ant-table-tbody>tr>td]:leading-tight [&_.ant-table-tbody>tr>td]:text-[#2c3e50]',
  '[&_.diam-table-actions-cell]:px-1.5! [&_.diam-table-actions-cell]:py-0.5! [&_.diam-table-actions-cell]:whitespace-nowrap!',
  '[&_.diam-table-actions-cell_.ant-btn]:m-0! [&_.diam-table-actions-cell_.ant-btn]:h-7! [&_.diam-table-actions-cell_.ant-btn]:w-7! [&_.diam-table-actions-cell_.ant-btn]:min-w-7! [&_.diam-table-actions-cell_.ant-btn]:p-0!',
  '[&_.ant-table-tbody>tr>td:last-child]:border-r-0!',
  '[&_.ant-table-tbody>tr:hover>td]:bg-[#f0faf8]!',
  '[&_.ant-table-tbody>tr.ant-table-row-selected>td]:bg-[#dff5ef]!',
  '[&_.ant-table-bordered_.ant-table-cell]:border-border',
)

const tableBodySlotClass = cn(
  'flex min-h-0 flex-1 flex-col overflow-hidden',
  '[&_.ant-table-wrapper]:flex! [&_.ant-table-wrapper]:h-full! [&_.ant-table-wrapper]:min-h-0! [&_.ant-table-wrapper]:flex-1! [&_.ant-table-wrapper]:flex-col!',
  '[&_.ant-spin-nested-loading]:flex! [&_.ant-spin-nested-loading]:h-full! [&_.ant-spin-nested-loading]:min-h-0! [&_.ant-spin-nested-loading]:flex-1! [&_.ant-spin-nested-loading]:flex-col!',
  '[&_.ant-spin-container]:flex! [&_.ant-spin-container]:h-full! [&_.ant-spin-container]:min-h-0! [&_.ant-spin-container]:flex-1! [&_.ant-spin-container]:flex-col!',
  '[&_.ant-table]:flex! [&_.ant-table]:h-full! [&_.ant-table]:min-h-0! [&_.ant-table]:flex-1! [&_.ant-table]:flex-col!',
  '[&_.ant-table-container]:flex! [&_.ant-table-container]:min-h-0! [&_.ant-table-container]:flex-1! [&_.ant-table-container]:flex-col!',
  '[&_.ant-table-header]:shrink-0',
  '[&_.ant-table-body]:min-h-0!',
  '[&_.ant-table-placeholder>td]:border-b! [&_.ant-table-placeholder>td]:border-border!',
)

const paginationFooterClass = cn(
  'shrink-0 border-t border-border bg-white px-3 py-1.5',
  '[&_.ant-pagination]:m-0!',
  '[&_.ant-pagination-item-active]:border-brand! [&_.ant-pagination-item-active]:bg-brand!',
  '[&_.ant-pagination-item-active_a]:text-white!',
  '[&_.ant-pagination-item:hover]:border-brand!',
  '[&_.ant-pagination-item:hover_a]:text-brand!',
)

function mergePaginationConfig(
  pagination: TableProps<unknown>['pagination'],
  defaults: TablePaginationConfig,
): TablePaginationConfig | false {
  if (pagination === false) return false
  if (pagination === undefined) return defaults
  return { ...defaults, ...pagination }
}

export function Table<RecordType extends object = object>(props: TableProps<RecordType>) {
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.sm
  const rowCount = Array.isArray(props.dataSource) ? props.dataSource.length : 0
  const layoutRevision = rowCount + Number(props.loading)

  const defaultPagination: TablePaginationConfig = {
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: !isMobile,
    pageSizeOptions: [10, 20, 50],
    responsive: true,
    simple: isMobile,
    size: 'small' as const,
    showTotal: (total: number, range: [number, number]) =>
      total === 0
        ? 'Showing 0 entries'
        : `Showing ${range[0]} to ${range[1]} of ${total} entries`,
    hideOnSinglePage: false,
  }

  const paginationConfig = mergePaginationConfig(
    props.pagination as TableProps<unknown>['pagination'],
    defaultPagination,
  )
  const showFooter = paginationConfig !== false

  const { wrapperRef, bodyRef, footerRef, scrollY } = useTableBodyHeight(
    showFooter,
    layoutRevision,
  )

  usePinnedTableBodyScroll(bodyRef, scrollY, showFooter, layoutRevision)

  const { pagination: _pagination, scroll, className, ...tableProps } = props

  return (
    <div
      ref={wrapperRef}
      className={cn(tableShellClass, showFooter && 'h-full min-h-0 flex-1')}
    >
      <div ref={bodyRef} className={tableBodySlotClass}>
        <AntTable
          {...tableProps}
          bordered={props.bordered ?? true}
          size={props.size ?? 'small'}
          pagination={false}
          scroll={{
            x: isMobile ? 640 : 'max-content',
            ...(showFooter ? { y: scrollY } : {}),
            ...scroll,
          }}
          className={cn('min-w-full', className)}
        />
      </div>

      {showFooter && paginationConfig && (
        <div ref={footerRef} className={paginationFooterClass}>
          <Pagination {...paginationConfig} />
        </div>
      )}
    </div>
  )
}

export type { ColumnsType } from 'antd/es/table'
