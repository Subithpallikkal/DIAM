import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Empty, Input, Skeleton, Table } from 'antd'
import {
  AuditOutlined,
  CheckSquareOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
  ReloadOutlined,
  RightOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { fetchDashboardStats, fetchMyDashboardStats } from '../../api/reports.api'
import { Button, MobileListCard, MobileListRow, PageBody, PageContainer } from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { canManage } from '../../lib/roles'
import { UI } from '../../lib/ui'
import { cn } from '../../utils/cn'
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

function ManagerDashboard() {
  const { user } = useAuth()
  const isManager = canManage(user?.role)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<DashboardStats>(emptyOrgStats)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchDashboardStats()
      .then(setStats)
      .catch(() => setStats(emptyOrgStats))
      .finally(() => setLoading(false))
  }, [])

  const name = user?.name ?? 'User'
  const completion =
    stats.totalAudits > 0 ? Math.round((stats.completedAudits / stats.totalAudits) * 100) : 0
  const issueTotal = stats.openIssues + stats.resolvedIssues
  const issueResolvedPct = issueTotal > 0 ? Math.round((stats.resolvedIssues / issueTotal) * 100) : 0

  const chartSeries = useMemo(
    () => ({
      current: [
        stats.completedAudits,
        stats.resolvedIssues,
        stats.totalClients,
        stats.completedAudits,
        stats.resolvedIssues + 2,
        stats.completedAudits,
      ],
      previous: [
        Math.max(stats.completedAudits - 2, 0),
        Math.max(stats.resolvedIssues - 1, 0),
        Math.max(stats.totalClients - 1, 0),
        Math.max(stats.completedAudits - 1, 0),
        stats.resolvedIssues,
        Math.max(stats.completedAudits - 2, 0),
      ],
    }),
    [stats],
  )

  const workloadRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    const rows = stats.workload.tasksByAssignee.map((row) => ({
      key: `task-${row.userId}`,
      name: row.userName,
      metric: `${row.pending} pending · ${row.inProgress} active`,
      total: row.pending + row.inProgress,
      type: 'Tasks',
    }))
    if (!q) return rows
    return rows.filter((row) => row.name.toLowerCase().includes(q))
  }, [stats.workload.tasksByAssignee, search])

  return (
    <PageContainer className="min-w-0 gap-3 md:gap-4">
      <DashboardTopBar
        title="Dashboard"
        subtitle={`Welcome back ${name}`}
        exportHref="/reports"
        exportLabel="Reports"
      />

      <PageBody variant="fill" className="min-w-0 gap-3 overflow-x-hidden overflow-y-auto sm:gap-4 md:gap-5">
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <MetricTile
            label="Total clients"
            value={stats.totalClients}
            loading={loading}
            href="/clients"
            icon={<TeamOutlined />}
            trend={`${stats.totalClients} active`}
            trendUp
          />
          <MetricTile
            label="Engagements"
            value={stats.totalAudits}
            loading={loading}
            href="/engagements"
            icon={<AuditOutlined />}
            badge={`${completion}%`}
            trend={`${stats.completedAudits} completed`}
            trendUp={completion >= 50}
          />
          <MetricTile
            label="Open issues"
            value={stats.openIssues}
            loading={loading}
            href="/issues"
            icon={<ExclamationCircleOutlined />}
            badge={`${issueResolvedPct}%`}
            trend={`${stats.resolvedIssues} resolved`}
            trendUp={false}
          />
          <MetricTile
            label="Pending tasks"
            value={stats.pendingTasks}
            loading={loading}
            href="/tasks"
            icon={<CheckSquareOutlined />}
            trend="Across all engagements"
            trendUp
          />
        </div>

        <div className="grid min-w-0 gap-3 sm:gap-4 xl:grid-cols-[1fr_320px]">
          <DashCard className="min-w-0 p-3 sm:p-4 md:p-5">
            <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="m-0 text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-[11px]">
                  Overall audits
                </p>
                {loading ? (
                  <Skeleton active paragraph={false} title={{ width: 120 }} className="mt-2" />
                ) : (
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-xl font-bold text-brand-dark sm:text-2xl md:text-3xl">
                      {stats.totalAudits.toLocaleString()}
                    </span>
                    <span className="rounded-md bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                      +{completion}%
                    </span>
                  </div>
                )}
              </div>
              <ChartLegend />
            </div>
            {loading ? (
              <Skeleton active paragraph={{ rows: 6 }} />
            ) : (
              <AreaChart current={chartSeries.current} previous={chartSeries.previous} />
            )}
          </DashCard>

          <DashCard className="min-w-0 p-3 sm:p-4 md:p-5">
            <p className="m-0 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Completion rate
            </p>
            {loading ? (
              <Skeleton active paragraph={false} title={{ width: 80 }} className="mt-2" />
            ) : (
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <span className="text-xl font-bold text-brand-dark sm:text-2xl">{completion}%</span>
                <span className="rounded-md bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">
                  +{completion}%
                </span>
              </div>
            )}
            <div className="mt-5 space-y-4">
              <FunnelRow label="Engagements done" value={stats.completedAudits} pct={completion} />
              <FunnelRow label="Issues resolved" value={stats.resolvedIssues} pct={issueResolvedPct} />
              <FunnelRow
                label="Open risks"
                value={stats.openRisks}
                pct={
                  stats.openRisks + stats.resolvedIssues > 0
                    ? Math.round((stats.openRisks / (stats.openRisks + stats.resolvedIssues)) * 100)
                    : 0
                }
              />
              <FunnelRow label="Pending tasks" value={stats.pendingTasks} pct={Math.min(stats.pendingTasks * 10, 100)} />
            </div>
          </DashCard>
        </div>

        <div className="grid min-w-0 gap-3 sm:gap-4 xl:grid-cols-[340px_1fr]">
          <DashCard className="flex min-w-0 flex-col p-3 sm:p-4 md:p-5">
            <p className="m-0 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
              Quick action
            </p>
            <h3 className="m-0 mt-2 text-lg font-semibold text-brand-dark">Start new engagement</h3>
            <p className="m-0 mt-2 text-sm leading-relaxed text-slate-500">
              Create an audit engagement, assign tasks, and track documents from one place.
            </p>
            <Link to="/engagements" state={{ openCreate: true }} className="mt-4 block">
              <button
                type="button"
                className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                style={{ background: UI.shell }}
              >
                New engagement
              </button>
            </Link>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <MiniBox label="Clients" value={stats.totalClients} loading={loading} />
              <MiniBox label="Documents" value={stats.totalAudits} loading={loading} />
            </div>
          </DashCard>

          <DashCard className="min-w-0">
            <DashCardToolbar
              label="Team workload"
              count={`${workloadRows.length} assignees`}
              search={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search assignee"
              action={
                <Button
                  size="small"
                  icon={<ReloadOutlined />}
                  className="w-full sm:w-auto"
                  onClick={() => {
                    setLoading(true)
                    fetchDashboardStats()
                      .then(setStats)
                      .finally(() => setLoading(false))
                  }}
                >
                  Refresh
                </Button>
              }
            />
            <div className="p-2 sm:p-3">
              {isManager ? (
                <>
                  <div className="hidden md:block">
                    <Table
                      size="small"
                      pagination={false}
                      loading={loading}
                      dataSource={workloadRows}
                      locale={{ emptyText: 'No workload data' }}
                      scroll={{ x: 520 }}
                      columns={[
                        {
                          title: 'Assignee',
                          dataIndex: 'name',
                          render: (text: string) => (
                            <span className="font-medium text-brand-dark">{text}</span>
                          ),
                        },
                        { title: 'Type', dataIndex: 'type', width: 90 },
                        { title: 'Workload', dataIndex: 'metric' },
                        {
                          title: 'Total',
                          dataIndex: 'total',
                          width: 70,
                          align: 'center',
                          render: (val: number) => (
                            <span className="font-semibold text-brand">{val}</span>
                          ),
                        },
                      ]}
                    />
                  </div>
                  <div className="flex flex-col gap-3 md:hidden">
                    {loading && workloadRows.length === 0 ? (
                      <Skeleton active paragraph={{ rows: 3 }} />
                    ) : workloadRows.length === 0 ? (
                      <Empty description="No workload data" className="py-6" />
                    ) : (
                      workloadRows.map((row) => (
                        <MobileListCard
                          key={row.key}
                          title={row.name}
                          badge={<span className="text-sm font-semibold text-brand">{row.total}</span>}
                        >
                          <MobileListRow icon={<CheckSquareOutlined />}>{row.metric}</MobileListRow>
                          <MobileListRow icon={<TeamOutlined />}>{row.type}</MobileListRow>
                        </MobileListCard>
                      ))
                    )}
                  </div>
                </>
              ) : (
                <Empty description="Workload visible to managers" className="py-8" />
              )}
            </div>
          </DashCard>
        </div>
      </PageBody>
    </PageContainer>
  )
}

function AuditorDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<MyDashboardStats>(emptyMyStats)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchMyDashboardStats()
      .then(setStats)
      .catch(() => setStats(emptyMyStats))
      .finally(() => setLoading(false))
  }, [])

  const name = user?.name ?? 'User'
  const active =
    stats.pendingTasks + stats.inProgressTasks + stats.openChecklists + stats.openIssues

  const chartSeries = useMemo(
    () => ({
      current: [
        stats.pendingTasks,
        stats.inProgressTasks,
        stats.openChecklists,
        stats.openIssues,
        stats.myTasks.length,
        stats.myIssues.length,
      ],
      previous: [
        Math.max(stats.pendingTasks - 1, 0),
        stats.inProgressTasks,
        Math.max(stats.openChecklists - 1, 0),
        stats.openIssues,
        stats.myTasks.length,
        Math.max(stats.myIssues.length - 1, 0),
      ],
    }),
    [stats],
  )

  const taskRows = useMemo(() => {
    const q = search.trim().toLowerCase()
    const rows = stats.myTasks.map((task) => ({
      key: task.id,
      title: task.title,
      engagement: task.engagementTitle,
      status: task.status.replace('_', ' '),
      href: `/tasks/${task.id}`,
    }))
    if (!q) return rows
    return rows.filter((row) => row.title.toLowerCase().includes(q) || row.engagement.toLowerCase().includes(q))
  }, [stats.myTasks, search])

  return (
    <PageContainer className="min-w-0 gap-3 md:gap-4">
      <DashboardTopBar title="My Dashboard" subtitle={`Welcome back ${name}`} exportHref="/tasks" exportLabel="My tasks" />

      <PageBody variant="fill" className="min-w-0 gap-3 overflow-x-hidden overflow-y-auto sm:gap-4 md:gap-5">
        <div className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
          <MetricTile label="Pending tasks" value={stats.pendingTasks} loading={loading} href="/tasks" icon={<AuditOutlined />} trend="Assigned to you" trendUp />
          <MetricTile label="In progress" value={stats.inProgressTasks} loading={loading} href="/tasks" icon={<CheckSquareOutlined />} trend="Currently active" trendUp />
          <MetricTile label="Checklists" value={stats.openChecklists} loading={loading} href="/risks" icon={<CheckSquareOutlined />} trend="Open items" trendUp={false} />
          <MetricTile label="Open issues" value={stats.openIssues} loading={loading} href="/issues" icon={<ExclamationCircleOutlined />} trend={`${active} total open`} trendUp={false} />
        </div>

        <div className="grid min-w-0 gap-3 sm:gap-4 xl:grid-cols-[1fr_320px]">
          <DashCard className="min-w-0 p-3 sm:p-4 md:p-5">
            <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="m-0 text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-[11px]">My workload</p>
                {loading ? (
                  <Skeleton active paragraph={false} title={{ width: 100 }} className="mt-2" />
                ) : (
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-xl font-bold text-brand-dark sm:text-2xl md:text-3xl">{active}</span>
                    <span className="rounded-md bg-brand/10 px-2 py-0.5 text-xs font-semibold text-brand">Active</span>
                  </div>
                )}
              </div>
              <ChartLegend currentLabel="Current" previousLabel="Previous" />
            </div>
            {loading ? <Skeleton active paragraph={{ rows: 6 }} /> : <AreaChart current={chartSeries.current} previous={chartSeries.previous} />}
          </DashCard>

          <DashCard className="min-w-0 p-3 sm:p-4 md:p-5">
            <p className="m-0 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Work split</p>
            {loading ? (
              <Skeleton active paragraph={false} title={{ width: 80 }} className="mt-2" />
            ) : (
              <div className="mt-1 text-xl font-bold text-brand-dark sm:text-2xl">{active} items</div>
            )}
            <div className="mt-5 space-y-4">
              <FunnelRow label="Pending tasks" value={stats.pendingTasks} pct={pct(stats.pendingTasks, active)} />
              <FunnelRow label="In progress" value={stats.inProgressTasks} pct={pct(stats.inProgressTasks, active)} />
              <FunnelRow label="Checklists" value={stats.openChecklists} pct={pct(stats.openChecklists, active)} />
              <FunnelRow label="Issues" value={stats.openIssues} pct={pct(stats.openIssues, active)} />
            </div>
          </DashCard>
        </div>

        <div className="grid min-w-0 gap-3 sm:gap-4 xl:grid-cols-[340px_1fr]">
          <DashCard className="flex min-w-0 flex-col p-3 sm:p-4 md:p-5">
            <p className="m-0 text-[11px] font-semibold uppercase tracking-wide text-slate-400">Need help?</p>
            <h3 className="m-0 mt-2 text-lg font-semibold text-brand-dark">Review your queue</h3>
            <p className="m-0 mt-2 text-sm text-slate-500">
              Open tasks, checklists, and issues assigned to you from the modules below.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <Link to="/tasks" className="rounded-lg border border-border bg-surface px-3 py-2 text-center text-sm font-medium text-brand-dark hover:border-brand">
                Tasks
              </Link>
              <Link to="/issues" className="rounded-lg border border-border bg-surface px-3 py-2 text-center text-sm font-medium text-brand-dark hover:border-brand">
                Issues
              </Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <MiniBox label="Tasks" value={stats.myTasks.length} loading={loading} />
              <MiniBox label="Issues" value={stats.myIssues.length} loading={loading} />
            </div>
          </DashCard>

          <DashCard className="min-w-0">
            <DashCardToolbar
              label="My tasks"
              count={`${taskRows.length} items`}
              search={search}
              onSearchChange={setSearch}
              searchPlaceholder="Search tasks"
            />
            <div className="divide-y divide-border">
              {loading ? (
                <div className="p-4">
                  <Skeleton active paragraph={{ rows: 4 }} />
                </div>
              ) : taskRows.length === 0 ? (
                <Empty description="No tasks assigned" className="py-8" />
              ) : (
                taskRows.map((row) => (
                  <Link
                    key={row.key}
                    to={row.href}
                    className="flex items-start justify-between gap-2 px-3 py-3 hover:bg-surface sm:items-center sm:gap-3 sm:px-4 md:px-5"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="line-clamp-2 text-sm font-medium text-brand-dark sm:truncate">{row.title}</div>
                      <div className="truncate text-xs text-slate-500">{row.engagement}</div>
                    </div>
                    <span className="max-w-[40%] shrink-0 rounded-md bg-surface px-2 py-0.5 text-center text-[10px] text-slate-600 sm:max-w-none sm:text-[11px]">
                      {row.status}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </DashCard>
        </div>
      </PageBody>
    </PageContainer>
  )
}

function pct(part: number, total: number) {
  return total > 0 ? Math.round((part / total) * 100) : 0
}

function DashboardTopBar({
  title,
  subtitle,
  exportHref,
  exportLabel,
}: {
  title: string
  subtitle: string
  exportHref: string
  exportLabel: string
}) {
  return (
    <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <h1 className="m-0 truncate text-lg font-semibold text-brand-dark sm:text-xl md:text-2xl">{title}</h1>
        <p className="m-0 mt-0.5 truncate text-xs text-slate-500 sm:text-sm">{subtitle}</p>
      </div>
      <Link to={exportHref} className="w-full shrink-0 sm:w-auto">
        <button
          type="button"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 sm:w-auto sm:py-2"
          style={{ background: UI.shell }}
        >
          <DownloadOutlined />
          {exportLabel}
        </button>
      </Link>
    </div>
  )
}

function ChartLegend({
  currentLabel = 'This period',
  previousLabel = 'Last period',
}: {
  currentLabel?: string
  previousLabel?: string
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 sm:gap-4 sm:text-xs">
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-brand" />
        {currentLabel}
      </span>
      <span className="flex items-center gap-1.5">
        <span className="h-2 w-2 shrink-0 rounded-full bg-table-header" />
        {previousLabel}
      </span>
    </div>
  )
}

function DashCardToolbar({
  label,
  count,
  search,
  onSearchChange,
  searchPlaceholder,
  action,
}: {
  label: string
  count: string
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-3 py-3 sm:px-4 md:px-5">
      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="m-0 text-[10px] font-semibold uppercase tracking-wide text-slate-400 sm:text-[11px]">
            {label}
          </p>
          <p className="m-0 mt-0.5 truncate text-sm font-semibold text-brand-dark">{count}</p>
        </div>
      </div>
      <div className={cn('flex w-full flex-col gap-2 sm:flex-row sm:items-center', action ? 'sm:justify-between' : undefined)}>
        <Input
          allowClear
          prefix={<span className="text-slate-400">⌕</span>}
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9! w-full rounded-lg! sm:max-w-xs"
        />
        {action}
      </div>
    </div>
  )
}

function DashCard({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('min-w-0 overflow-hidden rounded-xl border border-border bg-white shadow-sm sm:rounded-2xl', className)}>
      {children}
    </div>
  )
}

function MetricTile({
  label,
  value,
  loading,
  href,
  icon,
  badge,
  trend,
  trendUp = true,
}: {
  label: string
  value: number
  loading: boolean
  href: string
  icon: ReactNode
  badge?: string
  trend: string
  trendUp?: boolean
}) {
  return (
    <Link to={href} className="block h-full min-w-0">
      <DashCard className="flex h-full flex-col p-3 transition hover:shadow-md sm:p-4">
        <div className="flex items-start justify-between gap-1.5 sm:gap-2">
          <p className="m-0 line-clamp-2 text-[10px] font-semibold uppercase leading-tight tracking-wide text-slate-400 sm:text-[11px]">
            {label}
          </p>
          <span className="shrink-0 text-sm text-brand sm:text-base">{icon}</span>
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:mt-3 sm:gap-2">
          {loading ? (
            <Skeleton active paragraph={false} title={{ width: 56 }} />
          ) : (
            <>
              <span className="text-lg font-bold text-brand-dark sm:text-2xl">{value.toLocaleString()}</span>
              {badge && (
                <span
                  className={cn(
                    'rounded-md px-1.5 py-0.5 text-[10px] font-semibold sm:px-2 sm:text-xs',
                    trendUp ? 'bg-brand/10 text-brand' : 'bg-surface text-slate-500',
                  )}
                >
                  {badge}
                </span>
              )}
            </>
          )}
        </div>
        <div className="mt-auto flex items-center justify-between gap-1 border-t border-border pt-2 text-[10px] text-slate-500 sm:pt-3 sm:text-xs">
          <span className={cn('min-w-0 truncate', trendUp && 'text-brand')}>{trend}</span>
          <RightOutlined className="shrink-0 text-[10px]" />
        </div>
      </DashCard>
    </Link>
  )
}

function FunnelRow({ label, value, pct }: { label: string; value: number; pct: number }) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2 text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-semibold text-brand-dark">{value.toLocaleString()}</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface">
          <div className="h-full rounded-full bg-brand transition-all" style={{ width: `${Math.min(pct, 100)}%` }} />
        </div>
        <span className="w-10 text-right text-xs text-slate-500">{pct}%</span>
      </div>
    </div>
  )
}

