import type { ReactNode } from 'react'
import { Empty, Pagination } from 'antd'
import type { TablePaginationConfig, TableProps } from 'antd/es/table'
import { Loader } from './Loader'
import { Table, type ColumnsType } from './Table'
import { cn } from '../../utils/cn'

export interface ResponsiveDataListProps<T extends object> {
  rowKey: string | keyof T | ((record: T) => string)
  loading?: boolean
  columns: ColumnsType<T>
  dataSource: T[]
  pagination: TablePaginationConfig | false
  onChange?: TableProps<T>['onChange']
  renderMobileCard: (record: T) => ReactNode
  emptyDescription?: string
  className?: string
}

export function ResponsiveDataList<T extends object>({
  rowKey,
  loading = false,
  columns,
  dataSource,
  pagination,
  onChange,
  renderMobileCard,
  emptyDescription = 'No records found',
  className,
}: ResponsiveDataListProps<T>) {
  const paginationConfig = pagination === false ? null : pagination
  const showPagination =
    paginationConfig != null &&
    (paginationConfig.total ?? 0) > (paginationConfig.pageSize ?? 10)

  return (
    <div className={cn('flex min-h-0 flex-1 flex-col', className)}>
      <div className="hidden min-h-0 flex-1 flex-col md:flex">
        <Table
          rowKey={rowKey}
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={pagination}
          onChange={onChange}
        />
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:hidden">
        {loading && dataSource.length === 0 ? (
          <div className="flex flex-1 items-center justify-center py-12">
            <Loader />
          </div>
        ) : dataSource.length === 0 ? (
          <Empty description={emptyDescription} image={Empty.PRESENTED_IMAGE_SIMPLE} className="py-12" />
        ) : (
          <div className="flex flex-col gap-3 pb-2">
            {dataSource.map((record) => {
              const key =
                typeof rowKey === 'function'
                  ? rowKey(record)
                  : String(record[rowKey as keyof T])
              return <div key={key}>{renderMobileCard(record)}</div>
            })}
          </div>
        )}

        {showPagination && paginationConfig && (
          <div className="sticky bottom-0 mt-3 border-t border-slate-100 bg-[#f8f9fa] py-3">
            <Pagination
              simple
              size="small"
              current={paginationConfig.current}
              pageSize={paginationConfig.pageSize}
              total={paginationConfig.total}
              onChange={(page, pageSize) => paginationConfig.onChange?.(page, pageSize)}
              className="flex justify-center"
            />
          </div>
        )}
      </div>
    </div>
  )
}
