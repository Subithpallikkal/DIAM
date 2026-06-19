import { useEffect, useState } from 'react'
import { fetchEngagements } from '../api/engagements.api'
import { API_MAX_PAGE_SIZE } from '../types/api'
import type { EngagementListItem } from '../types/engagement'

const CACHE_TTL_MS = 5 * 60 * 1000
let cachedEngagements: EngagementListItem[] | null = null
let cacheExpiresAt = 0

export function useEngagementOptions() {
  const [engagements, setEngagements] = useState<EngagementListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    const load = async () => {
      if (cachedEngagements && Date.now() < cacheExpiresAt) {
        setEngagements(cachedEngagements)
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const response = await fetchEngagements({ page: 1, limit: API_MAX_PAGE_SIZE })
        cachedEngagements = response.data
        cacheExpiresAt = Date.now() + CACHE_TTL_MS
        if (active) setEngagements(response.data)
      } finally {
        if (active) setLoading(false)
      }
    }

    load()
    return () => {
      active = false
    }
  }, [])

  return { engagements, loading }
}

export function invalidateEngagementOptionsCache() {
  cachedEngagements = null
  cacheExpiresAt = 0
}
