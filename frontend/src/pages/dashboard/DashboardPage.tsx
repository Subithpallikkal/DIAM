import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Empty, Skeleton } from 'antd'
import {
  AuditOutlined,
  BarChartOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  RightOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  WarningOutlined,
} from '@ant-design/icons'
import { fetchDashboardStats } from '../../api/reports.api'
import { PageBody, PageContainer } from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import { useIsMobile } from '../../hooks/useResponsive'
import { cn } from '../../utils/cn'

type StatTone = 'indigo' | 'sky' | 'emerald' | 'amber' | 'violet' | 'rose'

interface StatItem {
  key: string
  title: string
  shortTitle: string
  icon: ReactNode
  tone: StatTone
  link: string
  getValue: (stats: DashboardStatsState) => number
}

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

const TONE_STYLES: Record<StatTone, { tile: string; icon: string }> = {
  indigo: { tile: 'border-indigo-100 bg-indigo-50/60', icon: 'bg-indigo-100 text-indigo-600' },
  sky: { tile: 'border-sky-100 bg-sky-50/60', icon: 'bg-sky-100 text-sky-600' },
  emerald: { tile: 'border-emerald-100 bg-emerald-50/60', icon: 'bg-emerald-100 text-emerald-600' },
  amber: { tile: 'border-amber-100 bg-amber-50/60', icon: 'bg-amber-100 text-amber-600' },
  violet: { tile: 'border-violet-100 bg-violet-50/60', icon: 'bg-violet-100 text-violet-600' },
  rose: { tile: 'border-rose-100 bg-rose-50/60', icon: 'bg-rose-100 text-rose-600' },
}

const STAT_ITEMS: StatItem[] = [
  {
    key: 'clients',
    title: 'Total Clients',
    shortTitle: 'Clients',
    icon: <TeamOutlined />,
    tone: 'indigo',
    link: '/clients',
    getValue: (stats) => stats.totalClients,
  },
  {
    key: 'audits',
    title: 'Total Audits',
    shortTitle: 'Audits',
    icon: <AuditOutlined />,
    tone: 'sky',
    link: '/engagements',
    getValue: (stats) => stats.totalAudits,
  },
  {
    key: 'completed',
    title: 'Completed Audits',
    shortTitle: 'Completed',
    icon: <CheckCircleOutlined />,
    tone: 'emerald',
    link: '/engagements',
    getValue: (stats) => stats.completedAudits,
  },
  {
    key: 'risks',
    title: 'Open Risks',
    shortTitle: 'Risks',
    icon: <WarningOutlined />,
    tone: 'amber',
    link: '/risks',
    getValue: (stats) => stats.openRisks,
  },
  {
    key: 'tasks',
    title: 'Pending Tasks',
    shortTitle: 'Tasks',
    icon: <CheckCircleOutlined />,
    tone: 'violet',
    link: '/tasks',
    getValue: (stats) => stats.pendingTasks,
  },
  {
    key: 'issues',
    title: 'Open Issues',
    shortTitle: 'Issues',
    icon: <ExclamationCircleOutlined />,
    tone: 'rose',
    link: '/issues',
    getValue: (stats) => stats.openIssues,
  },
]

const QUICK_ACTIONS = [
  {
    key: 'clients',
    title: 'Add Client',
    description: 'Register a new client organization.',
    icon: TeamOutlined,
    link: '/clients',
    state: { openCreate: true },
  },
  {
    key: 'engagements',
    title: 'New Engagement',
    description: 'Start an audit engagement.',
    icon: AuditOutlined,
    link: '/engagements',
    state: { openCreate: true },
  },
  {
    key: 'reports',
    title: 'View Reports',
    description: 'Export audit and findings reports.',
    icon: BarChartOutlined,
    link: '/reports',
  },
] as const

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="m-0 mb-3 text-sm font-semibold tracking-tight text-slate-800 md:text-base">
      {children}
    </h2>
  )
}

