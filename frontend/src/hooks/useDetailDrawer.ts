import { useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

export function useDetailDrawer(basePath: string) {
  const { id } = useParams()
  const navigate = useNavigate()

  const parsedId = id !== undefined ? Number(id) : NaN
  const viewId = Number.isFinite(parsedId) && parsedId > 0 ? parsedId : null

  const openDetail = useCallback(
    (entityId: number) => {
      navigate(`${basePath}/${entityId}`)
    },
    [basePath, navigate],
  )

  const closeDetail = useCallback(() => {
    navigate(basePath)
  }, [basePath, navigate])

  return { viewId, openDetail, closeDetail }
}
