import { useCallback, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Select, message } from 'antd'
import { EyeOutlined, PlusOutlined } from '@ant-design/icons'
import { createTask, fetchTasks, TASK_STATUS_OPTIONS } from '../../api/tasks.api'
import {
  Button,
  Input,
  ModalForm,
  ModalFormField,
  ModalFormGrid,
  modalFormClassName,
  PageBody,
  PageContainer,
  PageHeader,
  Table,
  TaskStatusTag,
  applyTableQuery,
  enumFilters,
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
  const [form] = Form.useForm()
  const modalWidth = useResponsiveModalWidth(560)

  const fetcher = useCallback(
    (params: Parameters<typeof fetchTasks>[0]) => fetchTasks(params),
    [],
  )

  const { data: tasks, loading, pagination, tableSort, tableFilters, onTableChange } = usePaginatedList({
    fetcher,
    initialPageSize: 10,
  })

  const columns: ColumnsType<TaskListItem> = useMemo(
    () =>
      applyTableQuery<TaskListItem>(
        [
      {
        title: 'Task',
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
        title: 'Status',
        dataIndex: 'status',
        key: 'status',
        responsive: ['sm'],
        sorter: true,
        showSorterTooltip: true,
        filters: enumFilters(TASK_STATUS_OPTIONS),
        filterMultiple: false,
        render: (value: string) => <TaskStatusTag status={value} />,
      },
      {
        title: 'Assignee',
        dataIndex: 'assigneeName',
        key: 'assigneeName',
        responsive: ['lg'],
        sorter: true,
        showSorterTooltip: true,
        render: (value: string | null) => value || 'Unassigned',
      },
      {
        title: 'Actions',
        key: 'actions',
        width: 72,
        fixed: 'right',
        render: (_, record) => (
          <Link to={`/tasks/${record.id}`}>
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

      <PageBody variant="fill">
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={tasks}
          pagination={pagination}
          onChange={onTableChange}
        />
      </PageBody>

      <ModalForm
        open={createOpen}
        title="Create Task"
        subtitle="Task Creation"
        onClose={() => {
          setCreateOpen(false)
          form.resetFields()
        }}
        onSubmit={handleCreate}
        submitText="Create Task"
        width={modalWidth}
      >
        <Form form={form} layout="vertical" requiredMark="optional" className={modalFormClassName}>
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
            <ModalFormField name="title" label="Title" requiredMark rules={[{ required: true }]}>
              <Input placeholder="Risk Review" />
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
