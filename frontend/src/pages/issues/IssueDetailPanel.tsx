import { useEffect, useRef, useState } from 'react'
import { List, Select, Typography, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  ISSUE_STATUS_OPTIONS,
  SEVERITY_OPTIONS,
  addFinding,
  assignIssue,
  assignIssueClient,
  fetchIssue,
  upsertIssue,
} from '../../api/issues.api'
import { fetchClients } from '../../api/clients.api'
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
import { canManage } from '../../lib/roles'
import { cn } from '../../utils/cn'
import type { IssueDetail } from '../../types/issue'
import type { ClientListItem } from '../../types/client'
import type { UserListItem } from '../../types/user'
import { getApiErrorMessage } from '../../utils/errors'

const { Text } = Typography

export interface IssueDetailPanelProps {
  issueId: number
  onLoaded?: (issue: IssueDetail) => void
  onError?: () => void
  onMutated?: () => void
}

export function IssueDetailPanel({ issueId, onLoaded, onError, onMutated }: IssueDetailPanelProps) {
  const { user } = useAuth()
  const manager = canManage(user?.role)

  const [issue, setIssue] = useState<IssueDetail | null>(null)
  const [users, setUsers] = useState<UserListItem[]>([])
  const [clients, setClients] = useState<ClientListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [findingTitle, setFindingTitle] = useState('')
  const [findingSeverity, setFindingSeverity] = useState('MEDIUM')
  const [assigneeId, setAssigneeId] = useState<number>()
  const [clientId, setClientId] = useState<number>()

  const onLoadedRef = useRef(onLoaded)
  const onErrorRef = useRef(onError)
  const onMutatedRef = useRef(onMutated)
  useEffect(() => {
    onLoadedRef.current = onLoaded
    onErrorRef.current = onError
    onMutatedRef.current = onMutated
  })

  const reload = async () => {
    const data = await fetchIssue(issueId)
    setIssue(data)
    onLoadedRef.current?.(data)
    return data
  }

  useEffect(() => {
    let active = true
    setLoading(true)

    reload()
      .then(() => {
        if (!active || !manager) return
        return Promise.all([
          fetchUsers({ page: 1, limit: 100 }),
          fetchClients({ page: 1, limit: 100 }),
        ])
      })
      .then((result) => {
        if (!result) return
        setUsers(result[0].data)
        setClients(result[1].data)
      })
      .catch((err) => {
        message.error(getApiErrorMessage(err, 'Failed to load issue'))
        onErrorRef.current?.()
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [issueId, manager])

  const refresh = async () => {
    try {
      await reload()
      onMutatedRef.current?.()
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to refresh issue'))
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

  const statusOptions = ISSUE_STATUS_OPTIONS.map((v) => ({
    label: v.replace('_', ' '),
    value: v,
  }))

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
              onChange={async (status) => {
                try {
                  await upsertIssue(issue.engagementId, { id: issueId, status })
                  message.success('Status updated')
                  await refresh()
                } catch (err) {
                  message.error(getApiErrorMessage(err, 'Failed to update status'))
                }
              }}
              className={cn('w-full', selectFieldClass)}
              options={statusOptions}
            />
          </DetailFieldRow>
          <DetailFieldRow label="Assignee">{issue.assigneeName ?? '—'}</DetailFieldRow>
          <DetailFieldRow label="Client">{issue.assignedClientName ?? '—'}</DetailFieldRow>
          <DetailFieldRow label="Responsible">{issue.responsiblePerson ?? '—'}</DetailFieldRow>
          {issue.description && <DetailFieldRow label="Description">{issue.description}</DetailFieldRow>}

          {manager && (
            <DetailFieldRow label="Assignment">
              <div className="flex flex-col gap-3">
                <Select
                  placeholder="Assign user"
                  className={cn('w-full', selectFieldClass)}
                  value={assigneeId}
                  onChange={setAssigneeId}
                  options={users.map((u) => ({ label: u.name, value: u.id }))}
                />
                <Button
                  size="small"
                  onClick={async () => {
                    if (!assigneeId) return
                    try {
                      await assignIssue(issueId, assigneeId)
                      message.success('User assigned')
                      await refresh()
                    } catch (err) {
                      message.error(getApiErrorMessage(err, 'Assign failed'))
                    }
                  }}
                >
                  Save user
                </Button>
                <Select
                  placeholder="Assign client"
                  className={cn('w-full', selectFieldClass)}
                  value={clientId}
                  onChange={setClientId}
                  options={clients.map((c) => ({ label: c.name, value: c.id }))}
                />
                <Button
                  size="small"
                  onClick={async () => {
                    if (!clientId) return
                    try {
                      await assignIssueClient(issueId, clientId)
                      message.success('Client assigned')
                      await refresh()
                    } catch (err) {
                      message.error(getApiErrorMessage(err, 'Assign failed'))
                    }
                  }}
                >
                  Save client
                </Button>
              </div>
            </DetailFieldRow>
          )}
        </DetailFieldList>
      </ResponsiveCard>

      <ResponsiveCard title="Findings">
        <List
          dataSource={issue.findings}
          locale={{ emptyText: 'No findings yet' }}
          renderItem={(item) => (
            <List.Item className={stackListItemClass}>
              <List.Item.Meta
                title={
                  <span className="flex items-center gap-2">
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
        <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row">
          <Input
            placeholder="Finding title"
            value={findingTitle}
            onChange={(e) => setFindingTitle(e.target.value)}
          />
          <Select
            value={findingSeverity}
            onChange={setFindingSeverity}
            className={cn('w-full sm:w-32', selectFieldClass)}
            options={SEVERITY_OPTIONS.map((v) => ({ label: v, value: v }))}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={async () => {
              if (!findingTitle.trim()) return
              try {
                await addFinding(issueId, {
                  title: findingTitle.trim(),
                  severity: findingSeverity as IssueDetail['severity'],
                })
                setFindingTitle('')
                message.success('Finding added')
                await refresh()
              } catch (err) {
                message.error(getApiErrorMessage(err, 'Failed to add finding'))
              }
            }}
          >
            Add
          </Button>
        </div>
      </ResponsiveCard>

      <ResponsiveCard title="Status history">
        <List
          dataSource={issue.statusLogs}
          locale={{ emptyText: 'No changes yet' }}
          renderItem={(item) => (
            <List.Item className={stackListItemClass}>
              <Text>
                {item.oldStatus} → {item.newStatus} ({item.changedByName})
              </Text>
              <Text type="secondary" className="text-xs">
                {new Date(item.createdAt).toLocaleString()}
              </Text>
            </List.Item>
          )}
        />
      </ResponsiveCard>
    </div>
  )
}
