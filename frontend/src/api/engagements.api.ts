import { api } from './axios'
import type { ListQueryParams, PaginatedResponse } from '../types/api'
import type {
  CreateEngagementPayload,
  CreateRequiredDocumentPayload,
  CreateScopePayload,
  EngagementDetail,
  EngagementListItem,
  RequiredDocument,
  ScopeItem,
  UpdateEngagementPayload,
} from '../types/engagement'

export async function fetchEngagements(
  params?: ListQueryParams,
): Promise<PaginatedResponse<EngagementListItem>> {
  const { data } = await api.get<PaginatedResponse<EngagementListItem>>('/engagements', {
    params,
  })
  return data
}

export async function fetchEngagement(id: number): Promise<EngagementDetail> {
  const { data } = await api.get<EngagementDetail>(`/engagements/${id}`)
  return data
}

export async function createEngagement(
  payload: CreateEngagementPayload,
): Promise<EngagementDetail> {
  const { data } = await api.post<EngagementDetail>('/engagements', payload)
  return data
}

export async function updateEngagement(
  id: number,
  payload: UpdateEngagementPayload,
): Promise<EngagementDetail> {
  const { data } = await api.patch<EngagementDetail>(`/engagements/${id}`, payload)
  return data
}

export async function fetchScopes(engagementId: number): Promise<ScopeItem[]> {
  const { data } = await api.get<ScopeItem[]>(`/engagements/${engagementId}/scopes`)
  return data
}

export async function createScope(
  engagementId: number,
  payload: CreateScopePayload,
): Promise<ScopeItem> {
  const { data } = await api.post<ScopeItem>(
    `/engagements/${engagementId}/scopes`,
    payload,
  )
  return data
}

export async function deleteScope(engagementId: number, scopeId: number): Promise<void> {
  await api.delete(`/engagements/${engagementId}/scopes/${scopeId}`)
}

export async function fetchRequiredDocuments(
  engagementId: number,
): Promise<RequiredDocument[]> {
  const { data } = await api.get<RequiredDocument[]>(
    `/engagements/${engagementId}/required-documents`,
  )
  return data
}

export async function createRequiredDocument(
  engagementId: number,
  payload: CreateRequiredDocumentPayload,
): Promise<RequiredDocument> {
  const { data } = await api.post<RequiredDocument>(
    `/engagements/${engagementId}/required-documents`,
    payload,
  )
  return data
}

export async function updateRequiredDocument(
  engagementId: number,
  docId: number,
  payload: { isReceived?: boolean; isRequired?: boolean },
): Promise<RequiredDocument> {
  const { data } = await api.patch<RequiredDocument>(
    `/engagements/${engagementId}/required-documents/${docId}`,
    payload,
  )
  return data
}
