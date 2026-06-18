import { Table as AntTable, type TableProps } from 'antd'
import { Grid } from 'antd'
import { cn } from '../../utils/cn'

export function Table<RecordType extends object = object>(props: TableProps<RecordType>) {
  const screens = Grid.useBreakpoint()
  const isCompact = !screens.md
  const isMobile = !screens.sm

  const paginationConfig =
    props.pagination === false
      ? false
      : {
          showSizeChanger: !isMobile,
          pageSizeOptions: [10, 20, 50],
          responsive: true,
          simple: isMobile,
          size: isCompact ? ('small' as const) : ('middle' as const),
          ...(typeof props.pagination === 'object' ? props.pagination : {}),
        }

  return (
    <div className="w-full min-w-0 overflow-x-auto">
      <AntTable
        {...props}
        size={props.size ?? (isCompact ? 'small' : 'middle')}
        scroll={{ x: isMobile ? 640 : 'max-content', ...props.scroll }}
        pagination={paginationConfig}
        className={cn(
          'min-w-full overflow-hidden rounded-2xl bg-white shadow-sm',
          '[&_.ant-table-thead>tr>th]:whitespace-nowrap',
          '[&_.ant-table-cell]:break-words',
          props.className,
        )}
      />
    </div>
  )
}

export type { ColumnsType } from 'antd/es/table'
