import { api } from './axios'
import type { ListQueryParams, PaginatedResponse } from '../types/api'
import type {
  CreateFindingPayload,
  Finding,
  IssueDetail,
  IssueListItem,
  UpsertIssuePayload,
} from '../types/issue'
import type { IssueStatus, Priority } from '../types/document'

export async function fetchIssues(
  params?: ListQueryParams & {
    engagementId?: number
  },
): Promise<PaginatedResponse<IssueListItem>> {
  const { data } = await api.get<PaginatedResponse<IssueListItem>>('/issues', { params })
  return data
}

export async function fetchIssue(issueId: number): Promise<IssueDetail> {
  const { data } = await api.get<IssueDetail>(`/issues/${issueId}`)
  return data
}

export async function upsertIssue(
  engagementId: number,
  payload: UpsertIssuePayload,
): Promise<IssueDetail | IssueListItem> {
  const { data } = await api.post<IssueDetail | IssueListItem>(
    `/engagements/${engagementId}/issues`,
    payload,
  )
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

export const ISSUE_STATUS_OPTIONS: IssueStatus[] = [
  'OPEN',
  'IN_PROGRESS',
  'RESOLVED',
  'CLOSED',
]

export const SEVERITY_OPTIONS: Priority[] = ['HIGH', 'MEDIUM', 'LOW']
