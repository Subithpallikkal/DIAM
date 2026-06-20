import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Skeleton, Table } from 'antd'
import { BarChartOutlined, PlusOutlined } from '@ant-design/icons'
import { fetchDashboardStats, fetchMyDashboardStats } from '../../api/reports.api'
import {
  Button,
  IssueStatusTag,
  PageBody,
  PageContainer,
  PageHeader,
  PriorityTag,
} from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { canManage } from '../../lib/roles'
import type { DashboardStats, MyDashboardStats } from '../../types/report'

const emptyOrgStats: DashboardStats = {
  totalClients: 0,
  totalAudits: 0,
  completedAudits: 0,
  openRisks: 0,
  pendingTasks: 0,
  openIssues: 0,
  resolvedIssues: 0,
  workload: { tasksByAssignee: [], openChecklistsByAssignee: [] },
}

const emptyMyStats: MyDashboardStats = {
  pendingTasks: 0,
  inProgressTasks: 0,
  openChecklists: 0,
  openIssues: 0,
  myTasks: [],
  myChecklists: [],
  myIssues: [],
}

export function DashboardPage() {
  const { user } = useAuth()
  if (user?.role === 'AUDITOR') return <AuditorDashboard />
  return <ManagerDashboard />
}

function AuditorDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<MyDashboardStats>(emptyMyStats)

  useEffect(() => {
    fetchMyDashboardStats()
      .then(setStats)
      .catch(() => setStats(emptyMyStats))
      .finally(() => setLoading(false))
  }, [])

  const name = user?.name?.split(' ')[0] ?? 'there'

  return (
    <PageContainer>
      <PageHeader title="My Dashboard" subtitle={`Hi ${name}`} />

      <PageBody variant="fill" className="gap-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard label="Pending tasks" value={stats.pendingTasks} loading={loading} href="/tasks" />
          <StatCard label="In progress" value={stats.inProgressTasks} loading={loading} href="/tasks" />
          <StatCard label="Open checklists" value={stats.openChecklists} loading={loading} href="/risks" />
          <StatCard label="Open issues" value={stats.openIssues} loading={loading} href="/issues" />
        </div>

        <WorkPanel title="My tasks" loading={loading} empty="Nothing assigned" hasItems={stats.myTasks.length > 0}>
          {stats.myTasks.map((task) => (
            <Link key={task.id} to={`/tasks/${task.id}`} className="block border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-surface">
              <div className="font-medium text-brand-dark">{task.title}</div>
              <div className="text-xs text-slate-500">
                {task.engagementTitle} · {task.status.replace('_', ' ')}
              </div>
            </Link>
          ))}
        </WorkPanel>

        <div className="grid gap-4 md:grid-cols-2">
          <WorkPanel title="My checklists" loading={loading} empty="Nothing assigned" hasItems={stats.myChecklists.length > 0}>
            {stats.myChecklists.map((item) => (
              <Link key={item.id} to={`/risks/${item.riskId}`} className="block border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-surface">
                <div className="font-medium text-brand-dark">{item.title}</div>
                <div className="text-xs text-slate-500">
                  {item.riskTitle} · {item.engagementTitle}
                </div>
              </Link>
            ))}
          </WorkPanel>

          <WorkPanel title="My issues" loading={loading} empty="Nothing assigned" hasItems={stats.myIssues.length > 0}>
            {stats.myIssues.map((issue) => (
              <Link key={issue.id} to={`/issues/${issue.id}`} className="block border-b border-slate-100 px-4 py-3 last:border-0 hover:bg-surface">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-medium text-brand-dark">{issue.title}</div>
                    <div className="text-xs text-slate-500">{issue.engagementTitle}</div>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1">
                    <PriorityTag value={issue.severity} />
                    <IssueStatusTag status={issue.status} />
                  </div>
                </div>
              </Link>
            ))}
          </WorkPanel>
        </div>
      </PageBody>
    </PageContainer>
  )
}

