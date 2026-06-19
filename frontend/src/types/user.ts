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

export interface CreateUserPayload {
  name: string
  email: string
  password: string
  role: RoleName
}

export interface UpdateUserPayload {
  name?: string
  email?: string
  password?: string
  role?: RoleName
  isActive?: boolean
}
