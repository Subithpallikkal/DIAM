import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Modal, Select, message } from 'antd'
import { EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { createIssue, fetchIssues, ISSUE_STATUS_OPTIONS, SEVERITY_OPTIONS } from '../../api/issues.api'
import {
  Button,
  FilterBar,
  Input,
  IssueStatusTag,
  PageBody,
  PageContainer,
  PageHeader,
  PriorityTag,
  Table,
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
  const [engagementFilter, setEngagementFilter] = useState<number | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [form] = Form.useForm()
  const modalWidth = useResponsiveModalWidth(560)

  const fetcher = useCallback(
    (params: Parameters<typeof fetchIssues>[0]) => fetchIssues(params),
    [],
  )

  const { data: issues, loading, pagination } = usePaginatedList({
    fetcher,
    initialPageSize: 10,
    extraParams: { engagementId: engagementFilter, status: statusFilter },
  })

  const columns: ColumnsType<IssueListItem> = useMemo(
    () => [
      { title: 'Issue', dataIndex: 'title', key: 'title', fixed: 'left', width: 180 },
      { title: 'Engagement', dataIndex: 'engagementTitle', key: 'engagementTitle', responsive: ['md'] },
      {
        title: 'Severity',
        dataIndex: 'severity',
        key: 'severity',
        responsive: ['sm'],
        render: (value: string) => <PriorityTag value={value} />,
      },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        responsive: ['lg'],
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
            <Button type="text" size="small" icon={<EyeOutlined />} />
          </Link>
        ),
      },
    ],
    [],
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

      <FilterBar>
        <Select
          allowClear
          placeholder="Filter by engagement"
          className="mobile-full-select"
          value={engagementFilter}
          onChange={setEngagementFilter}
          options={engagements.map((item) => ({ label: item.title, value: item.id }))}
        />
        <Select
          allowClear
          placeholder="Filter by status"
          className="mobile-full-select sm:max-w-[12rem]"
          value={statusFilter}
          onChange={setStatusFilter}
          options={ISSUE_STATUS_OPTIONS.map((value) => ({ label: value.replace('_', ' '), value }))}
        />
      </FilterBar>

      <PageBody>
        <Table rowKey="id" loading={loading} columns={columns} dataSource={issues} pagination={pagination} />
      </PageBody>

      <Modal
        title="Report Issue"
        open={createOpen}
        onCancel={() => {
          setCreateOpen(false)
          form.resetFields()
        }}
        onOk={handleCreate}
        okText="Create"
        width={modalWidth}
        centered
        destroyOnClose
        className="[&_.ant-modal-body]:max-h-[calc(100vh-8rem)] [&_.ant-modal-body]:overflow-y-auto"
      >
        <Form form={form} layout="vertical" initialValues={{ severity: 'MEDIUM' }} className="mt-2">
          <Form.Item name="engagementId" label="Engagement" rules={[{ required: true }]}>
            <Select
              placeholder="Select engagement"
              options={engagements.map((item) => ({
                label: `${item.title} (${item.clientName})`,
                value: item.id,
              }))}
            />
          </Form.Item>
          <Form.Item name="title" label="Title" rules={[{ required: true }]}>
            <Input placeholder="GST filing delayed" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="severity" label="Severity">
            <Select options={SEVERITY_OPTIONS.map((value) => ({ label: value, value }))} />
          </Form.Item>
          <Form.Item name="responsiblePerson" label="Responsible Person">
            <Input placeholder="Finance Manager" />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}
