import { api } from './axios'
import type { ListQueryParams, PaginatedResponse } from '../types/api'
import type {
  CreateFindingPayload,
  CreateIssuePayload,
  Finding,
  IssueDetail,
  IssueListItem,
  UpdateIssuePayload,
} from '../types/issue'
import type { IssueStatus, Priority } from '../types/document'

export async function fetchIssues(
  params?: ListQueryParams & {
    engagementId?: number
    status?: IssueStatus
  },
): Promise<PaginatedResponse<IssueListItem>> {
  const { data } = await api.get<PaginatedResponse<IssueListItem>>('/issues', { params })
  return data
}

export async function fetchIssue(issueId: number): Promise<IssueDetail> {
  const { data } = await api.get<IssueDetail>(`/issues/${issueId}`)
  return data
}

export async function createIssue(
  engagementId: number,
  payload: CreateIssuePayload,
): Promise<IssueListItem> {
  const { data } = await api.post<IssueListItem>(
    `/engagements/${engagementId}/issues`,
    payload,
  )
  return data
}

export async function updateIssue(
  issueId: number,
  payload: UpdateIssuePayload,
): Promise<IssueDetail> {
  const { data } = await api.patch<IssueDetail>(`/issues/${issueId}`, payload)
  return data
}

export async function assignIssue(issueId: number, assignedToId: number): Promise<IssueDetail> {
  const { data } = await api.post<IssueDetail>(`/issues/${issueId}/assign`, { assignedToId })
  return data
}

export async function addFinding(
  issueId: number,
  payload: CreateFindingPayload,
): Promise<Finding> {
  const { data } = await api.post<Finding>(`/issues/${issueId}/findings`, payload)
  return data
}

export async function deleteIssue(issueId: number): Promise<void> {
  await api.delete(`/issues/${issueId}`)
}

export const ISSUE_STATUS_OPTIONS: IssueStatus[] = [
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
]

export const SEVERITY_OPTIONS: Priority[] = ['HIGH', 'MEDIUM', 'LOW']
