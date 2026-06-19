import type { RoleName } from './auth'

export interface RoleDefinition {
  id: number
  name: RoleName
  description: string
  permissions: string[]
}
