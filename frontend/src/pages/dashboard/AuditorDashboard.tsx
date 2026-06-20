import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Divider, Empty, Skeleton } from 'antd'
import {
  AuditOutlined,
  CheckSquareOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { fetchMyDashboardStats } from '../../api/reports.api'
import { IssueStatusTag, PageBody, PageContainer, PageHeader, PriorityTag } from '../../components/common'
import { useAuth } from '../../context/AuthContext'
import type { MyDashboardStats } from '../../types/report'

const EMPTY_STATS: MyDashboardStats = {
  pendingTasks: 0,
  inProgressTasks: 0,
  openChecklists: 0,
  openIssues: 0,
  myTasks: [],
  myChecklists: [],
  myIssues: [],
}

function MyKpi({
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
      className="group flex min-w-[110px] flex-1 flex-col gap-1 px-3 py-1 transition first:pl-0 last:pr-0 hover:opacity-80 md:px-4"
    >
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      {loading ? (
        <Skeleton active paragraph={false} title={{ width: 48 }} />
      ) : (
        <span className="text-2xl font-bold tabular-nums text-slate-900 md:text-3xl">{value}</span>
      )}
      <span className="text-[11px] font-medium text-brand opacity-0 transition group-hover:opacity-100">
        View all →
      </span>
    </Link>
  )
}

function MyWorkList({
  title,
  icon,
  emptyText,
  loading,
  children,
}: {
  title: string
  icon: ReactNode
  emptyText: string
  loading: boolean
  children: ReactNode
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3 md:px-5">
        <span className="text-brand">{icon}</span>
        <h3 className="m-0 text-sm font-semibold text-slate-800 md:text-base">{title}</h3>
      </div>
      {loading ? (
        <div className="p-4 md:p-5">
          <Skeleton active paragraph={{ rows: 3 }} />
        </div>
      ) : (
        children || (
          <Empty description={emptyText} image={Empty.PRESENTED_IMAGE_SIMPLE} className="py-8" />
        )
      )}
    </div>
  )
}

function WorkItemRow({
  title,
  meta,
  href,
  trailing,
}: {
  title: string
  meta: string
  href: string
  trailing?: ReactNode
}) {
  return (
    <Link
      to={href}
      className="flex items-start justify-between gap-3 border-b border-slate-50 px-4 py-3 transition last:border-0 hover:bg-surface md:px-5"
    >
      <div className="min-w-0">
        <p className="m-0 truncate text-sm font-medium text-brand-dark">{title}</p>
        <p className="m-0 mt-0.5 truncate text-xs text-slate-500">{meta}</p>
      </div>
      {trailing && <div className="shrink-0">{trailing}</div>}
    </Link>
  )
}

export function AuditorDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<MyDashboardStats>(EMPTY_STATS)

  const firstName = user?.name?.split(' ')[0] ?? 'there'

  useEffect(() => {
    fetchMyDashboardStats()
      .then(setStats)
      .catch(() => setStats(EMPTY_STATS))
      .finally(() => setLoading(false))
  }, [])

  const totalActive =
    stats.pendingTasks + stats.inProgressTasks + stats.openChecklists + stats.openIssues

  return (
    <PageContainer>
      <PageHeader
        title="My Dashboard"
        subtitle={`Hi ${firstName}, here is your personal work queue.`}
      />

      <PageBody variant="fill" className="gap-4 overflow-y-auto pb-2 md:gap-5">
        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="m-0 text-sm font-semibold text-slate-800 md:text-base">My workload</h2>
              <p className="m-0 mt-1 text-xs text-slate-500">
                {loading ? 'Loading…' : `${totalActive} active items assigned to you`}
              </p>
            </div>
          </div>

          <div className="flex overflow-x-auto pb-1">
            <div className="flex min-w-max flex-1 divide-x divide-slate-200">
              <MyKpi label="Pending tasks" value={stats.pendingTasks} href="/tasks" loading={loading} />
              <MyKpi
                label="In progress"
                value={stats.inProgressTasks}
                href="/tasks"
                loading={loading}
              />
              <MyKpi
                label="Open checklists"
                value={stats.openChecklists}
                href="/risks"
                loading={loading}
              />
              <MyKpi label="Open issues" value={stats.openIssues} href="/issues" loading={loading} />
            </div>
          </div>
        </section>

        <section className="grid gap-3 md:gap-4 lg:grid-cols-3">
          <MyWorkList
            title="My tasks"
            icon={<AuditOutlined />}
            emptyText="No tasks assigned to you"
            loading={loading}
          >
            {stats.myTasks.length > 0 && (
              <div>
                {stats.myTasks.map((task) => (
                  <WorkItemRow
                    key={task.id}
                    title={task.title}
                    meta={task.engagementTitle}
                    href={`/tasks/${task.id}`}
                    trailing={
                      <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-slate-600">
                        {task.status.replace('_', ' ')}
                      </span>
                    }
                  />
                ))}
              </div>
            )}
          </MyWorkList>

          <MyWorkList
            title="My checklists"
            icon={<CheckSquareOutlined />}
            emptyText="No open checklists assigned to you"
            loading={loading}
          >
            {stats.myChecklists.length > 0 && (
              <div>
                {stats.myChecklists.map((item) => (
                  <WorkItemRow
                    key={item.id}
                    title={item.title}
                    meta={`${item.riskTitle} · ${item.engagementTitle}`}
                    href={`/risks/${item.riskId}`}
                  />
                ))}
              </div>
            )}
          </MyWorkList>

          <MyWorkList
            title="My issues"
            icon={<ExclamationCircleOutlined />}
            emptyText="No open issues assigned to you"
            loading={loading}
          >
            {stats.myIssues.length > 0 && (
              <div>
                {stats.myIssues.map((issue) => (
                  <WorkItemRow
                    key={issue.id}
                    title={issue.title}
                    meta={issue.engagementTitle}
                    href={`/issues/${issue.id}`}
                    trailing={
                      <div className="flex flex-col items-end gap-1">
                        <PriorityTag value={issue.severity} />
                        <IssueStatusTag status={issue.status} />
                      </div>
                    }
                  />
                ))}
              </div>
            )}
          </MyWorkList>
        </section>

        <section className="rounded-2xl border border-brand/20 bg-brand/5 p-4 md:p-5">
          <h2 className="m-0 text-sm font-semibold text-slate-800">Quick links</h2>
          <Divider className="my-3!" />
          <nav className="flex flex-wrap gap-2">
            {[
              { label: 'All tasks', href: '/tasks' },
              { label: 'All risks', href: '/risks' },
              { label: 'All issues', href: '/issues' },
              { label: 'Documents', href: '/documents' },
              { label: 'Engagements', href: '/engagements' },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="rounded-lg border border-white/60 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-brand/30 hover:text-brand"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </section>
      </PageBody>
    </PageContainer>
  )
}
