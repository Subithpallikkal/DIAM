import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Descriptions, message } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import { fetchClient } from '../../api/clients.api'
import { Button, ClientStatusTag, Loader, PageBody, PageContainer, PageHeader, ResponsiveCard } from '../../components/common'
import type { ClientDetail } from '../../types/client'
import { getApiErrorMessage } from '../../utils/errors'

export function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [client, setClient] = useState<ClientDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return

    fetchClient(Number(id))
      .then(setClient)
      .catch((err) => {
        message.error(getApiErrorMessage(err, 'Failed to load client'))
        navigate('/clients')
      })
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) {
    return <Loader fullPage />
  }

  if (!client) return null

  return (
    <PageContainer>
      <PageHeader
        title={client.name}
        subtitle="Client details"
        breadcrumbs={[
          { title: 'Clients', href: '/clients' },
          { title: client.name },
        ]}
        extra={
          <Link to={`/clients/${client.id}/edit`} className="block w-full sm:w-auto">
            <Button type="primary" icon={<EditOutlined />} block className="sm:!inline-flex">
              Edit
            </Button>
          </Link>
        }
      />

      <PageBody>
      <ResponsiveCard>
        <Descriptions column={{ xs: 1, sm: 2 }} bordered size="middle" className="responsive-descriptions">
          <Descriptions.Item label="Status">
            <ClientStatusTag isActive={client.isActive} />
          </Descriptions.Item>
          <Descriptions.Item label="Email">{client.email || '—'}</Descriptions.Item>
          <Descriptions.Item label="Phone">{client.phone || '—'}</Descriptions.Item>
          <Descriptions.Item label="GST Number">{client.gstNumber || '—'}</Descriptions.Item>
          <Descriptions.Item label="Code">{client.code || '—'}</Descriptions.Item>
          <Descriptions.Item label="Address" span={2}>
            {client.address || '—'}
          </Descriptions.Item>
        </Descriptions>
      </ResponsiveCard>
      </PageBody>
    </PageContainer>
  )
}
