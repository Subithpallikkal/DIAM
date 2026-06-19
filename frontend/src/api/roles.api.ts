import { api } from './axios'
import type { RoleDefinition } from '../types/role'
import type { PermissionGrid, UpdatePermissionGridPayload } from '../types/permission'
import type { RoleName } from '../types/auth'

export async function fetchRoles(): Promise<RoleDefinition[]> {
  const { data } = await api.get<RoleDefinition[]>('/roles')
  return data
}

export async function fetchRolePermissionGrid(role: RoleName): Promise<PermissionGrid> {
  const { data } = await api.get<PermissionGrid>(`/roles/${role}/permissions`)
  return data
}

export async function updateRolePermissionGrid(
  role: RoleName,
  payload: UpdatePermissionGridPayload,
): Promise<PermissionGrid> {
  const { data } = await api.patch<PermissionGrid>(`/roles/${role}/permissions`, payload)
  return data
}