function MiniBox({ label, value, loading }: { label: string; value: number; loading: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2">
      <div className="text-[11px] text-slate-500">{label}</div>
      {loading ? (
        <Skeleton active paragraph={false} title={{ width: 32 }} className="mt-1" />
      ) : (
        <div className="text-lg font-semibold text-brand-dark">{value}</div>
      )}
    </div>
  )
}

function AreaChart({ current, previous }: { current: number[]; previous: number[] }) {
  const width = 600
  const height = 200
  const pad = { top: 10, right: 10, bottom: 24, left: 10 }
  const innerW = width - pad.left - pad.right
  const innerH = height - pad.top - pad.bottom
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

  const max = Math.max(...current, ...previous, 1)

  const toPoints = (data: number[]) =>
    data.map((v, i) => {
      const x = pad.left + (i / (data.length - 1)) * innerW
      const y = pad.top + innerH - (v / max) * innerH
      return `${x},${y}`
    })

  const toArea = (data: number[]) => {
    const pts = toPoints(data)
    const first = pts[0]?.split(',') ?? ['0', String(pad.top + innerH)]
    const last = pts[pts.length - 1]?.split(',') ?? ['0', String(pad.top + innerH)]
    return `M${first[0]},${pad.top + innerH} L${pts.join(' L')} L${last[0]},${pad.top + innerH} Z`
  }

  const line = (data: number[]) => `M${toPoints(data).join(' L')}`

  return (
    <div className="min-w-0 overflow-hidden">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-36 w-full min-w-0 sm:h-44 md:h-48" preserveAspectRatio="none">
      <defs>
        <linearGradient id="area-brand" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={UI.brand} stopOpacity="0.35" />
          <stop offset="100%" stopColor={UI.brand} stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="area-header" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={UI.tableHeader} stopOpacity="0.25" />
          <stop offset="100%" stopColor={UI.tableHeader} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {labels.map((label, i) => {
        const x = pad.left + (i / (labels.length - 1)) * innerW
        return (
          <text key={label} x={x} y={height - 4} textAnchor="middle" className="fill-slate-400 text-[10px]">
            {label}
          </text>
        )
      })}
      <path d={toArea(previous)} fill="url(#area-header)" />
      <path d={line(previous)} fill="none" stroke={UI.tableHeader} strokeWidth="2" />
      <path d={toArea(current)} fill="url(#area-brand)" />
      <path d={line(current)} fill="none" stroke={UI.brand} strokeWidth="2.5" />
    </svg>
    </div>
  )
}
