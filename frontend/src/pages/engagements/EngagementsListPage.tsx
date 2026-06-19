import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Form, message } from 'antd'
import { EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { fetchClients } from '../../api/clients.api'
import { createEngagement, fetchEngagements } from '../../api/engagements.api'
import {
  Button,
  EngagementStatusTag,
  ModalForm,
  PageBody,
  PageContainer,
  PageHeader,
  Table,
  applyTableQuery,
  enumFilters,
  type ColumnsType,
} from '../../components/common'
import { EngagementForm, type EngagementFormValues } from '../../components/forms'
import { invalidateEngagementOptionsCache } from '../../hooks/useEngagementOptions'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import type { ClientListItem } from '../../types/client'
import type { CreateEngagementPayload, EngagementListItem, EngagementStatus } from '../../types/engagement'
import { API_MAX_PAGE_SIZE } from '../../types/api'
import { getApiErrorMessage } from '../../utils/errors'

const ENGAGEMENT_STATUS_OPTIONS: EngagementStatus[] = ['DRAFT', 'IN_PROGRESS', 'COMPLETED']

export function EngagementsListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm<EngagementFormValues>()
  const [clients, setClients] = useState<ClientListItem[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const createModalWidth = useResponsiveModalWidth(900)

  const fetcher = useCallback(
    (params: Parameters<typeof fetchEngagements>[0]) => fetchEngagements(params),
    [],
  )

  const { data: engagements, loading, reload, pagination, tableSort, tableFilters, onTableChange } =
    usePaginatedList({
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
    fetchClients({ page: 1, limit: API_MAX_PAGE_SIZE })
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
    () =>
      applyTableQuery<EngagementListItem>(
        [
      {
        title: 'Title',
        dataIndex: 'title',
        key: 'title',
        fixed: 'left',
        width: 180,
        sorter: true,
        showSorterTooltip: true,
        render: (title, record) => (
          <Link to={`/engagements/${record.id}`} className="font-medium text-indigo-600 hover:text-indigo-700">
            {title}
          </Link>
        ),
      },
      {
        title: 'Client Name',
        dataIndex: 'clientName',
        key: 'clientName',
        responsive: ['md'],
        sorter: true,
        showSorterTooltip: true,
      },
      {
        title: 'Audit Type',
        dataIndex: 'auditType',
        key: 'auditType',
        responsive: ['lg'],
        sorter: true,
        showSorterTooltip: true,
      },
      {
        title: 'Year',
        dataIndex: 'financialYear',
        key: 'financialYear',
        responsive: ['xl'],
        sorter: true,
        showSorterTooltip: true,
        render: (v) => v || '—',
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        responsive: ['sm'],
        sorter: true,
        showSorterTooltip: true,
        filters: enumFilters(ENGAGEMENT_STATUS_OPTIONS),
        filterMultiple: false,
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
            size="small"
            icon={<EyeOutlined />}
            aria-label="View"
            onClick={() => navigate(`/engagements/${record.id}`)}
          />
        ),
      },
        ],
        tableSort,
        tableFilters,
      ),
    [navigate, tableSort, tableFilters],
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

      <PageBody variant="fill">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={engagements}
          loading={loading}
          pagination={pagination}
          onChange={onTableChange}
        />
      </PageBody>

      <ModalForm
        open={createOpen}
        title="Create Engagement"
        subtitle="Engagement Creation"
        onClose={() => {
          setCreateOpen(false)
          setCreateError(null)
          form.resetFields()
        }}
        onSubmit={() => form.submit()}
        submitText="Create Engagement"
        loading={creating}
        error={createError}
        width={createModalWidth}
      >
        <EngagementForm
          form={form}
          clients={clients}
          hideActions
          inModal
          onCancel={() => setCreateOpen(false)}
          onFinish={handleCreate}
        />
      </ModalForm>
    </PageContainer>
  )
}
