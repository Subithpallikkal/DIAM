import type { RoleName } from './auth'

export interface UserListItem {
  uid: number
  name: string
  email: string
  role: RoleName
  isActive: boolean
  createdAt: string
}
