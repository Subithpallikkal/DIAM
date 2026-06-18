import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Card, Form, message } from 'antd'
import { fetchClient, updateClient } from '../../api/clients.api'
import { Alert, Loader, PageBody, PageContainer, PageHeader } from '../../components/common'
import { ClientForm, type ClientFormValues } from '../../components/forms'
import type { ClientDetail, UpdateClientPayload } from '../../types/client'
import { getApiErrorMessage } from '../../utils/errors'

export function EditClientPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [form] = Form.useForm<ClientFormValues>()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [client, setClient] = useState<ClientDetail | null>(null)

  useEffect(() => {
    if (!id) return

    fetchClient(Number(id))
      .then((data) => {
        setClient(data)
        form.setFieldsValue({
          name: data.name,
          email: data.email ?? undefined,
          phone: data.phone ?? undefined,
          address: data.address ?? undefined,
          gstNumber: data.gstNumber ?? undefined,
          code: data.code ?? undefined,
        })
      })
      .catch((err) => {
        message.error(getApiErrorMessage(err, 'Failed to load client'))
        navigate('/clients')
      })
      .finally(() => setLoading(false))
  }, [id, form, navigate])

  const handleSubmit = async (values: ClientFormValues) => {
    if (!id) return

    setSaving(true)
    setError(null)

    try {
      await updateClient(Number(id), values as UpdateClientPayload)
      navigate(`/clients/${id}`)
    } catch (err) {
      setError(getApiErrorMessage(err, 'Failed to update client'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <Loader fullPage />
  }

  if (!client) return null

  return (
    <PageContainer>
      <PageHeader
        title={`Edit ${client.name}`}
        subtitle="Update client information"
        breadcrumbs={[
          { title: 'Clients', href: '/clients' },
          { title: client.name, href: `/clients/${client.id}` },
          { title: 'Edit' },
        ]}
      />

      <PageBody>
      <Card bordered={false} className="w-full max-w-2xl !rounded-2xl !shadow-sm">
        {error && (
          <Alert
            type="error"
            message={error}
            closable
            layout="form"
            onClose={() => setError(null)}
          />
        )}

        <ClientForm
          form={form}
          mode="edit"
          loading={saving}
          onCancel={() => navigate(`/clients/${client.id}`)}
          onFinish={handleSubmit}
        />
      </Card>
      </PageBody>
    </PageContainer>
  )
}
