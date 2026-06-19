import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { List, Select, Typography, message } from 'antd'
import {
  TASK_STATUS_OPTIONS,
  addTaskComment,
  assignTask,
  fetchTask,
  updateTask,
} from '../../api/tasks.api'
import { fetchUsers } from '../../api/users.api'
import { Button, Input, Loader, PageBody, PageContainer, PageHeader, ResponsiveCard, stackListItemClass } from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import type { TaskDetail } from '../../types/task'
import type { UserListItem } from '../../types/user'
import { getApiErrorMessage } from '../../utils/errors'

const { Text } = Typography

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const taskId = Number(id)

  const [task, setTask] = useState<TaskDetail | null>(null)
  const [users, setUsers] = useState<UserListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [assigneeId, setAssigneeId] = useState<number | undefined>()

  const loadData = useCallback(async () => {
    if (!taskId) return
    setLoading(true)
    try {
      const taskData = await fetchTask(taskId)
      setTask(taskData)
      if (canManage) {
        fetchUsers({ page: 1, limit: 100 })
          .then((response) => setUsers(response.data))
          .catch(() => setUsers([]))
      }
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to load task'))
      navigate('/tasks')
    } finally {
      setLoading(false)
    }
  }, [taskId, navigate, canManage])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleStatusChange = async (status: string) => {
    try {
      await updateTask(taskId, { status: status as TaskDetail['status'] })
      message.success('Status updated')
      loadData()
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to update status'))
    }
  }

  const handleAssign = async () => {
    if (!assigneeId) return
    try {
      await assignTask(taskId, assigneeId)
      message.success('Task assigned')
      loadData()
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to assign task'))
    }
  }

  const handleComment = async () => {
    if (!comment.trim()) return
    try {
      await addTaskComment(taskId, { content: comment.trim() })
      setComment('')
      message.success('Comment added')
      loadData()
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to add comment'))
    }
  }

  if (loading) return <Loader fullPage />
  if (!task) return null

  return (
    <PageContainer>
      <PageHeader
        title={task.title}
        subtitle={`Task for ${task.engagementTitle}`}
        breadcrumbs={[{ title: 'Tasks', href: '/tasks' }, { title: task.title }]}
      />

      <PageBody variant="fill" className="gap-3 overflow-y-auto pr-0.5 md:gap-4">
      <ResponsiveCard className="mb-0">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Text type="secondary">Status</Text>
            <div className="mt-1">
              <Select
                value={task.status}
                onChange={handleStatusChange}
                className="w-full sm:w-48"
                options={TASK_STATUS_OPTIONS.map((value) => ({
                  label: value.replace('_', ' '),
                  value,
                }))}
              />
            </div>
          </div>
          <div>
            <Text type="secondary">Assignee</Text>
            <div className="mt-1">
              {task.assigneeName ? (
                <Text>{task.assigneeName}</Text>
              ) : (
                <Text type="secondary">Unassigned</Text>
              )}
            </div>
          </div>
          {task.description && (
            <div className="sm:col-span-2">
              <Text type="secondary">Description</Text>
              <div className="mt-1">{task.description}</div>
            </div>
          )}
        </div>

        {canManage && (
          <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <Text type="secondary" className="mb-1 block text-xs">
                Assign to
              </Text>
              <Select
                placeholder="Select user"
                className="w-full"
                value={assigneeId}
                onChange={setAssigneeId}
                options={users.map((item) => ({ label: item.name, value: item.id }))}
              />
            </div>
            <Button type="primary" onClick={handleAssign} block className="sm:!inline-flex sm:!w-auto">
              Assign
            </Button>
          </div>
        )}
      </ResponsiveCard>

      <ResponsiveCard title="Comments">
        <List
          dataSource={task.comments}
          locale={{ emptyText: 'No comments yet' }}
          renderItem={(item) => (
            <List.Item className={stackListItemClass}>
              <List.Item.Meta
                title={item.authorName}
                description={
                  <>
                    <div>{item.content}</div>
                    <Text type="secondary" className="text-xs">
                      {new Date(item.createdAt).toLocaleString()}
                    </Text>
                  </>
                }
              />
            </List.Item>
          )}
        />
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input.TextArea
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <Button type="primary" onClick={handleComment} block className="sm:!inline-flex sm:!w-auto sm:shrink-0">
            Post Comment
          </Button>
        </div>
      </ResponsiveCard>
      </PageBody>
    </PageContainer>
  )
}
