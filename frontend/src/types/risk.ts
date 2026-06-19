import type { Priority, RiskStatus } from './document'

export type { Priority, RiskStatus }

export interface RiskListItem {
  id: number
  engagementId: number
  title: string
  description: string | null
  priority: Priority
  status: RiskStatus
  checklistCount: number
  completedChecklistCount: number
  createdAt: string
}

export interface ChecklistItem {
  id: number
  title: string
  isCompleted: boolean
  sortOrder: number
  assigneeName: string | null
}

export interface UpsertRiskPayload {
  id?: number
  title?: string
  description?: string
  priority?: Priority
  status?: RiskStatus
}

/** @deprecated Use UpsertRiskPayload */
export type CreateRiskPayload = Omit<UpsertRiskPayload, 'id'> & { title: string }

export interface UpsertChecklistPayload {
  id?: number
  title?: string
  sortOrder?: number
  isCompleted?: boolean
}

/** @deprecated Use UpsertChecklistPayload */
export type CreateChecklistPayload = Omit<UpsertChecklistPayload, 'id' | 'isCompleted'> & {
  title: string
}
