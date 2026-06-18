import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { List, Select, Typography, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import {
  ISSUE_STATUS_OPTIONS,
  SEVERITY_OPTIONS,
  addFinding,
  fetchIssue,
  updateIssue,
} from '../../api/issues.api'
import {
  Button,
  Input,
  IssueStatusTag,
  Loader,
  PageBody,
  PageContainer,
  PageHeader,
  PriorityTag,
  ResponsiveCard,
} from '../../components/common'
import type { IssueDetail } from '../../types/issue'
import { getApiErrorMessage } from '../../utils/errors'

const { Text } = Typography

export function IssueDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const issueId = Number(id)

  const [issue, setIssue] = useState<IssueDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [findingTitle, setFindingTitle] = useState('')
  const [findingSeverity, setFindingSeverity] = useState<string>('MEDIUM')

  const loadData = useCallback(async () => {
    if (!issueId) return
    setLoading(true)
    try {
      setIssue(await fetchIssue(issueId))
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to load issue'))
      navigate('/issues')
    } finally {
      setLoading(false)
    }
  }, [issueId, navigate])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleStatusChange = async (status: string) => {
    try {
      await updateIssue(issueId, { status: status as IssueDetail['status'] })
      message.success('Status updated')
      loadData()
    } catch (err) {
      message.error(getApiErrorMessage(err, 'Failed to update status'))
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

  if (loading) return <Loader fullPage />
  if (!issue) return null

  return (
    <PageContainer>
      <PageHeader
        title={issue.title}
        subtitle={`Issue for ${issue.engagementTitle}`}
        breadcrumbs={[{ title: 'Issues', href: '/issues' }, { title: issue.title }]}
      />

      <PageBody className="space-y-4 sm:space-y-5">
      <ResponsiveCard className="mb-0">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Text type="secondary">Severity</Text>
            <div className="mt-1">
              <PriorityTag value={issue.severity} />
            </div>
          </div>
          <div>
            <Text type="secondary">Status</Text>
            <div className="mt-1">
              <Select
                value={issue.status}
                onChange={handleStatusChange}
                className="w-full sm:w-48"
                options={ISSUE_STATUS_OPTIONS.map((value) => ({
                  label: value.replace('_', ' '),
                  value,
                }))}
              />
            </div>
          </div>
          <div>
            <Text type="secondary">Responsible Person</Text>
            <div className="mt-1">{issue.responsiblePerson || '—'}</div>
          </div>
          <div>
            <Text type="secondary">Current Status</Text>
            <div className="mt-1">
              <IssueStatusTag status={issue.status} />
            </div>
          </div>
          {issue.description && (
            <div className="sm:col-span-2">
              <Text type="secondary">Description</Text>
              <div className="mt-1">{issue.description}</div>
            </div>
          )}
        </div>
      </ResponsiveCard>

      <ResponsiveCard
        className="mb-0"
        title="Findings"
        extra={<PlusOutlined className="text-indigo-600" />}
      >
        <List
          dataSource={issue.findings}
          locale={{ emptyText: 'No findings recorded yet' }}
          renderItem={(item) => (
            <List.Item className="stack-list-item">
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

        <div className="mt-4 grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-[1fr_auto_auto]">
          <Input
            placeholder="Finding title"
            value={findingTitle}
            onChange={(e) => setFindingTitle(e.target.value)}
          />
          <Select
            value={findingSeverity}
            onChange={setFindingSeverity}
            className="mobile-full-select sm:w-36"
            options={SEVERITY_OPTIONS.map((value) => ({ label: value, value }))}
          />
          <Button type="primary" onClick={handleAddFinding} block className="sm:!inline-flex">
            Add Finding
          </Button>
        </div>
      </ResponsiveCard>

      <ResponsiveCard title="Status History">
        <List
          dataSource={issue.statusLogs}
          locale={{ emptyText: 'No status changes yet' }}
          renderItem={(item) => (
            <List.Item className="stack-list-item">
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
      </PageBody>
    </PageContainer>
  )
}
