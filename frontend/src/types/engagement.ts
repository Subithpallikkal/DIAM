export type EngagementStatus = 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED'

export interface EngagementListItem {
  id: number
  clientId: number
  clientName: string
  title: string
  auditType: string
  financialYear: string | null
  status: EngagementStatus
  startDate: string | null
  endDate: string | null
  createdAt: string
}

export interface EngagementDetail extends EngagementListItem {
  description: string | null
  updatedAt: string
}

export interface CreateEngagementPayload {
  clientId: number
  title: string
  auditType: string
  financialYear?: string
  startDate?: string
  endDate?: string
  status?: EngagementStatus
  description?: string
}

export interface UpdateEngagementPayload {
  clientId?: number
  title?: string
  auditType?: string
  financialYear?: string
  startDate?: string
  endDate?: string
  status?: EngagementStatus
  description?: string
}

export interface ScopeItem {
  id: number
  name: string
  description: string | null
  isActive: boolean
}

export interface CreateScopePayload {
  name: string
  description?: string
}

export interface RequiredDocument {
  id: number
  documentName: string
  isRequired: boolean
  isReceived: boolean
}

export interface CreateRequiredDocumentPayload {
  documentName: string
  isRequired?: boolean
}
