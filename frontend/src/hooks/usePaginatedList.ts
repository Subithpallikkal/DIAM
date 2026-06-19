import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { TableProps } from 'antd'
import {
  readTableSorter,
  tableFiltersToParams,
  type TableFilterState,
  type TableSortState,
} from '../lib/tableColumns'
import type { ListQueryParams, PaginatedResponse, PaginationMeta } from '../types/api'

const DEFAULT_META: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
}

const EMPTY_EXTRA_PARAMS: Record<string, string | number | boolean | undefined> = {}
const EMPTY_FILTER_PARAM_MAP: Record<string, string> = {}

function tableSortEqual(a: TableSortState, b: TableSortState): boolean {
  return a.field === b.field && a.order === b.order
}

function tableFiltersEqual(a: TableFilterState, b: TableFilterState): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}

interface UsePaginatedListOptions<T> {
  fetcher: (params: ListQueryParams) => Promise<PaginatedResponse<T>>
  initialPageSize?: number
  extraParams?: Record<string, string | number | boolean | undefined>
  filterParamMap?: Record<string, string>
  enabled?: boolean
}

export function usePaginatedList<T>({
  fetcher,
  initialPageSize = 10,
  extraParams,
  filterParamMap,
  enabled = true,
}: UsePaginatedListOptions<T>) {
  const [data, setData] = useState<T[]>([])
  const [meta, setMeta] = useState<PaginationMeta>({
    ...DEFAULT_META,
    limit: initialPageSize,
  })
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [tableSort, setTableSort] = useState<TableSortState>({})
  const [tableFilters, setTableFilters] = useState<TableFilterState>({})

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  const extraKey = JSON.stringify(extraParams ?? EMPTY_EXTRA_PARAMS)
  const filterParamMapKey = JSON.stringify(filterParamMap ?? EMPTY_FILTER_PARAM_MAP)
  const tableKey = JSON.stringify({ sort: tableSort, filters: tableFilters })

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, extraKey, tableKey])

  const buildQueryParams = useCallback((): ListQueryParams => {
    const parsedExtra = JSON.parse(extraKey) as Record<string, string | number | boolean | undefined>
    const parsedFilterParamMap = JSON.parse(filterParamMapKey) as Record<string, string>
    const filterParams = tableFiltersToParams(
      tableFilters,
      Object.keys(parsedFilterParamMap).length ? parsedFilterParamMap : undefined,
    )

    return {
      page,
      limit: pageSize,
      search: debouncedSearch.trim() || undefined,
      sortBy: tableSort.field,
      sortOrder:
        tableSort.order === 'ascend'
          ? 'asc'
          : tableSort.order === 'descend'
            ? 'desc'
            : undefined,
      ...parsedExtra,
      ...filterParams,
    }
  }, [debouncedSearch, extraKey, filterParamMapKey, page, pageSize, tableFilters, tableSort])

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)

    fetcherRef
      .current(buildQueryParams())
      .then((response) => {
        if (!active) return
        setData(response.data)
        setMeta(response.meta)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [enabled, buildQueryParams])

  const reload = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    try {
      const response = await fetcherRef.current(buildQueryParams())
      setData(response.data)
      setMeta(response.meta)
    } finally {
      setLoading(false)
    }
  }, [enabled, buildQueryParams])

  const onTableChange = useCallback<NonNullable<TableProps<T>['onChange']>>(
    (_pagination, filters, sorter) => {
      const nextSort = readTableSorter(sorter)
      const nextFilters = filters as TableFilterState

      setTableSort((prev) => (tableSortEqual(prev, nextSort) ? prev : nextSort))
      setTableFilters((prev) => (tableFiltersEqual(prev, nextFilters) ? prev : nextFilters))
    },
    [],
  )

  const pagination = useMemo(
    () => ({
      current: meta.page,
      pageSize: meta.limit,
      total: meta.total,
      showSizeChanger: true,
      pageSizeOptions: [10, 20, 50],
      onChange: (nextPage: number, nextSize: number) => {
        setPage(nextPage)
        setPageSize(nextSize)
      },
    }),
    [meta.limit, meta.page, meta.total],
  )

  return {
    data,
    meta,
    loading,
    page,
    setPage,
    pageSize,
    setPageSize,
    search,
    setSearch,
    tableSort,
    tableFilters,
    onTableChange,
    reload,
    pagination,
  }
}
