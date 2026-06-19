import { useCallback, useEffect, useRef, useState } from 'react'
import { List, Select, Typography, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  ISSUE_STATUS_OPTIONS,
  SEVERITY_OPTIONS,
  addFinding,
  assignIssue,
  fetchIssue,
  upsertIssue,
} from '../../api/issues.api'
import { fetchUsers } from '../../api/users.api'
import {
  Button,
  DetailFieldList,
  DetailFieldRow,
  Input,
  Loader,
  PriorityTag,
  ResponsiveCard,
  selectFieldClass,
  stackListItemClass,
} from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/cn'
import type { IssueDetail } from '../../types/issue'
import type { UserListItem } from '../../types/user'
import { getApiErrorMessage } from '../../utils/errors'

const { Text } = Typography

export interface IssueDetailPanelProps {
  issueId: number
  onLoaded?: (issue: IssueDetail) => void
  onError?: () => void
}

export function IssueDetailPanel({ issueId, onLoaded, onError }: IssueDetailPanelProps) {
  const { user } = useAuth()
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER'

  const [issue, setIssue] = useState<IssueDetail | null>(null)
  const [users, setUsers] = useState<UserListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [findingTitle, setFindingTitle] = useState('')
  const [findingSeverity, setFindingSeverity] = useState<string>('MEDIUM')
  const [assigneeId, setAssigneeId] = useState<number | undefined>()
  const onLoadedRef = useRef(onLoaded)
  const onErrorRef = useRef(onError)

  useEffect(() => {
    onLoadedRef.current = onLoaded
    onErrorRef.current = onError
  })

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchIssue(issueId)
      setIssue(data)
      onLoadedRef.current?.(data)
      if (canManage) {
        fetchUsers({ page: 1, limit: 100 })
          .then((response) => setUsers(response.data))
          .catch(() => setUsers([]))
      }
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to load issue'))
      onErrorRef.current?.()
    } finally {
      setLoading(false)
    }
  }, [issueId, canManage])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleStatusChange = async (status: string) => {
    if (!issue) return
    try {
      await upsertIssue(issue.engagementId, {
        id: issueId,
        status: status as IssueDetail['status'],
      })
      message.success('Status updated')
      loadData()
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to update status'))
    }
  }

  const handleAssign = async () => {
    if (!assigneeId) return
    try {
      await assignIssue(issueId, assigneeId)
      message.success('Issue assigned')
      loadData()
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to assign issue'))
    }
  }

  const handleAddFinding = async () => {
    if (!findingTitle.trim()) return
    try {
      await addFinding(issueId, {
        title: findingTitle.trim(),
        severity: findingSeverity as IssueDetail['severity'],
      })
      setFindingTitle('')
      message.success('Finding added')
      loadData()
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to add finding'))
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader />
      </div>
    )
  }

  if (!issue) return null

  return (
    <div className="flex flex-col gap-3">
      <ResponsiveCard bodyStyle={{ padding: 12 }}>
        <DetailFieldList>
          <DetailFieldRow label="Severity">
            <PriorityTag value={issue.severity} />
          </DetailFieldRow>
          <DetailFieldRow label="Status">
            <Select
              value={issue.status}
              onChange={handleStatusChange}
              className={cn('w-full', selectFieldClass)}
              options={ISSUE_STATUS_OPTIONS.map((value) => ({
                label: value.replace('_', ' '),
                value,
              }))}
            />
          </DetailFieldRow>
          <DetailFieldRow label="Assignee">
            {issue.assigneeName ? (
              <Text>{issue.assigneeName}</Text>
            ) : (
              <Text type="secondary">Unassigned</Text>
            )}
          </DetailFieldRow>
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
          <DetailFieldRow label="Responsible Person">
            {issue.responsiblePerson || '—'}
          </DetailFieldRow>
          {issue.description && (
            <DetailFieldRow label="Description">{issue.description}</DetailFieldRow>
          )}
        </DetailFieldList>
      </ResponsiveCard>

      <ResponsiveCard title="Findings">
        <List
          dataSource={issue.findings}
          locale={{ emptyText: 'No findings recorded yet' }}
          renderItem={(item) => (
            <List.Item className={stackListItemClass}>
              <List.Item.Meta
                title={
                  <span className="flex flex-wrap items-center gap-2">
                    {item.title}
                    <PriorityTag value={item.severity} />
                  </span>
                }
                description={
                  <>
                    {item.description && <div>{item.description}</div>}
                    <Text type="secondary" className="text-xs">
                      {item.createdByName} · {new Date(item.createdAt).toLocaleString()}
                    </Text>
                  </>
                }
              />
            </List.Item>
          )}
        />

        <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4">
          <Input
            placeholder="Finding title"
            value={findingTitle}
            onChange={(e) => setFindingTitle(e.target.value)}
          />
          <div className="flex flex-col gap-2 sm:flex-row">
            <Select
              value={findingSeverity}
              onChange={setFindingSeverity}
              className={cn('w-full sm:w-36', selectFieldClass)}
              options={SEVERITY_OPTIONS.map((value) => ({ label: value, value }))}
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAddFinding} className="sm:shrink-0">
              Add Finding
            </Button>
          </div>
        </div>
      </ResponsiveCard>

      <ResponsiveCard title="Status History">
        <List
          dataSource={issue.statusLogs}
          locale={{ emptyText: 'No status changes yet' }}
          renderItem={(item) => (
            <List.Item className={stackListItemClass}>
              <Text className="min-w-0 break-words">
                {item.oldStatus} → {item.newStatus} by {item.changedByName}
              </Text>
              <Text type="secondary" className="shrink-0 text-xs">
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </List.Item>
          )}
        />
      </ResponsiveCard>
    </div>
  )
}
