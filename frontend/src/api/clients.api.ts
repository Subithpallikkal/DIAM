import { api } from './axios'
import type { ListQueryParams, PaginatedResponse } from '../types/api'
import type {
  ClientDetail,
  ClientListItem,
  CreateClientPayload,
  UpdateClientPayload,
} from '../types/client'

export async function fetchClients(
  params?: ListQueryParams,
): Promise<PaginatedResponse<ClientListItem>> {
  const { data } = await api.get<PaginatedResponse<ClientListItem>>('/clients', { params })
  return data
}

export async function fetchClient(id: number): Promise<ClientDetail> {
  const { data } = await api.get<ClientDetail>(`/clients/${id}`)
  return data
}

export async function createClient(payload: CreateClientPayload): Promise<ClientDetail> {
  const { data } = await api.post<ClientDetail>('/clients', payload)
  return data
}

export async function updateClient(
  id: number,
  payload: UpdateClientPayload,
): Promise<ClientDetail> {
  const { data } = await api.patch<ClientDetail>(`/clients/${id}`, payload)
  return data
}

export async function deactivateClient(id: number): Promise<ClientDetail> {
  const { data } = await api.delete<ClientDetail>(`/clients/${id}`)
  return data
}
