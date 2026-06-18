import { Tag } from 'antd'
import type { EngagementStatus } from '../../types/engagement'

const engagementStatusConfig: Record<
  EngagementStatus,
  { color: string; label: string }
> = {
  DRAFT: { color: 'default', label: 'Draft' },
  IN_PROGRESS: { color: 'processing', label: 'In Progress' },
  COMPLETED: { color: 'success', label: 'Completed' },
}

export function EngagementStatusTag({ status }: { status: EngagementStatus | string }) {
  const config = engagementStatusConfig[status as EngagementStatus] ?? {
    color: 'default',
    label: status,
  }
  return <Tag color={config.color}>{config.label}</Tag>
}

export function ClientStatusTag({ isActive }: { isActive: boolean }) {
  return (
    <Tag color={isActive ? 'success' : 'error'}>{isActive ? 'Active' : 'Inactive'}</Tag>
  )
}

const priorityColors: Record<string, string> = {
  HIGH: 'red',
  MEDIUM: 'orange',
  LOW: 'blue',
}

export function PriorityTag({ value }: { value: string }) {
  return <Tag color={priorityColors[value] ?? 'default'}>{value}</Tag>
}

const taskStatusColors: Record<string, string> = {
  PENDING: 'default',
  IN_PROGRESS: 'processing',
  COMPLETED: 'success',
}

export function TaskStatusTag({ status }: { status: string }) {
  return <Tag color={taskStatusColors[status] ?? 'default'}>{status.replace('_', ' ')}</Tag>
}

const issueStatusColors: Record<string, string> = {
  OPEN: 'red',
  IN_PROGRESS: 'processing',
  RESOLVED: 'success',
  CLOSED: 'default',
}

export function IssueStatusTag({ status }: { status: string }) {
  return <Tag color={issueStatusColors[status] ?? 'default'}>{status.replace('_', ' ')}</Tag>
}
