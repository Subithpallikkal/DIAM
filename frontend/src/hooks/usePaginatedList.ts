import { useCallback, useEffect, useRef, useState } from 'react'
import type { ListQueryParams, PaginatedResponse, PaginationMeta } from '../types/api'

const DEFAULT_META: PaginationMeta = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1,
}

const EMPTY_EXTRA_PARAMS: Record<string, string | number | undefined> = {}

interface UsePaginatedListOptions<T> {
  fetcher: (params: ListQueryParams) => Promise<PaginatedResponse<T>>
  initialPageSize?: number
  extraParams?: Record<string, string | number | undefined>
  enabled?: boolean
}

export function usePaginatedList<T>({
  fetcher,
  initialPageSize = 10,
  extraParams,
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

  const fetcherRef = useRef(fetcher)
  fetcherRef.current = fetcher

  // Serialize filter values so dependency identity is stable across renders.
  const extraKey = JSON.stringify(extraParams ?? EMPTY_EXTRA_PARAMS)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, extraKey])

  useEffect(() => {
    if (!enabled) {
      setLoading(false)
      return
    }

    let active = true
    setLoading(true)

    const parsedExtra = JSON.parse(extraKey) as Record<string, string | number | undefined>

    fetcherRef
      .current({
        page,
        limit: pageSize,
        search: debouncedSearch.trim() || undefined,
        ...parsedExtra,
      })
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
  }, [enabled, page, pageSize, debouncedSearch, extraKey])

  const reload = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    try {
      const parsedExtra = JSON.parse(extraKey) as Record<string, string | number | undefined>
      const response = await fetcherRef.current({
        page,
        limit: pageSize,
        search: debouncedSearch.trim() || undefined,
        ...parsedExtra,
      })
      setData(response.data)
      setMeta(response.meta)
    } finally {
      setLoading(false)
    }
  }, [enabled, page, pageSize, debouncedSearch, extraKey])

  const pagination = {
    current: meta.page,
    pageSize: meta.limit,
    total: meta.total,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50],
    onChange: (nextPage: number, nextSize: number) => {
      setPage(nextPage)
      setPageSize(nextSize)
    },
  }

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
    reload,
    pagination,
  }
}
