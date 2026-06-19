export type Priority = 'HIGH' | 'MEDIUM' | 'LOW'
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
export type IssueStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED'
export type RiskStatus = 'OPEN' | 'MITIGATED' | 'CLOSED'

export interface DocumentCategory {
  id: number
  name: string
  description: string | null
  createdAt: string
}

export interface DocumentListItem {
  id: number
  clientId: number
  clientName: string
  engagementId: number | null
  engagementTitle: string | null
  categoryId: number | null
  categoryName: string | null
  originalName: string
  mimeType: string
  fileSize: number
  uploadedByName: string
  version: number
  parentDocumentId: number | null
  rootDocumentId: number
  versionCount: number
  createdAt: string
}

export interface DocumentLog {
  id: number
  action: string
  performedByName: string
  details: string | null
  createdAt: string
}

export interface UploadDocumentPayload {
  file: File
  clientId: number
  engagementId?: number
  categoryId?: number
}

export interface UploadDocumentVersionPayload {
  file: File
}
