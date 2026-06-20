import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Empty, Skeleton } from 'antd'
import {
  BarChartOutlined,
  CheckCircleOutlined,
  PlusOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { fetchDashboardStats } from '../../api/reports.api'
import { Button, PageBody, PageContainer, PageHeader } from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { cn } from '../../utils/cn'
import { AuditorDashboard } from './AuditorDashboard'

interface DashboardStatsState {
  totalClients: number
  totalAudits: number
  completedAudits: number
  openRisks: number
  pendingTasks: number
  openIssues: number
  resolvedIssues: number
  workload: {
    tasksByAssignee: Array<{
      userId: number
      userName: string
      pending: number
      inProgress: number
    }>
    openChecklistsByAssignee: Array<{
      userId: number
      userName: string
      openCount: number
    }>
  }
}

const EMPTY_STATS: DashboardStatsState = {
  totalClients: 0,
  totalAudits: 0,
  completedAudits: 0,
  openRisks: 0,
  pendingTasks: 0,
  openIssues: 0,
  resolvedIssues: 0,
  workload: { tasksByAssignee: [], openChecklistsByAssignee: [] },
}

const KPI_LINKS = [
  { label: 'Clients', href: '/clients', key: 'totalClients' as const },
  { label: 'Engagements', href: '/engagements', key: 'totalAudits' as const },
  { label: 'Open issues', href: '/issues', key: 'openIssues' as const },
  { label: 'Pending tasks', href: '/tasks', key: 'pendingTasks' as const },
] as const

const SECONDARY_STATS = [
  { label: 'Completed audits', href: '/engagements', key: 'completedAudits' as const, icon: CheckCircleOutlined },
  { label: 'Open risks', href: '/risks', key: 'openRisks' as const, icon: WarningOutlined },
  { label: 'Resolved issues', href: '/issues', key: 'resolvedIssues' as const, icon: CheckCircleOutlined },
] as const

function KpiValue({
  label,
  value,
  href,
  loading,
}: {
  label: string
  value: number
  href: string
  loading: boolean
}) {
  return (
    <Link
      to={href}
      className="group flex min-w-[120px] flex-1 flex-col gap-1 px-3 py-1 transition first:pl-0 last:pr-0 hover:opacity-80 md:px-5"
    >
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {loading ? (
        <Skeleton active paragraph={false} title={{ width: 56 }} />
      ) : (
        <span className="text-2xl font-bold tabular-nums text-slate-900 md:text-3xl">{value}</span>
      )}
      <span className="text-[11px] font-medium text-brand opacity-0 transition group-hover:opacity-100">
        View details →
      </span>
    </Link>
  )
}

function SpotlightCard({
  title,
  description,
  value,
  loading,
  tone,
}: {
  title: string
  description: string
  value: string
  loading: boolean
  tone: 'brand' | 'warning' | 'success'
}) {
  const toneClass = {
    brand: 'border-brand/20 bg-brand/5',
    warning: 'border-amber-200 bg-amber-50/80',
    success: 'border-emerald-200 bg-emerald-50/80',
  }[tone]

  return (
    <div className={cn('rounded-2xl border p-4 md:p-5', toneClass)}>
      <p className="m-0 text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      {loading ? (
        <Skeleton active paragraph={{ rows: 1 }} className="mt-2" />
      ) : (
        <>
          <p className="m-0 mt-2 text-2xl font-bold text-slate-900">{value}</p>
          <p className="m-0 mt-1 text-sm text-slate-600">{description}</p>
        </>
      )}
    </div>
  )
}

