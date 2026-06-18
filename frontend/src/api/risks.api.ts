import { api } from './axios'
import type { ListQueryParams, PaginatedResponse } from '../types/api'
import type {
  ChecklistItem,
  CreateChecklistPayload,
  CreateRiskPayload,
  RiskListItem,
} from '../types/risk'
import type { Priority, RiskStatus } from '../types/document'

export async function fetchRisks(
  params?: ListQueryParams & { engagementId?: number },
): Promise<PaginatedResponse<RiskListItem>> {
  const { data } = await api.get<PaginatedResponse<RiskListItem>>('/risks', { params })
  return data
}

export async function fetchRisk(riskId: number): Promise<RiskListItem> {
  const { data } = await api.get<RiskListItem>(`/risks/${riskId}`)
  return data
}

export async function createRisk(
  engagementId: number,
  payload: CreateRiskPayload,
): Promise<RiskListItem> {
  const { data } = await api.post<RiskListItem>(
    `/engagements/${engagementId}/risks`,
    payload,
  )
  return data
}

export async function updateRisk(
  riskId: number,
  payload: Partial<CreateRiskPayload> & { status?: RiskStatus },
): Promise<RiskListItem> {
  const { data } = await api.patch<RiskListItem>(`/risks/${riskId}`, payload)
  return data
}

export async function deleteRisk(riskId: number): Promise<void> {
  await api.delete(`/risks/${riskId}`)
}

export async function fetchChecklists(riskId: number): Promise<ChecklistItem[]> {
  const { data } = await api.get<ChecklistItem[]>(`/risks/${riskId}/checklists`)
  return data
}

export async function createChecklistItem(
  riskId: number,
  payload: CreateChecklistPayload,
): Promise<ChecklistItem> {
  const { data } = await api.post<ChecklistItem>(`/risks/${riskId}/checklists`, payload)
  return data
}

export async function updateChecklistItem(
  riskId: number,
  checklistId: number,
  payload: { title?: string; isCompleted?: boolean },
): Promise<ChecklistItem> {
  const { data } = await api.patch<ChecklistItem>(
    `/risks/${riskId}/checklists/${checklistId}`,
    payload,
  )
  return data
}

export async function assignChecklistItem(
  riskId: number,
  checklistId: number,
  assignedToId: number,
): Promise<ChecklistItem> {
  const { data } = await api.post<ChecklistItem>(
    `/risks/${riskId}/checklists/${checklistId}/assign`,
    { assignedToId },
  )
  return data
}

export const PRIORITY_OPTIONS: Priority[] = ['HIGH', 'MEDIUM', 'LOW']
export const RISK_STATUS_OPTIONS: RiskStatus[] = ['OPEN', 'MITIGATED', 'CLOSED']
