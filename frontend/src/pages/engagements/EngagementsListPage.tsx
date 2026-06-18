import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, Modal, message } from 'antd'
import { EyeOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { fetchClients } from '../../api/clients.api'
import { createEngagement, fetchEngagements } from '../../api/engagements.api'
import {
  Alert,
  Button,
  EngagementStatusTag,
  FilterBar,
  Input,
  PageBody,
  PageContainer,
  PageHeader,
  Table,
  type ColumnsType,
} from '../../components/common'
import { EngagementForm, type EngagementFormValues } from '../../components/forms'
import { invalidateEngagementOptionsCache } from '../../hooks/useEngagementOptions'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import type { ClientListItem } from '../../types/client'
import type { CreateEngagementPayload, EngagementListItem } from '../../types/engagement'
import { getApiErrorMessage } from '../../utils/errors'

export function EngagementsListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm<EngagementFormValues>()
  const [clients, setClients] = useState<ClientListItem[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const createModalWidth = useResponsiveModalWidth(640)

  const fetcher = useCallback(
    (params: Parameters<typeof fetchEngagements>[0]) => fetchEngagements(params),
    [],
  )

  const { data: engagements, loading, search, setSearch, reload, pagination } = usePaginatedList({
    fetcher,
    initialPageSize: 10,
  })

  useEffect(() => {
    if (location.state?.openCreate) {
      setCreateOpen(true)
      navigate('/engagements', { replace: true, state: {} })
    }
  }, [location.state, navigate])

  useEffect(() => {
    if (!createOpen) return
    fetchClients({ page: 1, limit: 200 })
      .then((response) => setClients(response.data))
      .catch(() => setClients([]))
  }, [createOpen])

  const handleCreate = async (values: EngagementFormValues) => {
    setCreating(true)
    setCreateError(null)

    const payload: CreateEngagementPayload = {
      clientId: values.clientId,
      title: values.title,
      auditType: values.auditType,
      financialYear: values.financialYear,
      status: values.status,
      description: values.description,
      startDate: values.startDate?.format('YYYY-MM-DD'),
      endDate: values.endDate?.format('YYYY-MM-DD'),
    }

    try {
      const engagement = await createEngagement(payload)
      message.success('Engagement created')
      setCreateOpen(false)
      form.resetFields()
      invalidateEngagementOptionsCache()
      reload()
      navigate(`/engagements/${engagement.id}`)
    } catch (err) {
      setCreateError(getApiErrorMessage(err, 'Failed to create engagement'))
    } finally {
      setCreating(false)
    }
  }

  const columns: ColumnsType<EngagementListItem> = useMemo(
    () => [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        fixed: 'left',
        width: 180,
        render: (title, record) => (
          <Link to={`/engagements/${record.id}`} className="font-medium text-indigo-600 hover:text-indigo-700">
            {title}
          </Link>
        ),
      },
      { title: 'Client Name', dataIndex: 'clientName', key: 'clientName', responsive: ['md'] },
      { title: 'Audit Type', dataIndex: 'auditType', key: 'auditType', responsive: ['lg'] },
      {
        title: 'Year',
        dataIndex: 'financialYear',
        key: 'financialYear',
        responsive: ['xl'],
        render: (v) => v || '—',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        responsive: ['sm'],
        render: (status) => <EngagementStatusTag status={status} />,
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 72,
        fixed: 'right',
        render: (_, record) => (
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/engagements/${record.id}`)}
          />
        ),
      },
    ],
    [navigate],
  )

  return (
    <PageContainer>
      <PageHeader
        title="Engagements"
        subtitle="Audit engagements across all clients"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)} block className="sm:!inline-flex">
            Create Engagement
          </Button>
        }
      />

      <FilterBar>
        <Input
          allowClear
          prefix={<SearchOutlined className="text-slate-400" />}
          placeholder="Search engagements..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mobile-full-input"
        />
      </FilterBar>

      <PageBody>
        <Table
          rowKey="id"
          columns={columns}
          dataSource={engagements}
          loading={loading}
          pagination={pagination}
        />
      </PageBody>

      <Modal
        title="Create Engagement"
        open={createOpen}
        onCancel={() => {
          setCreateOpen(false)
          setCreateError(null)
          form.resetFields()
        }}
        onOk={() => form.submit()}
        confirmLoading={creating}
        okText="Create Engagement"
        width={createModalWidth}
        destroyOnHidden
        centered
        className="[&_.ant-modal-body]:max-h-[calc(100vh-180px)] [&_.ant-modal-body]:overflow-y-auto"
      >
        {createError && <Alert type="error" message={createError} className="mb-4" />}
        <EngagementForm
          form={form}
          clients={clients}
          hideActions
          onCancel={() => setCreateOpen(false)}
          onFinish={handleCreate}
        />
      </Modal>
    </PageContainer>
  )
}
