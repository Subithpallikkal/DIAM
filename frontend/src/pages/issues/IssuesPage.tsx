import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Select, message } from 'antd'
import { EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { createIssue, fetchIssues, ISSUE_STATUS_OPTIONS, SEVERITY_OPTIONS } from '../../api/issues.api'
import {
  Button,
  Input,
  IssueStatusTag,
  ModalForm,
  ModalFormField,
  ModalFormGrid,
  modalFormClassName,
  PageBody,
  PageContainer,
  PageHeader,
  PriorityTag,
  Table,
  applyTableQuery,
  enumFilters,
  type ColumnsType,
} from '../../components/common'
import { useEngagementOptions } from '../../hooks/useEngagementOptions'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import type { IssueListItem } from '../../types/issue'
import { getApiErrorMessage } from '../../utils/errors'

export function IssuesPage() {
  const navigate = useNavigate()
  const { engagements } = useEngagementOptions()
  const [createOpen, setCreateOpen] = useState(false)
  const [form] = Form.useForm()
  const modalWidth = useResponsiveModalWidth(560)

  const fetcher = useCallback(
    (params: Parameters<typeof fetchIssues>[0]) => fetchIssues(params),
    [],
  )

  const { data: issues, loading, pagination, tableSort, tableFilters, onTableChange } = usePaginatedList({
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
        title: 'Actions',
        key: 'actions',
        width: 72,
        fixed: 'right',
        render: (_, record) => (
          <Link to={`/issues/${record.id}`}>
            <Button type="text" size="small" icon={<EyeOutlined />} aria-label="View" />
          </Link>
        ),
      },
        ],
        tableSort,
        tableFilters,
      ),
    [tableSort, tableFilters],
  )

  const handleCreate = async () => {
    try {
      const values = await form.validateFields()
      const issue = await createIssue(values.engagementId, {
        title: values.title,
        description: values.description,
        severity: values.severity,
        responsiblePerson: values.responsiblePerson,
      })
      message.success('Issue created')
      setCreateOpen(false)
      form.resetFields()
      navigate(`/issues/${issue.id}`)
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
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)} block className="sm:!inline-flex">
            Report Issue
          </Button>
        }
      />

      <PageBody variant="fill">
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={issues}
          pagination={pagination}
          onChange={onTableChange}
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
    </PageContainer>
  )
}
