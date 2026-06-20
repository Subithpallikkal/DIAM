import type { RoleName } from '../types/auth'

export const ROLE_LABELS: Record<RoleName, string> = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  AUDITOR: 'Auditor',
}

export function canManageUsers(role: RoleName | undefined): boolean {
  return !!role && ['ADMIN', 'MANAGER'].includes(role)
}

export function canCreateUsers(role: RoleName | undefined): boolean {
  return role === 'ADMIN'
}
