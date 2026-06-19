import type { RoleName } from '../types/auth'

export const ROLE_LABELS: Record<RoleName, string> = {
  ADMIN: 'Admin',
  MANAGER: 'Manager',
  AUDITOR: 'Auditor',
}

export function hasRole(role: RoleName | undefined, allowed: RoleName[]): boolean {
  return !!role && allowed.includes(role)
}

export function isAdmin(role: RoleName | undefined): boolean {
  return role === 'ADMIN'
}

export function canManageUsers(role: RoleName | undefined): boolean {
  return hasRole(role, ['ADMIN', 'MANAGER'])
}

export function canCreateUsers(role: RoleName | undefined): boolean {
  return role === 'ADMIN'
}
