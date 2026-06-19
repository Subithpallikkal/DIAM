import { useCallback, useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Form, message } from 'antd'
import { EyeOutlined, PlusOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons'
import { fetchClients } from '../../api/clients.api'
import { upsertEngagement, fetchEngagements } from '../../api/engagements.api'
import {
  Button,
  DetailDrawer,
  EngagementStatusTag,
  MobileCardBadge,
  MobileListActionButton,
  MobileListCard,
  MobileListRow,
  ModalForm,
  PageBody,
  PageContainer,
  PageHeader,
  PageToolbar,
  ResponsiveDataList,
  TableActions,
  applyTableQuery,
  actionsColumnBase,
  enumFilters,
  type ColumnsType,
} from '../../components/common'
import { EngagementForm, type EngagementFormValues } from '../../components/forms'
import { EngagementDetailPanel } from './EngagementDetailPanel'
import { invalidateEngagementOptionsCache } from '../../hooks/useEngagementOptions'
import { useDetailDrawer } from '../../hooks/useDetailDrawer'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import type { ClientListItem } from '../../types/client'
import type { EngagementListItem, EngagementStatus, UpsertEngagementPayload } from '../../types/engagement'
import { API_MAX_PAGE_SIZE } from '../../types/api'
import { getApiErrorMessage } from '../../utils/errors'

const ENGAGEMENT_STATUS_OPTIONS: EngagementStatus[] = ['DRAFT', 'IN_PROGRESS', 'COMPLETED']

const ENGAGEMENT_STATUS_TONE = {
  DRAFT: 'neutral',
  IN_PROGRESS: 'info',
  COMPLETED: 'success',
} as const

export function EngagementsListPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [form] = Form.useForm<EngagementFormValues>()
  const [clients, setClients] = useState<ClientListItem[]>([])
  const [createOpen, setCreateOpen] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const createModalWidth = useResponsiveModalWidth(720)
  const { viewId, openDetail, closeDetail } = useDetailDrawer('/engagements')
  const [detailMeta, setDetailMeta] = useState<{ title: string; subtitle?: string } | null>(null)

  const fetcher = useCallback(
    (params: Parameters<typeof fetchEngagements>[0]) => fetchEngagements(params),
    [],
  )

  const { data: engagements, loading, reload, pagination, search, setSearch, tableSort, tableFilters, onTableChange } =
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

    const payload: UpsertEngagementPayload = {
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
      const engagement = await upsertEngagement(payload)
      message.success('Engagement created')
      setCreateOpen(false)
      form.resetFields()
      invalidateEngagementOptionsCache()
      reload()
      openDetail(engagement.id)
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
          <button
            type="button"
            className="cursor-pointer border-0 bg-transparent p-0 text-left font-medium text-brand hover:underline"
            onClick={() => openDetail(record.id)}
          >
            {title}
          </button>
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
        ...actionsColumnBase('one'),
        render: (_, record) => (
          <TableActions>
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              aria-label="View"
              onClick={() => openDetail(record.id)}
            />
          </TableActions>
        ),
      },
        ],
        tableSort,
        tableFilters,
      ),
    [openDetail, tableSort, tableFilters],
  )

  return (
    <PageContainer>
      <PageHeader
        title="Engagements"
        subtitle="Audit engagements across all clients"
      />

      <PageToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search engagements by title or client..."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            Create Engagement
          </Button>
        }
      />

      <PageBody variant="fill">
        <ResponsiveDataList
          rowKey="id"
          columns={columns}
          dataSource={engagements}
          loading={loading}
          pagination={pagination}
          onChange={onTableChange}
          emptyDescription="No engagements found"
          renderMobileCard={(engagement) => (
            <MobileListCard
              title={engagement.title}
              badge={
                <MobileCardBadge
                  label={engagement.status.replace('_', ' ')}
                  tone={
                    ENGAGEMENT_STATUS_TONE[engagement.status] ??
                    'neutral'
                  }
                />
              }
              actions={
                <>
                  <MobileListActionButton
                    label="View Details"
                    className="col-span-2"
                    onClick={() => openDetail(engagement.id)}
                  />
                </>
              }
            >
              <MobileListRow icon={<TeamOutlined />}>{engagement.clientName}</MobileListRow>
              <MobileListRow icon={<CalendarOutlined />}>
                {engagement.auditType}
                {engagement.financialYear ? ` · ${engagement.financialYear}` : ''}
              </MobileListRow>
            </MobileListCard>
          )}
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

      <DetailDrawer
        open={viewId !== null}
        onClose={() => {
          closeDetail()
          setDetailMeta(null)
        }}
        title={detailMeta?.title}
        subtitle={detailMeta?.subtitle}
        width={560}
      >
        {viewId !== null && (
          <EngagementDetailPanel
            engagementId={viewId}
            onLoaded={(engagement) =>
              setDetailMeta({
                title: engagement.title,
                subtitle: `Engagement for ${engagement.clientName}`,
              })
            }
            onError={closeDetail}
            onClientClick={(clientId) => navigate(`/clients/${clientId}`)}
          />
        )}
      </DetailDrawer>
    </PageContainer>
  )
}
