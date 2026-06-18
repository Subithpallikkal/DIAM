import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Modal, Select, message } from 'antd'
import { EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { createTask, fetchTasks, TASK_STATUS_OPTIONS } from '../../api/tasks.api'
import {
  Button,
  FilterBar,
  Input,
  PageBody,
  PageContainer,
  PageHeader,
  Table,
  TaskStatusTag,
  type ColumnsType,
} from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { useEngagementOptions } from '../../hooks/useEngagementOptions'
import { usePaginatedList } from '../../hooks/usePaginatedList'
import { useResponsiveModalWidth } from '../../hooks/useResponsive'
import type { TaskListItem } from '../../types/task'
import { getApiErrorMessage } from '../../utils/errors'

export function TasksPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const { engagements } = useEngagementOptions()
  const [createOpen, setCreateOpen] = useState(false)
  const [engagementFilter, setEngagementFilter] = useState<number | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [form] = Form.useForm()
  const modalWidth = useResponsiveModalWidth(560)

  const fetcher = useCallback(
    (params: Parameters<typeof fetchTasks>[0]) => fetchTasks(params),
    [],
  )

  const { data: tasks, loading, pagination } = usePaginatedList({
    fetcher,
    initialPageSize: 10,
    extraParams: { engagementId: engagementFilter, status: statusFilter },
  })

  const columns: ColumnsType<TaskListItem> = useMemo(
    () => [
      { title: 'Task', dataIndex: 'title', key: 'title', fixed: 'left', width: 180 },
      { title: 'Engagement', dataIndex: 'engagementTitle', key: 'engagementTitle', responsive: ['md'] },
      {
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        responsive: ['sm'],
        render: (value: string) => <TaskStatusTag status={value} />,
      },
      {
        title: 'Assignee',
        dataIndex: 'assigneeName',
        key: 'assigneeName',
        responsive: ['lg'],
        render: (value: string | null) => value || 'Unassigned',
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 72,
        fixed: 'right',
        render: (_, record) => (
          <Link to={`/tasks/${record.id}`}>
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
      const task = await createTask(values.engagementId, {
        title: values.title,
        description: values.description,
      })
      message.success('Task created')
      setCreateOpen(false)
      form.resetFields()
      navigate(`/tasks/${task.id}`)
    } catch (err) {
      if (err && typeof err === 'object' && 'errorFields' in err) return
      message.error(getApiErrorMessage(err, 'Failed to create task'))
    }
  }

  return (
    <PageContainer>
      <PageHeader
        title="Tasks"
        subtitle="Assign and track audit work across the team"
        extra={
          canManage ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)} block className="sm:!inline-flex">
              Create Task
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
        <Select
          allowClear
          placeholder="Filter by status"
          className="mobile-full-select sm:max-w-[12rem]"
          value={statusFilter}
          onChange={setStatusFilter}
          options={TASK_STATUS_OPTIONS.map((value) => ({ label: value.replace('_', ' '), value }))}
        />
      </FilterBar>

      <PageBody>
        <Table rowKey="id" loading={loading} columns={columns} dataSource={tasks} pagination={pagination} />
      </PageBody>

      <Modal
        title="Create Task"
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
        <Form form={form} layout="vertical" className="mt-2">
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
            <Input placeholder="Risk Review" />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </PageContainer>
  )
}
