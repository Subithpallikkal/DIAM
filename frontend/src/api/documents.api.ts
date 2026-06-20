import { api, getStoredToken } from './axios'
import type { ListQueryParams, PaginatedResponse } from '../types/api'
import type {
  DocumentCategory,
  DocumentListItem,
  DocumentLog,
  UploadDocumentPayload,
  UploadDocumentVersionPayload,
} from '../types/document'

export async function fetchDocumentCategories(): Promise<DocumentCategory[]> {
  const { data } = await api.get<DocumentCategory[]>('/documents/categories')
  return data
}

export async function fetchDocuments(
  params?: ListQueryParams & {
    clientId?: number
    engagementId?: number
    categoryId?: number
  },
): Promise<PaginatedResponse<DocumentListItem>> {
  const { data } = await api.get<PaginatedResponse<DocumentListItem>>('/documents', { params })
  return data
}

export async function uploadDocument(payload: UploadDocumentPayload): Promise<DocumentListItem> {
  const formData = new FormData()
  formData.append('file', payload.file)
  formData.append('clientId', String(payload.clientId))
  if (payload.engagementId) formData.append('engagementId', String(payload.engagementId))
  if (payload.categoryId) formData.append('categoryId', String(payload.categoryId))

  const { data } = await api.post<DocumentListItem>('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

export async function uploadDocumentVersion(
  documentId: number,
  payload: UploadDocumentVersionPayload,
): Promise<DocumentListItem> {
  const formData = new FormData()
  formData.append('file', payload.file)

  const { data } = await api.post<DocumentListItem>(
    `/documents/${documentId}/versions/upload`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  )
  return data
}

export async function fetchDocumentVersions(documentId: number): Promise<DocumentListItem[]> {
  const { data } = await api.get<DocumentListItem[]>(`/documents/${documentId}/versions`)
  return data
}

export async function fetchDocumentLogs(documentId: number): Promise<DocumentLog[]> {
  const { data } = await api.get<DocumentLog[]>(`/documents/${documentId}/logs`)
  return data
}

export async function deleteDocument(documentId: number): Promise<void> {
  await api.delete(`/documents/${documentId}`)
}

export function getDocumentDownloadUrl(documentId: number): string {
  const base = import.meta.env.VITE_API_URL || '/api'
  const token = getStoredToken()
  return `${base}/documents/${documentId}/download${token ? `?token=${token}` : ''}`
}

export async function downloadDocument(documentId: number, fileName: string): Promise<void> {
  const response = await api.get(`/documents/${documentId}/download`, {
    responseType: 'blob',
  })
  const url = window.URL.createObjectURL(new Blob([response.data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
}

export interface DocumentPreview {
  documentId: number
  url: string
  mimeType: string
  fileName: string
}

export async function fetchDocumentPreview(
  documentId: number,
  fileName?: string,
): Promise<DocumentPreview> {
  const response = await api.get(`/documents/${documentId}/view`, {
    responseType: 'blob',
  })
  const mimeType =
    (response.headers['content-type'] as string | undefined)?.split(';')[0]?.trim() ||
    'application/octet-stream'
  const contentDisposition = response.headers['content-disposition'] as string | undefined
  const fileNameMatch = contentDisposition?.match(/filename="?([^"]+)"?/i)

  return {
    documentId,
    url: window.URL.createObjectURL(new Blob([response.data], { type: mimeType })),
    mimeType,
    fileName: fileName ?? fileNameMatch?.[1] ?? 'document',
  }
}
