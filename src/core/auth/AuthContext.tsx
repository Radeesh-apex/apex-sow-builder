import React, { createContext, useCallback, useContext, useMemo, useState } from 'react'

export interface AuthUser {
  name: string
  email: string
  initials: string
}

interface AuthContextValue {
  isAuthenticated: boolean
  user: AuthUser | null
  login: (email: string, name: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  user: null,
  login: () => undefined,
  logout: () => undefined,
})

function makeInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('')
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const raw = sessionStorage.getItem('apex-user')
      return raw ? (JSON.parse(raw) as AuthUser) : null
    } catch {
      return null
    }
  })

  const login = useCallback((email: string, name: string) => {
    const newUser: AuthUser = { email, name, initials: makeInitials(name || email) }
    sessionStorage.setItem('apex-user', JSON.stringify(newUser))
    setUser(newUser)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem('apex-user')
    setUser(null)
  }, [])

  const ctx = useMemo<AuthContextValue>(
    () => ({ isAuthenticated: user !== null, user, login, logout }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  return useContext(AuthContext)
}
