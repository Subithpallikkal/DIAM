import { useCallback, useMemo, useState } from 'react'
import { Form, Select, message } from 'antd'
import { EyeOutlined, PlusOutlined, AuditOutlined, FileSearchOutlined } from '@ant-design/icons'
import { upsertIssue, fetchIssues, ISSUE_STATUS_OPTIONS, SEVERITY_OPTIONS } from '../../api/issues.api'
import {
  Button,
  DetailDrawer,
  Input,
  IssueStatusTag,
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
import { useDetailDrawer } from '../../hooks/useDetailDrawer'
import { useEngagementOptions } from '../../hooks/useEngagementOptions'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import { IssueDetailPanel } from './IssueDetailPanel'
import type { IssueListItem } from '../../types/issue'
import { getApiErrorMessage } from '../../utils/errors'

export function IssuesPage() {
  const { engagements } = useEngagementOptions()
  const [createOpen, setCreateOpen] = useState(false)
  const [form] = Form.useForm()
  const modalWidth = useResponsiveModalWidth(480)
  const { viewId, openDetail, closeDetail } = useDetailDrawer('/issues')
  const [detailMeta, setDetailMeta] = useState<{ title: string; subtitle?: string } | null>(null)

  const fetcher = useCallback(
    (params: Parameters<typeof fetchIssues>[0]) => fetchIssues(params),
    [],
  )

  const { data: issues, loading, pagination, search, setSearch, tableSort, tableFilters, onTableChange } = usePaginatedList({
    fetcher,
    initialPageSize: 10,
  })

  const columns: ColumnsType<IssueListItem> = useMemo(
    () =>
      applyTableQuery<IssueListItem>(
        [
      {
        title: 'Issue',
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
        title: 'Engagement',
        dataIndex: 'engagementTitle',
        key: 'engagementTitle',
        responsive: ['md'],
        sorter: true,
        showSorterTooltip: true,
      },
      {
        title: 'Severity',
        dataIndex: 'severity',
        key: 'severity',
        responsive: ['sm'],
        sorter: true,
        showSorterTooltip: true,
        filters: enumFilters(SEVERITY_OPTIONS),
        filterMultiple: false,
        render: (value: string) => <PriorityTag value={value} />,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        responsive: ['lg'],
        sorter: true,
        showSorterTooltip: true,
        filters: enumFilters(ISSUE_STATUS_OPTIONS),
        filterMultiple: false,
        render: (value: string) => <IssueStatusTag status={value} />,
      },
      { title: 'Findings', dataIndex: 'findingsCount', key: 'findingsCount', responsive: ['xl'] },
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
      const issue = await upsertIssue(values.engagementId, {
        title: values.title,
        description: values.description,
        severity: values.severity,
        responsiblePerson: values.responsiblePerson,
      })
      message.success('Issue created')
      setCreateOpen(false)
      form.resetFields()
      openDetail(issue.id)
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return
      message.error(getApiErrorMessage(err, 'Failed to create issue'))
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Issues & Findings"
        subtitle="Track audit issues and related findings"
      />

      <PageToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search issues by title or description..."
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            Report Issue
          </Button>
        }
      />

      <PageBody variant="fill">
        <ResponsiveDataList
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={issues}
          pagination={pagination}
          onChange={onTableChange}
          emptyDescription="No issues found"
          renderMobileCard={(issue) => (
            <MobileListCard
              title={issue.title}
              badge={
                <MobileCardBadge
                  label={issue.severity}
                  tone={
                    issue.severity === 'HIGH'
                      ? 'danger'
                      : issue.severity === 'MEDIUM'
                        ? 'warning'
                        : 'info'
                  }
                />
              }
              actions={
                <MobileListActionButton
                  label="View Details"
                  className="col-span-2"
                  onClick={() => openDetail(issue.id)}
                />
              }
            >
              <MobileListRow icon={<AuditOutlined />}>{issue.engagementTitle}</MobileListRow>
              <MobileListRow icon={<FileSearchOutlined />}>
                {issue.status.replace('_', ' ')} · {issue.findingsCount} finding
                {issue.findingsCount === 1 ? '' : 's'}
              </MobileListRow>
            </MobileListCard>
          )}
        />
      </PageBody>

      <ModalForm
        open={createOpen}
        title="Report Issue"
        subtitle="Issue Creation"
        onClose={() => {
          setCreateOpen(false)
          form.resetFields()
        }}
        onSubmit={handleCreate}
        submitText="Create Issue"
        width={modalWidth}
      >
        <Form
          form={form}
          layout="vertical"
          requiredMark="optional"
          initialValues={{ severity: 'MEDIUM' }}
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
            <ModalFormField name="severity" label="Severity">
              <Select
                className="w-full"
                options={SEVERITY_OPTIONS.map((value) => ({ label: value, value }))}
              />
            </ModalFormField>
            <ModalFormField name="title" label="Title" requiredMark rules={[{ required: true }]}>
              <Input placeholder="GST filing delayed" />
            </ModalFormField>
            <ModalFormField name="responsiblePerson" label="Responsible Person">
              <Input placeholder="Finance Manager" />
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
        subtitle={detailMeta?.subtitle}
        width={520}
      >
        {viewId !== null && (
          <IssueDetailPanel
            issueId={viewId}
            onLoaded={(issue) =>
              setDetailMeta({ title: issue.title, subtitle: `Issue for ${issue.engagementTitle}` })
            }
            onError={closeDetail}
          />
        )}
      </DetailDrawer>
    </PageContainer>
  )
}
