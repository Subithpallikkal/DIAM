import { api } from './axios'
import type { AuthUser, LoginResponse } from '../types/auth'

export interface LoginPayload {
  email: string
  password: string
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', payload)
  return data
}

export async function getMe(): Promise<AuthUser> {
  const { data } = await api.get<AuthUser>('/auth/me')
  return data
}
