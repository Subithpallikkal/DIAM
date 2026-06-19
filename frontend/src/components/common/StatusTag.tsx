import type { EngagementStatus } from '../../types/engagement'
import { statusPillBase } from '../../lib/ui'
import { cn } from '../../utils/cn'

const engagementStatusConfig: Record<
  EngagementStatus,
  { className: string; label: string }
> = {
  DRAFT: { className: 'bg-slate-400', label: 'Draft' },
  IN_PROGRESS: { className: 'bg-[#1abc9c]', label: 'In Progress' },
  COMPLETED: { className: 'bg-[#0d9f6e]', label: 'Completed' },
}

function StatusPill({ className, label }: { className: string; label: string }) {
  return <span className={cn(statusPillBase, className)}>{label}</span>
}

export function EngagementStatusTag({ status }: { status: EngagementStatus | string }) {
  const config = engagementStatusConfig[status as EngagementStatus] ?? {
    className: 'bg-slate-400',
    label: status,
  }
  return <StatusPill className={config.className} label={config.label} />
}

export function ClientStatusTag({ isActive }: { isActive: boolean }) {
  return (
    <StatusPill
      className={isActive ? 'bg-[#0d9f6e]' : 'bg-[#d64545]'}
      label={isActive ? 'Active' : 'Inactive'}
    />
  )
}

const priorityConfig: Record<string, string> = {
  HIGH: 'bg-[#d64545]',
  MEDIUM: 'bg-[#e8a317]',
  LOW: 'bg-[#1abc9c]',
}

export function PriorityTag({ value }: { value: string }) {
  return (
    <StatusPill className={priorityConfig[value] ?? 'bg-slate-400'} label={value} />
  )
}

const taskStatusConfig: Record<string, string> = {
  PENDING: 'bg-[#e8a317]',
  IN_PROGRESS: 'bg-[#1abc9c]',
  COMPLETED: 'bg-[#0d9f6e]',
}

export function TaskStatusTag({ status }: { status: string }) {
  return (
    <StatusPill
      className={taskStatusConfig[status] ?? 'bg-slate-400'}
      label={status.replace('_', ' ')}
    />
  )
}

const issueStatusConfig: Record<string, string> = {
  OPEN: 'bg-[#d64545]',
  IN_PROGRESS: 'bg-[#1abc9c]',
  RESOLVED: 'bg-[#0d9f6e]',
  CLOSED: 'bg-slate-400',
}

export function IssueStatusTag({ status }: { status: string }) {
  return (
    <StatusPill
      className={issueStatusConfig[status] ?? 'bg-slate-400'}
      label={status.replace('_', ' ')}
    />
  )
}

const roleConfig: Record<string, string> = {
  ADMIN: 'bg-[#34495e]',
  MANAGER: 'bg-[#1abc9c]',
  AUDITOR: 'bg-[#5d6d7e]',
}

export function RoleTag({ role }: { role: string }) {
  return (
    <StatusPill
      className={roleConfig[role] ?? 'bg-slate-400'}
      label={role.charAt(0) + role.slice(1).toLowerCase()}
    />
  )
}