function ManagerDashboard() {
  const { user } = useAuth()
  const isManager = canManage(user?.role)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>(emptyOrgStats)

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(() => setStats(emptyOrgStats))
      .finally(() => setLoading(false))
  }, [])

  const name = user?.name?.split(' ')[0] ?? 'there'
  const completion =
    stats.totalAudits > 0 ? Math.round((stats.completedAudits / stats.totalAudits) * 100) : 0

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        subtitle={`Hi ${name}`}
        extra={
          <div className="flex gap-2">
            <Link to="/engagements" state={{ openCreate: true }}>
              <Button type="primary" icon={<PlusOutlined />} size="small">
                New engagement
              </Button>
            </Link>
            <Link to="/reports">
              <Button icon={<BarChartOutlined />} size="small">
                Reports
              </Button>
            </Link>
          </div>
        }
      />

      <PageBody variant="fill" className="gap-4 overflow-y-auto">
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          <StatCard label="Clients" value={stats.totalClients} loading={loading} href="/clients" />
          <StatCard label="Engagements" value={stats.totalAudits} loading={loading} href="/engagements" />
          <StatCard label="Open issues" value={stats.openIssues} loading={loading} href="/issues" />
          <StatCard label="Pending tasks" value={stats.pendingTasks} loading={loading} href="/tasks" />
          <StatCard label="Completion" value={completion} loading={loading} suffix="%" />
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <StatCard label="Open risks" value={stats.openRisks} loading={loading} href="/risks" />
          <StatCard label="Resolved issues" value={stats.resolvedIssues} loading={loading} href="/issues" />
          <StatCard label="Completed audits" value={stats.completedAudits} loading={loading} href="/engagements" />
        </div>

        {isManager && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="mb-3 text-sm font-semibold">Tasks by assignee</h3>
              <Table
                size="small"
                pagination={false}
                loading={loading}
                rowKey="userId"
                dataSource={stats.workload.tasksByAssignee}
                locale={{ emptyText: 'No data' }}
                columns={[
                  { title: 'User', dataIndex: 'userName' },
                  { title: 'Pending', dataIndex: 'pending', width: 80 },
                  { title: 'In progress', dataIndex: 'inProgress', width: 90 },
                ]}
              />
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <h3 className="mb-3 text-sm font-semibold">Open checklists</h3>
              <Table
                size="small"
                pagination={false}
                loading={loading}
                rowKey="userId"
                dataSource={stats.workload.openChecklistsByAssignee}
                locale={{ emptyText: 'No data' }}
                columns={[
                  { title: 'User', dataIndex: 'userName' },
                  { title: 'Open', dataIndex: 'openCount', width: 80 },
                ]}
              />
            </div>
          </div>
        )}
      </PageBody>
    </PageContainer>
  )
}

function StatCard({
  label,
  value,
  loading,
  href,
  suffix,
}: {
  label: string
  value: number
  loading: boolean
  href?: string
  suffix?: string
}) {
  const content = (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="text-xs text-slate-500">{label}</div>
      {loading ? (
        <Skeleton active paragraph={false} title={{ width: 48 }} className="mt-2" />
      ) : (
        <div className="mt-1 text-2xl font-semibold text-slate-900">
          {value}
          {suffix}
        </div>
      )}
    </div>
  )

  return href ? (
    <Link to={href} className="block transition hover:opacity-80">
      {content}
    </Link>
  ) : (
    content
  )
}

function WorkPanel({
  title,
  loading,
  empty,
  hasItems,
  children,
}: {
  title: string
  loading: boolean
  empty: string
  hasItems: boolean
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3 text-sm font-semibold">{title}</div>
      {loading ? (
        <div className="p-4">
          <Skeleton active paragraph={{ rows: 3 }} />
        </div>
      ) : hasItems ? (
        <div>{children}</div>
      ) : (
        <p className="px-4 py-6 text-center text-sm text-slate-500">{empty}</p>
      )}
    </div>
  )
}
