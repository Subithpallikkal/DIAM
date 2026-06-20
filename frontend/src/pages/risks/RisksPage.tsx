import { useCallback, useMemo, useState } from 'react'
import { Form, Select, message } from 'antd'
import { EyeOutlined, PlusOutlined, AuditOutlined, UnorderedListOutlined } from '@ant-design/icons'
import { upsertRisk, fetchRisks, PRIORITY_OPTIONS, RISK_STATUS_OPTIONS } from '../../api/risks.api'
import {
  Button,
  DetailDrawer,
  Input,
  ModalForm,
  ModalFormField,
  ModalFormGrid,
  modalFormClassName,
  MobileCardBadge,
  MobileListActionButton,
  MobileListCard,
  MobileListRow,
  PageBody,
  PageContainer,
  PageHeader,
  PageToolbar,
  PriorityTag,
  ResponsiveDataList,
  TableActions,
  applyTableQuery,
  actionsColumnBase,
  enumFilters,
  type ColumnsType,
} from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { useDetailDrawer } from '../../hooks/useDetailDrawer'
import { useEngagementOptions } from '../../hooks/useEngagementOptions'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import { RiskDetailPanel } from './RiskDetailPanel'
import type { RiskListItem } from '../../types/risk'
import { getApiErrorMessage } from '../../utils/errors'

export function RisksPage() {
  const { user } = useAuth()
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const { engagements } = useEngagementOptions()
  const [createOpen, setCreateOpen] = useState(false)
  const [form] = Form.useForm()
  const modalWidth = useResponsiveModalWidth(480)
  const { viewId, openDetail, closeDetail } = useDetailDrawer('/risks')
  const [detailMeta, setDetailMeta] = useState<{ title: string; subtitle?: string } | null>(null)

  const fetcher = useCallback(
    (params: Parameters<typeof fetchRisks>[0]) => fetchRisks(params),
    [],
  )

  const { data: risks, loading, reload, pagination, search, setSearch, tableSort, tableFilters, onTableChange } = usePaginatedList({
    fetcher,
    initialPageSize: 10,
  })

  const columns: ColumnsType<RiskListItem> = useMemo(
    () =>
      applyTableQuery<RiskListItem>(
        [
      {
        title: 'Risk',
        dataIndex: 'title',
        key: 'title',
        fixed: 'left',
        width: 180,
        sorter: true,
        showSorterTooltip: true,
        render: (title: string, record) => (
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
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        responsive: ['sm'],
        sorter: true,
        showSorterTooltip: true,
        filters: enumFilters(PRIORITY_OPTIONS),
        filterMultiple: false,
        render: (value: string) => <PriorityTag value={value} />,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        responsive: ['md'],
        sorter: true,
        showSorterTooltip: true,
        filters: enumFilters(RISK_STATUS_OPTIONS),
        filterMultiple: false,
      },
      {
        title: 'Checklist',
        key: 'checklist',
        responsive: ['lg'],
        render: (_, record) => `${record.completedChecklistCount}/${record.checklistCount}`,
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

  const handleCreate = async () => {
    try {
      const values = await form.validateFields()
      const risk = await upsertRisk(values.engagementId, {
        title: values.title,
        description: values.description,
        priority: values.priority,
      })
      message.success('Risk created')
      setCreateOpen(false)
      form.resetFields()
      await reload({ page: 1 })
      openDetail(risk.id)
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return
      message.error(getApiErrorMessage(err, 'Failed to create risk'))
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Risk Register"
        subtitle="Track audit risks and verification checklists"
      />

      <PageToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search risks by title or description..."
        actions={
          canManage ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
              Add Risk
            </Button>
          ) : undefined
        }
      />

      <PageBody variant="fill">
        <ResponsiveDataList
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={risks}
          pagination={pagination}
          onChange={onTableChange}
          emptyDescription="No risks found"
          renderMobileCard={(risk) => (
            <MobileListCard
              title={risk.title}
              badge={
                <MobileCardBadge
                  label={risk.priority}
                  tone={
                    risk.priority === 'HIGH'
                      ? 'danger'
                      : risk.priority === 'MEDIUM'
                        ? 'warning'
                        : 'info'
                  }
                />
              }
              actions={
                <MobileListActionButton
                  label="View Details"
                  className="col-span-2"
                  onClick={() => openDetail(risk.id)}
                />
              }
            >
              <MobileListRow icon={<AuditOutlined />}>Status: {risk.status}</MobileListRow>
              <MobileListRow icon={<UnorderedListOutlined />}>
                Checklist {risk.completedChecklistCount}/{risk.checklistCount}
              </MobileListRow>
            </MobileListCard>
          )}
        />
      </PageBody>

      <ModalForm
        open={createOpen}
        title="Add Risk"
        subtitle="Risk Creation"
        onClose={() => {
          setCreateOpen(false)
          form.resetFields()
        }}
        onSubmit={handleCreate}
        submitText="Create Risk"
        width={modalWidth}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
          initialValues={{ priority: 'MEDIUM' }}
          className={modalFormClassName}
        >
          <ModalFormGrid>
            <ModalFormField name="engagementId" label="Engagement" requiredMark rules={[{ required: true }]}>
              <Select
                className="w-full"
                placeholder="Select engagement"
                options={engagements.map((item) => ({
                  label: `${item.title} (${item.clientName})`,
                  value: item.id,
                }))}
              />
            </ModalFormField>
            <ModalFormField name="priority" label="Priority">
              <Select
                className="w-full"
                options={PRIORITY_OPTIONS.map((value) => ({ label: value, value }))}
              />
            </ModalFormField>
            <ModalFormField name="title" label="Title" requiredMark rules={[{ required: true }]}>
              <Input placeholder="Cash handling control weak" />
            </ModalFormField>
            <ModalFormField name="description" label="Description" className="ant-form-item-full">
              <Input.TextArea rows={3} />
            </ModalFormField>
          </ModalFormGrid>
        </Form>
      </ModalForm>

      <DetailDrawer
        open={viewId !== null}
        onClose={() => {
          closeDetail()
          setDetailMeta(null)
        }}
        title={detailMeta?.title}
        subtitle={detailMeta?.subtitle ?? 'Risk details and verification checklist'}
        width={520}
      >
        {viewId !== null && (
          <RiskDetailPanel
            riskId={viewId}
            onLoaded={(risk) => setDetailMeta({ title: risk.title, subtitle: 'Risk details and checklist' })}
            onError={closeDetail}
            onMutated={reload}
          />
        )}
      </DetailDrawer>
    </PageContainer>
  )
}
