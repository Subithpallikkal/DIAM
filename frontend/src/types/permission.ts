import type { RoleName } from './auth'

export const PERMISSION_ACTIONS = [
  { key: 'create', label: 'Create' },
  { key: 'editOwn', label: 'Edit own' },
  { key: 'editAny', label: 'Edit any' },
  { key: 'deleteOwn', label: 'Delete own' },
  { key: 'deleteAny', label: 'Delete any' },
] as const

export type PermissionActionKey = (typeof PERMISSION_ACTIONS)[number]['key']

export type ResourcePermissionState = Record<PermissionActionKey, boolean>

export type PermissionGridState = Record<string, Partial<ResourcePermissionState>>

export interface PermissionResourceRow {
  key: string
  label: string
  permissions: ResourcePermissionState
}

export interface PermissionGroup {
  key: string
  label: string
  resources: PermissionResourceRow[]
}

export interface PermissionGrid {
  roleId: number
  role: RoleName
  description: string
  groups: PermissionGroup[]
}

export interface UpdatePermissionGridPayload {
  permissions: PermissionGridState
}
