import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Modal, Select, message } from 'antd'
import { EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { createRisk, fetchRisks, PRIORITY_OPTIONS } from '../../api/risks.api'
import {
  Button,
  FilterBar,
  Input,
  PageBody,
  PageContainer,
  PageHeader,
  PriorityTag,
  Table,
  type ColumnsType,
} from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { useEngagementOptions } from '../../hooks/useEngagementOptions'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import type { RiskListItem } from '../../types/risk'
import { getApiErrorMessage } from '../../utils/errors'

export function RisksPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const { engagements } = useEngagementOptions()
  const [createOpen, setCreateOpen] = useState(false)
  const [engagementFilter, setEngagementFilter] = useState<number | undefined>()
  const [form] = Form.useForm()
  const modalWidth = useResponsiveModalWidth(560)

  const fetcher = useCallback(
    (params: Parameters<typeof fetchRisks>[0]) => fetchRisks(params),
    [],
  )

  const { data: risks, loading, pagination } = usePaginatedList({
    fetcher,
    initialPageSize: 10,
    extraParams: { engagementId: engagementFilter },
  })

  const columns: ColumnsType<RiskListItem> = useMemo(
    () => [
      { title: 'Risk', dataIndex: 'title', key: 'title', fixed: 'left', width: 180 },
      {
        title: 'Priority',
        dataIndex: 'priority',
        key: 'priority',
        responsive: ['sm'],
        render: (value: string) => <PriorityTag value={value} />,
      },
      { title: 'Status', dataIndex: 'status', key: 'status', responsive: ['md'] },
      {
        title: 'Checklist',
        key: 'checklist',
        responsive: ['lg'],
        render: (_, record) => `${record.completedChecklistCount}/${record.checklistCount}`,
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 72,
        fixed: 'right',
        render: (_, record) => (
          <Link to={`/risks/${record.id}`}>
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
      const risk = await createRisk(values.engagementId, {
        title: values.title,
        description: values.description,
        priority: values.priority,
      })
      message.success('Risk created')
      setCreateOpen(false)
      form.resetFields()
      navigate(`/risks/${risk.id}`)
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
        extra={
          canManage ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)} block className="sm:!inline-flex">
              Add Risk
            </Button>
          ) : undefined
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
      </FilterBar>

      <PageBody>
        <Table rowKey="id" loading={loading} columns={columns} dataSource={risks} pagination={pagination} />
      </PageBody>

      <Modal
        title="Add Risk"
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
        <Form form={form} layout="vertical" initialValues={{ priority: 'MEDIUM' }} className="mt-2">
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
            <Input placeholder="Cash handling control weak" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="priority" label="Priority">
            <Select options={PRIORITY_OPTIONS.map((value) => ({ label: value, value }))} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}
