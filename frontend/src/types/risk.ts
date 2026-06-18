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

export interface CreateRiskPayload {
  title: string
  description?: string
  priority?: Priority
  status?: RiskStatus
}

export interface CreateChecklistPayload {
  title: string
  sortOrder?: number
}
