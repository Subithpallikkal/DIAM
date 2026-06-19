import type { IssueStatus, Priority } from './document'

export type { IssueStatus, Priority }

export interface IssueListItem {
  id: number
  engagementId: number
  engagementTitle: string
  title: string
  severity: Priority
  status: IssueStatus
  responsiblePerson: string | null
  findingsCount: number
  createdAt: string
}

export interface Finding {
  id: number
  title: string
  description: string | null
  severity: Priority
  createdByName: string
  createdAt: string
}

export interface IssueStatusLog {
  id: number
  oldStatus: string
  newStatus: string
  changedByName: string
  createdAt: string
}

export interface IssueDetail extends IssueListItem {
  description: string | null
  assigneeName: string | null
  findings: Finding[]
  statusLogs: IssueStatusLog[]
  updatedAt: string
}

export interface UpsertIssuePayload {
  id?: number
  title?: string
  description?: string
  severity?: Priority
  status?: IssueStatus
  responsiblePerson?: string
}

/** @deprecated Use UpsertIssuePayload */
export type CreateIssuePayload = Omit<UpsertIssuePayload, 'id' | 'status'> & { title: string }

/** @deprecated Use UpsertIssuePayload */
export type UpdateIssuePayload = Omit<UpsertIssuePayload, 'id'>

export interface CreateFindingPayload {
  title: string
  description?: string
  severity?: Priority
}
