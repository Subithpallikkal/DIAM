export type RoleName = 'ADMIN' | 'MANAGER' | 'AUDITOR'

export interface AuthUser {
  uid: number
  name: string
  email: string
  role: RoleName
}

export interface LoginResponse {
  accessToken: string
  user: AuthUser
}
