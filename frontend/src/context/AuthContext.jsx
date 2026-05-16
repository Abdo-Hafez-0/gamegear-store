import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authApi } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('gg_token'))
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('gg_user') || 'null') } catch { return null }
  })
  const [loading, setLoading] = useState(false)

  const persist = (t, u) => {
    if (t) localStorage.setItem('gg_token', t); else localStorage.removeItem('gg_token')
    if (u) localStorage.setItem('gg_user', JSON.stringify(u)); else localStorage.removeItem('gg_user')
    setToken(t); setUser(u)
  }

  const login = async (credentials) => {
    const res = await authApi.login(credentials)
    persist(res.token, res.user)
    return res.user
  }
  const register = async (data) => {
    const res = await authApi.register(data)
    persist(res.token, res.user)
    return res.user
  }
  const logout = useCallback(() => persist(null, null), [])

  const refreshProfile = useCallback(async () => {
    if (!token) return
    try {
      setLoading(true)
      const res = await authApi.profile()
      setUser(res.user)
      localStorage.setItem('gg_user', JSON.stringify(res.user))
    } catch (e) {
      if (e.status === 401) logout()
    } finally { setLoading(false) }
  }, [token, logout])

  useEffect(() => { if (token && !user) refreshProfile() }, [token, user, refreshProfile])

  return (
    <AuthContext.Provider value={{ token, user, loading, login, register, logout, refreshProfile, isAuthed: !!token, isAdmin: user?.role === 'admin' }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
