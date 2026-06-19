import type { RoleName } from './auth'

export interface UserListItem {
  id: number
  name: string
  email: string
  role: RoleName
  isActive: boolean
  createdAt: string
}

export interface UserDetail extends UserListItem {
  updatedAt: string
}

export interface UpsertUserPayload {
  id?: number
  name?: string
  email?: string
  password?: string
  role?: RoleName
  isActive?: boolean
}

/** @deprecated Use UpsertUserPayload */
export type CreateUserPayload = Omit<UpsertUserPayload, 'id' | 'isActive'> & {
  name: string
  email: string
  password: string
  role: RoleName
}

/** @deprecated Use UpsertUserPayload */
export type UpdateUserPayload = Omit<UpsertUserPayload, 'id'>
