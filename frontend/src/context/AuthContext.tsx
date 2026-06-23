import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getMe, login as loginApi, type LoginPayload } from '../api/auth.api'
import {
  clearStoredToken,
  clearStoredUser,
  getStoredToken,
  getStoredUser,
  setStoredToken,
  setStoredUser,
} from '../api/axios'
import type { AuthUser } from '../types/auth'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  loading: boolean
  login: (payload: LoginPayload) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getStoredToken()
    if (!token) {
      setLoading(false)
      return
    }

    const cachedUser = getStoredUser()
    if (cachedUser) {
      setUser(cachedUser)
      setLoading(false)
    }

    getMe()
      .then((profile) => {
        setUser(profile)
        setStoredUser(profile)
      })
      .catch(() => {
        clearStoredToken()
        clearStoredUser()
        setUser(null)
      })
      .finally(() => {
        if (!cachedUser) setLoading(false)
      })
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await loginApi(payload)
    setStoredToken(response.accessToken)
    setUser(response.user)
    setStoredUser(response.user)
  }, [])

  const logout = useCallback(() => {
    clearStoredToken()
    clearStoredUser()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      loading,
      login,
      logout,
    }),
    [user, loading, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
