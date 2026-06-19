import { useCallback, useMemo, useState } from 'react'
import { Form, Select, message } from 'antd'
import { EyeOutlined, PlusOutlined, AuditOutlined, UserOutlined } from '@ant-design/icons'
import { upsertTask, fetchTasks, TASK_STATUS_OPTIONS } from '../../api/tasks.api'
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
  ResponsiveDataList,
  TableActions,
  TaskStatusTag,
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
import { TaskDetailPanel } from './TaskDetailPanel'
import type { TaskListItem } from '../../types/task'
import { getApiErrorMessage } from '../../utils/errors'

export function TasksPage() {
  const { user } = useAuth()
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const { engagements } = useEngagementOptions()
  const [createOpen, setCreateOpen] = useState(false)
  const [form] = Form.useForm()
  const modalWidth = useResponsiveModalWidth(480)
  const { viewId, openDetail, closeDetail } = useDetailDrawer('/tasks')
  const [detailMeta, setDetailMeta] = useState<{ title: string; subtitle?: string } | null>(null)

  const fetcher = useCallback(
    (params: Parameters<typeof fetchTasks>[0]) => fetchTasks(params),
    [],
  )

  const { data: tasks, loading, pagination, search, setSearch, tableSort, tableFilters, onTableChange } = usePaginatedList({
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
      const task = await upsertTask(values.engagementId, {
        title: values.title,
        description: values.description,
      })
      message.success('Task created')
      setCreateOpen(false)
      form.resetFields()
      openDetail(task.id)
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
      />

      <PageToolbar
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search tasks by title or description..."
        actions={
          canManage ? (
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
              Create Task
            </Button>
          ) : undefined
        }
      />

      <PageBody variant="fill">
        <ResponsiveDataList
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={tasks}
          pagination={pagination}
          onChange={onTableChange}
          emptyDescription="No tasks found"
          renderMobileCard={(task) => (
            <MobileListCard
              title={task.title}
              badge={
                <MobileCardBadge
                  label={task.status.replace('_', ' ')}
                  tone={
                    task.status === 'COMPLETED'
                      ? 'success'
                      : task.status === 'IN_PROGRESS'
                        ? 'info'
                        : 'warning'
                  }
                />
              }
              actions={
                <MobileListActionButton
                  label="View Details"
                  className="col-span-2"
                  onClick={() => openDetail(task.id)}
                />
              }
            >
              <MobileListRow icon={<AuditOutlined />}>{task.engagementTitle}</MobileListRow>
              <MobileListRow icon={<UserOutlined />}>
                {task.assigneeName || 'Unassigned'}
              </MobileListRow>
            </MobileListCard>
          )}
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
          <TaskDetailPanel
            taskId={viewId}
            onLoaded={(task) =>
              setDetailMeta({ title: task.title, subtitle: `Task for ${task.engagementTitle}` })
            }
            onError={closeDetail}
          />
        )}
      </DetailDrawer>
    </PageContainer>
  )
}