function WorkloadTable({
  title,
  columns,
  rows,
  loading,
  emptyText,
}: {
  title: string
  columns: [string, string, string?]
  rows: Array<{ id: number; cells: [ReactNode, ReactNode, ReactNode?] }>
  loading: boolean
  emptyText: string
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3 md:px-5">
        <h3 className="m-0 text-sm font-semibold text-slate-800 md:text-base">{title}</h3>
      </div>
      {loading ? (
        <div className="p-4 md:p-5">
          <Skeleton active paragraph={{ rows: 4 }} />
        </div>
      ) : rows.length === 0 ? (
        <Empty description={emptyText} image={Empty.PRESENTED_IMAGE_SIMPLE} className="py-8" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[280px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-surface text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                <th className="px-4 py-2.5 md:px-5">{columns[0]}</th>
                <th className="px-4 py-2.5 md:px-5">{columns[1]}</th>
                {columns[2] && <th className="px-4 py-2.5 md:px-5">{columns[2]}</th>}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-4 py-3 font-medium text-slate-800 md:px-5">{row.cells[0]}</td>
                  <td className="px-4 py-3 text-slate-600 md:px-5">{row.cells[1]}</td>
                  {columns[2] && (
                    <td className="px-4 py-3 text-slate-600 md:px-5">{row.cells[2]}</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export function DashboardPage() {
  const { user } = useAuth()

  if (user?.role === 'AUDITOR') {
    return <AuditorDashboard />
  }

  return <AdminManagerDashboard />
}

function AdminManagerDashboard() {
  const { user } = useAuth()
  const canManage = user?.role === 'ADMIN' || user?.role === 'MANAGER'
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStatsState>(EMPTY_STATS)

  const firstName = user?.name?.split(' ')[0] ?? 'there'

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(() => setStats(EMPTY_STATS))
      .finally(() => setLoading(false))
  }, [])

  const workload = stats.workload

  const completionRate = useMemo(
    () => (stats.totalAudits > 0 ? Math.round((stats.completedAudits / stats.totalAudits) * 100) : 0),
    [stats.completedAudits, stats.totalAudits],
  )

  const taskRows = workload.tasksByAssignee.map((row) => ({
    id: row.userId,
    cells: [
      row.userName,
      row.pending,
      row.inProgress,
    ] as [ReactNode, ReactNode, ReactNode],
  }))

  const checklistRows = workload.openChecklistsByAssignee.map((row) => ({
    id: row.userId,
    cells: [row.userName, row.openCount] as [ReactNode, ReactNode],
  }))

  return (
    <PageContainer>
      <PageHeader
        title={`Dashboard`}
        subtitle={`Hi ${firstName}, here is your audit overview for today.`}
        extra={
          <div className="flex flex-wrap gap-2">
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

      <PageBody variant="fill" className="gap-4 overflow-y-auto pb-2 md:gap-5">
        {/* Primary KPI strip */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-stretch">
            <div className="flex flex-1 overflow-x-auto pb-1">
              <div className="flex min-w-max flex-1 divide-x divide-slate-200">
                {KPI_LINKS.map((kpi) => (
                  <KpiValue
                    key={kpi.key}
                    label={kpi.label}
                    value={stats[kpi.key]}
                    href={kpi.href}
                    loading={loading}
                  />
                ))}
              </div>
            </div>
            <Divider type="vertical" className="hidden! h-auto! md:block!" />
            <div className="flex shrink-0 flex-col justify-center md:min-w-[140px] md:pl-2">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Audit progress
              </span>
              {loading ? (
                <Skeleton active paragraph={false} title={{ width: 72 }} className="mt-2" />
              ) : (
                <>
                  <span className="mt-1 text-3xl font-bold tabular-nums text-brand">{completionRate}%</span>
                  <span className="mt-0.5 text-xs text-slate-500">engagements complete</span>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Spotlight row */}
        <section className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
          <SpotlightCard
            title="Attention needed"
            value={`${stats.openIssues + stats.openRisks}`}
            description={`${stats.openIssues} issues and ${stats.openRisks} risks currently open.`}
            loading={loading}
            tone="warning"
          />
          <SpotlightCard
            title="Team capacity"
            value={`${stats.pendingTasks}`}
            description="Tasks waiting to be picked up or completed."
            loading={loading}
            tone="brand"
          />
          <SpotlightCard
            title="Closed this cycle"
            value={`${stats.resolvedIssues}`}
            description="Issues marked resolved or closed."
            loading={loading}
            tone="success"
          />
        </section>

        {/* Secondary stats + shortcuts */}
        <section className="grid gap-3 lg:grid-cols-[1fr_240px] lg:gap-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
            <h2 className="m-0 mb-3 text-sm font-semibold text-slate-800">More metrics</h2>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              {SECONDARY_STATS.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.key}
                    to={item.href}
                    className="flex items-center gap-3 rounded-xl border border-slate-100 bg-surface px-3 py-3 transition hover:border-brand/30 hover:bg-white"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-brand shadow-sm">
                      <Icon />
                    </span>
                    <div className="min-w-0">
                      {loading ? (
                        <Skeleton active paragraph={false} title={{ width: 40 }} />
                      ) : (
                        <>
                          <p className="m-0 text-lg font-bold tabular-nums text-slate-900">
                            {stats[item.key]}
                          </p>
                          <p className="m-0 truncate text-xs text-slate-500">{item.label}</p>
                        </>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 md:p-5">
            <h2 className="m-0 mb-3 text-sm font-semibold text-slate-800">Shortcuts</h2>
            <nav className="flex flex-col gap-1">
              {[
                { label: 'Add client', href: '/clients', state: { openCreate: true } },
                { label: 'Upload document', href: '/documents' },
                { label: 'Review risks', href: '/risks' },
                { label: 'Manage users', href: '/users' },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  state={link.state}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-surface hover:text-brand"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        </section>

        {/* Workload tables */}
        {canManage && (
          <section className="grid gap-3 md:grid-cols-2 md:gap-4">
            <WorkloadTable
              title="Tasks by assignee"
              columns={['Assignee', 'Pending', 'In progress']}
              rows={taskRows}
              loading={loading}
              emptyText="No active task assignments"
            />
            <WorkloadTable
              title="Open checklists"
              columns={['Assignee', 'Open items']}
              rows={checklistRows}
              loading={loading}
              emptyText="No open checklist assignments"
            />
          </section>
        )}
      </PageBody>
    </PageContainer>
  )
}
