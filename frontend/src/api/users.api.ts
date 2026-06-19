import { api } from './axios'
import type { ListQueryParams, PaginatedResponse } from '../types/api'
import type { UpsertUserPayload, UserDetail, UserListItem } from '../types/user'

export const ROLE_OPTIONS = [
  { label: 'Admin', value: 'ADMIN' as const },
  { label: 'Manager', value: 'MANAGER' as const },
  { label: 'Auditor', value: 'AUDITOR' as const },
]

export async function fetchUsers(
  params?: ListQueryParams,
): Promise<PaginatedResponse<UserListItem>> {
  const { data } = await api.get<PaginatedResponse<UserListItem>>('/users', { params })
  return data
}

export async function fetchUser(id: number): Promise<UserDetail> {
  const { data } = await api.get<UserDetail>(`/users/${id}`)
  return data
}

export async function upsertUser(payload: UpsertUserPayload): Promise<UserDetail> {
  const { data } = await api.post<UserDetail>('/users', payload)
  return data
}

export async function deactivateUser(id: number): Promise<UserDetail> {
  const { data } = await api.delete<UserDetail>(`/users/${id}`)
  return data
}
