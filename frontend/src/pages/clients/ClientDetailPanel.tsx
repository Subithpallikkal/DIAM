import { useEffect, useRef, useState } from 'react'
import { message } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { fetchClient } from '../../api/clients.api'
import {
  Button,
  ClientStatusTag,
  DetailFieldList,
  DetailFieldRow,
  Loader,
  ResponsiveCard,
} from '../../components/common'
import type { ClientDetail } from '../../types/client'
import { getApiErrorMessage } from '../../utils/errors'

export interface ClientDetailPanelProps {
  clientId: number
  onEdit?: (clientId: number) => void
  onLoaded?: (client: ClientDetail) => void
  onError?: () => void
}

export function ClientDetailPanel({
  clientId,
  onEdit,
  onLoaded,
  onError,
}: ClientDetailPanelProps) {
  const [client, setClient] = useState<ClientDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const onLoadedRef = useRef(onLoaded)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onLoadedRef.current = onLoaded
    onErrorRef.current = onError
  })

  useEffect(() => {
    setLoading(true)
    fetchClient(clientId)
      .then((data) => {
        setClient(data)
        onLoadedRef.current?.(data)
      })
      .catch((err) => {
        message.error(getApiErrorMessage(err, 'Failed to load client'))
        onErrorRef.current?.()
      })
      .finally(() => setLoading(false))
  }, [clientId])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    )
  }

  if (!client) return null

  return (
    <div className="flex flex-col gap-3">
      {onEdit && (
        <Button type="primary" icon={<EditOutlined />} onClick={() => onEdit(client.id)}>
          Edit Client
        </Button>
      )}

      <ResponsiveCard bodyStyle={{ padding: 12 }}>
        <DetailFieldList>
          <DetailFieldRow label="Status">
            <ClientStatusTag isActive={client.isActive} />
          </DetailFieldRow>
          <DetailFieldRow label="Email">{client.email || '—'}</DetailFieldRow>
          <DetailFieldRow label="Phone">{client.phone || '—'}</DetailFieldRow>
          <DetailFieldRow label="GST Number">{client.gstNumber || '—'}</DetailFieldRow>
          <DetailFieldRow label="Code">{client.code || '—'}</DetailFieldRow>
          <DetailFieldRow label="Address">{client.address || '—'}</DetailFieldRow>
        </DetailFieldList>
      </ResponsiveCard>
    </div>
  )
}
