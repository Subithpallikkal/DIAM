import { api } from './axios'
import type { ListQueryParams, PaginatedResponse } from '../types/api'
import type { UserListItem } from '../types/user'

export async function fetchUsers(
  params?: ListQueryParams,
): Promise<PaginatedResponse<UserListItem>> {
  const { data } = await api.get<PaginatedResponse<UserListItem>>('/users', { params })
  return data
}
