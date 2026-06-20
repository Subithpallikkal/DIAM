import { useEffect, useRef, useState } from 'react'
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
import { canManage } from '../../lib/roles'
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
  const manager = canManage(user?.role)

  const [task, setTask] = useState<TaskDetail | null>(null)
  const [users, setUsers] = useState<UserListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const [assigneeId, setAssigneeId] = useState<number>()

  const onLoadedRef = useRef(onLoaded)
  const onErrorRef = useRef(onError)
  const onMutatedRef = useRef(onMutated)
  useEffect(() => {
    onLoadedRef.current = onLoaded
    onErrorRef.current = onError
    onMutatedRef.current = onMutated
  })

  useEffect(() => {
    let active = true
    setLoading(true)

    fetchTask(taskId)
      .then((data) => {
        if (!active) return
        setTask(data)
        onLoadedRef.current?.(data)
        if (!manager) return
        return fetchUsers({ page: 1, limit: 100 })
      })
      .then((usersRes) => {
        if (usersRes && active) setUsers(usersRes.data)
      })
      .catch((err) => {
        message.error(getApiErrorMessage(err, 'Failed to load task'))
        onErrorRef.current?.()
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [taskId, manager])

  const refresh = async () => {
    const data = await fetchTask(taskId)
    setTask(data)
    onLoadedRef.current?.(data)
    onMutatedRef.current?.()
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
              onChange={async (status) => {
                try {
                  await upsertTask(task.engagementId, { id: taskId, status })
                  message.success('Status updated')
                  await refresh()
                } catch (err) {
                  message.error(getApiErrorMessage(err, 'Failed to update status'))
                }
              }}
              className={cn('w-full', selectFieldClass)}
              options={TASK_STATUS_OPTIONS.map((v) => ({
                label: v.replace('_', ' '),
                value: v,
              }))}
            />
          </DetailFieldRow>
          <DetailFieldRow label="Assignee">{task.assigneeName ?? '—'}</DetailFieldRow>
          {task.description && <DetailFieldRow label="Description">{task.description}</DetailFieldRow>}
          {manager && (
            <DetailFieldRow label="Assign to">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Select
                  placeholder="Select user"
                  className={cn('w-full', selectFieldClass)}
                  value={assigneeId}
                  onChange={setAssigneeId}
                  options={users.map((u) => ({ label: u.name, value: u.id }))}
                />
                <Button
                  type="primary"
                  onClick={async () => {
                    if (!assigneeId) return
                    try {
                      await assignTask(taskId, assigneeId)
                      message.success('Task assigned')
                      await refresh()
                    } catch (err) {
                      message.error(getApiErrorMessage(err, 'Assign failed'))
                    }
                  }}
                >
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
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Input.TextArea
            rows={2}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment"
          />
          <Button
            type="primary"
            onClick={async () => {
              if (!comment.trim()) return
              try {
                await addTaskComment(taskId, { content: comment.trim() })
                setComment('')
                message.success('Comment added')
                await refresh()
              } catch (err) {
                message.error(getApiErrorMessage(err, 'Failed to add comment'))
              }
            }}
          >
            Post
          </Button>
        </div>
      </ResponsiveCard>
    </div>
  )
}
