import type { FilterValue, SorterResult } from 'antd/es/table/interface'
import type { ColumnsType, ColumnType } from 'antd/es/table'

export type TableSortState = {
  field?: string
  order?: 'ascend' | 'descend' | null
}

export type TableFilterState = Record<string, FilterValue | null>

export const BOOL_FILTERS = [
  { text: 'Active', value: 'true' },
  { text: 'Inactive', value: 'false' },
]

export function enumFilters<T extends string>(
  values: readonly T[],
  label?: (value: T) => string,
) {
  return values.map((value) => ({
    text: label ? label(value) : value.replaceAll('_', ' '),
    value,
  }))
}

export function columnKey<T>(column: ColumnType<T>): string {
  return String(column.key ?? column.dataIndex ?? '')
}

export function applyTableQuery<T extends object>(
  columns: ColumnsType<T>,
  sort: TableSortState,
  filters: TableFilterState,
): ColumnsType<T> {
  return columns.map((column) => {
    const key = columnKey(column as ColumnType<T>)
    const next = { ...column } as ColumnType<T>

    if (next.sorter) {
      next.sortOrder = sort.field === key ? sort.order ?? null : null
    }

    if (next.filters) {
      next.filteredValue = filters[key] ?? null
    }

    return next
  }) as ColumnsType<T>
}

export function tableFiltersToParams(
  filters: TableFilterState,
  paramMap?: Record<string, string>,
): Record<string, string | number | boolean | undefined> {
  const params: Record<string, string | number | boolean | undefined> = {}

  for (const [key, values] of Object.entries(filters)) {
    if (!values?.length) continue

    const paramKey = paramMap?.[key] ?? key
    const raw = values[0]

    if (paramKey === 'isActive') {
      params.isActive = raw === true || raw === 'true'
      continue
    }

    if (paramKey === 'clientId' || paramKey === 'engagementId' || paramKey === 'categoryId') {
      const numeric = Number(raw)
      if (!Number.isNaN(numeric)) {
        params[paramKey] = numeric
      }
      continue
    }

    params[paramKey] = String(raw)
  }

  return params
}

export function readTableSorter<T>(sorter: SorterResult<T> | SorterResult<T>[]): TableSortState {
  const entry = Array.isArray(sorter) ? sorter[0] : sorter

  if (!entry?.field || !entry.order) {
    return { field: undefined, order: null }
  }

  return {
    field: String(entry.field),
    order: entry.order,
  }
}