function DashboardHero({
  firstName,
  role,
  highlights,
  loading,
}: {
  firstName: string
  role?: string
  highlights: Array<{ label: string; value: number }>
  loading: boolean
}) {
  return (
    <div className="relative shrink-0 overflow-hidden rounded-2xl bg-linear-to-br from-brand via-[#18b394] to-[#0f766e] px-4 py-5 text-white shadow-sm md:rounded-3xl md:px-6 md:py-6">
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl md:h-48 md:w-48" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <p className="m-0 text-xs font-medium uppercase tracking-[0.12em] text-white/70">
            Dashboard
          </p>
          <h1 className="m-0 mt-1 text-xl font-semibold leading-tight md:text-2xl">
            Good day, {firstName}
          </h1>
          <p className="m-0 mt-1 max-w-xl text-sm text-white/80">
            Track clients, engagements, risks, and team workload in one place.
          </p>
          {role && (
            <span className="mt-3 inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white/90">
              {role}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-2 md:min-w-[320px] md:grid-cols-3 md:gap-3">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="rounded-xl bg-white/15 px-2 py-2.5 text-center backdrop-blur-sm md:px-3"
            >
              {loading ? (
                <Skeleton active paragraph={false} title={{ width: 24 }} className="mx-auto [&_.ant-skeleton-title]:bg-white/20!" />
              ) : (
                <>
                  <p className="m-0 text-lg font-bold leading-none md:text-xl">{item.value}</p>
                  <p className="m-0 mt-1 text-[10px] leading-tight text-white/75 md:text-[11px]">
                    {item.label}
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatTile({
  item,
  value,
  loading,
  compact = false,
}: {
  item: StatItem
  value: number
  loading: boolean
  compact?: boolean
}) {
  const styles = TONE_STYLES[item.tone]

  return (
    <Link
      to={item.link}
      className={cn(
        'group flex flex-col gap-2 rounded-2xl border p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] md:p-4',
        styles.tile,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-xl',
            compact ? 'h-9 w-9 text-base' : 'h-10 w-10 text-lg md:h-11 md:w-11',
            styles.icon,
          )}
        >
          {item.icon}
        </div>
        <RightOutlined className="mt-1 text-xs text-slate-300 transition group-hover:text-slate-500" />
      </div>
      {loading ? (
        <Skeleton active paragraph={false} title={{ width: 56 }} />
      ) : (
        <>
          <p className={cn('m-0 font-bold leading-none text-slate-900', compact ? 'text-2xl' : 'text-2xl md:text-3xl')}>
            {value}
          </p>
          <p className="m-0 text-xs font-medium text-slate-600 md:text-sm">{item.title}</p>
        </>
      )}
    </Link>
  )
}

function WorkloadPanel({
  title,
  icon,
  items,
  loading,
  emptyDescription,
  renderMeta,
}: {
  title: string
  icon: ReactNode
  items: Array<{ userId: number; userName: string }>
  loading: boolean
  emptyDescription: string
  renderMeta: (item: (typeof items)[number]) => ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm md:p-5">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="m-0 text-sm font-semibold text-slate-800 md:text-base">{title}</h3>
        <span className="text-brand">{icon}</span>
      </div>
      {loading ? (
        <Skeleton active paragraph={{ rows: 3 }} />
      ) : items.length === 0 ? (
        <Empty description={emptyDescription} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <ul className="m-0 flex list-none flex-col divide-y divide-slate-100 p-0">
          {items.map((item) => (
            <li
              key={item.userId}
              className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
            >
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-slate-800">
                {item.userName}
              </span>
              <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {renderMeta(item)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function QuickActionCard({
  title,
  description,
  icon: Icon,
  link,
  state,
}: {
  title: string
  description: string
  icon: (typeof QUICK_ACTIONS)[number]['icon']
  link: string
  state?: { openCreate: boolean }
}) {
  return (
    <Link
      to={link}
      state={state}
      className="group flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm transition hover:border-brand/30 hover:shadow-md active:bg-slate-50 md:flex-col md:items-start md:p-4"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand/10 text-brand transition group-hover:bg-brand group-hover:text-white md:h-12 md:w-12">
        <Icon className="text-xl" />
      </div>
      <div className="min-w-0 flex-1 md:w-full">
        <p className="m-0 text-sm font-semibold text-slate-900 md:text-base">{title}</p>
        <p className="m-0 mt-0.5 text-xs text-slate-500 md:text-sm">{description}</p>
      </div>
      <RightOutlined className="shrink-0 text-xs text-slate-300 transition group-hover:text-brand md:hidden" />
    </Link>
  )
}

export function DashboardPage() {
  const { user } = useAuth()
  const isMobile = useIsMobile('md')
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

  const heroHighlights = useMemo(
    () => [
      { label: 'Open issues', value: stats.openIssues },
      { label: 'Pending tasks', value: stats.pendingTasks },
      { label: 'Resolved', value: stats.resolvedIssues },
    ],
    [stats.openIssues, stats.pendingTasks, stats.resolvedIssues],
  )

  return (
    <PageContainer className="gap-3 md:gap-4">
      <DashboardHero
        firstName={firstName}
        role={user?.role}
        highlights={heroHighlights}
        loading={loading}
      />

      <PageBody variant="fill" className="gap-4 overflow-y-auto pb-2 md:gap-6">
        <section>
          <SectionTitle>Overview</SectionTitle>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 md:gap-3 xl:grid-cols-6">
            {STAT_ITEMS.map((item) => (
              <StatTile
                key={item.key}
                item={item}
                value={item.getValue(stats)}
                loading={loading}
                compact={isMobile}
              />
            ))}
          </div>
        </section>

        {canManage && (
          <section>
            <SectionTitle>Team workload</SectionTitle>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4">
              <WorkloadPanel
                title="Tasks by assignee"
                icon={<UnorderedListOutlined />}
                items={workload.tasksByAssignee}
                loading={loading}
                emptyDescription="No active task assignments"
                renderMeta={(item) => {
                  const row = item as (typeof workload.tasksByAssignee)[number]
                  return `${row.pending + row.inProgress} active`
                }}
              />
              <WorkloadPanel
                title="Open checklists"
                icon={<CheckCircleOutlined />}
                items={workload.openChecklistsByAssignee}
                loading={loading}
                emptyDescription="No open checklist assignments"
                renderMeta={(item) => {
                  const row = item as (typeof workload.openChecklistsByAssignee)[number]
                  return `${row.openCount} open`
                }}
              />
            </div>
          </section>
        )}

        <section>
          <SectionTitle>Quick actions</SectionTitle>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 md:gap-3">
            {QUICK_ACTIONS.map((action) => (
              <QuickActionCard
                key={action.key}
                title={action.title}
                description={action.description}
                icon={action.icon}
                link={action.link}
                state={'state' in action ? action.state : undefined}
              />
            ))}
          </div>
        </section>
      </PageBody>
    </PageContainer>
  )
}
