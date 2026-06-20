import { useCallback, useEffect, useRef, useState } from 'react'
import { List, Select, Typography, message } from 'antd'
import {
  TASK_STATUS_OPTIONS,
  addTaskComment,
  assignTask,
  fetchTask,
  upsertTask,
} from '../../api/tasks.api'
import { fetchUsers } from '../../api/users.api'
import {
  Button,
  DetailFieldList,
  DetailFieldRow,
  Input,
  Loader,
  ResponsiveCard,
  selectFieldClass,
  stackListItemClass,
} from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/cn'
import type { TaskDetail } from '../../types/task'
import type { UserListItem } from '../../types/user'
import { getApiErrorMessage } from '../../utils/errors'

const { Text } = Typography

export interface TaskDetailPanelProps {
  taskId: number
  onLoaded?: (task: TaskDetail) => void
  onError?: () => void
  onMutated?: () => void
}

export function TaskDetailPanel({ taskId, onLoaded, onError, onMutated }: TaskDetailPanelProps) {
  const { user } = useAuth()
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER'

  const [task, setTask] = useState<TaskDetail | null>(null)
  const [users, setUsers] = useState<UserListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [assigneeId, setAssigneeId] = useState<number | undefined>()
  const onLoadedRef = useRef(onLoaded)
  const onErrorRef = useRef(onError)
  const onMutatedRef = useRef(onMutated)

  useEffect(() => {
    onLoadedRef.current = onLoaded
    onErrorRef.current = onError
    onMutatedRef.current = onMutated
  })

  const notifyMutated = useCallback(() => {
    onMutatedRef.current?.()
  }, [])

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const taskData = await fetchTask(taskId)
      setTask(taskData)
      onLoadedRef.current?.(taskData)
      if (canManage) {
        fetchUsers({ page: 1, limit: 100 })
          .then((response) => setUsers(response.data))
          .catch(() => setUsers([]))
      }
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to load task'))
      onErrorRef.current?.()
    } finally {
      setLoading(false)
    }
  }, [taskId, canManage])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleStatusChange = async (status: string) => {
    if (!task) return
    try {
      await upsertTask(task.engagementId, {
        id: taskId,
        status: status as TaskDetail['status'],
      })
      message.success('Status updated')
      await loadData()
      notifyMutated()
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to update status'))
    }
  }

  const handleAssign = async () => {
    if (!assigneeId) return
    try {
      await assignTask(taskId, assigneeId)
      message.success('Task assigned')
      await loadData()
      notifyMutated()
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

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    )
  }

  if (!task) return null

  return (
    <div className="flex flex-col gap-3">
      <ResponsiveCard bodyStyle={{ padding: 12 }}>
        <DetailFieldList>
          <DetailFieldRow label="Status">
            <Select
              value={task.status}
              onChange={handleStatusChange}
              className={cn('w-full', selectFieldClass)}
              options={TASK_STATUS_OPTIONS.map((value) => ({
                label: value.replace('_', ' '),
                value,
              }))}
            />
          </DetailFieldRow>
          <DetailFieldRow label="Assignee">
            {task.assigneeName ? (
              <Text>{task.assigneeName}</Text>
            ) : (
              <Text type="secondary">Unassigned</Text>
            )}
          </DetailFieldRow>
          {task.description && (
            <DetailFieldRow label="Description">{task.description}</DetailFieldRow>
          )}
          {canManage && (
            <DetailFieldRow label="Assign to">
              <div className="flex flex-col gap-2">
                <Select
                  placeholder="Select user"
                  className={cn('w-full', selectFieldClass)}
                  value={assigneeId}
                  onChange={setAssigneeId}
                  options={users.map((item) => ({ label: item.name, value: item.id }))}
                />
                <Button type="primary" onClick={handleAssign} className="w-full sm:w-auto">
                  Assign
                </Button>
              </div>
            </DetailFieldRow>
          )}
        </DetailFieldList>
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
          <Button type="primary" onClick={handleComment} className="sm:shrink-0">
            Post Comment
          </Button>
        </div>
      </ResponsiveCard>
    </div>
  )
}
