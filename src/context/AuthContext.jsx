import { createContext, useState, useEffect } from 'react'
import { API_URL } from '../config/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('admin_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      verifyToken()
    } else {
      setLoading(false)
    }
  }, [])

  const verifyToken = async () => {
    try {
      const res = await fetch(`${API_URL}/verify`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        setAdmin(data.admin)
      } else {
        logout()
      }
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, password) => {
    const res = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.message || 'Login gagal')
    }

    setToken(data.token)
    setAdmin(data.admin)
    localStorage.setItem('admin_token', data.token)
    return data
  }

  const logout = () => {
    setToken(null)
    setAdmin(null)
    localStorage.removeItem('admin_token')
  }

  return (
    <AuthContext.Provider
      value={{ admin, token, loading, login, logout, isAuthenticated: !!admin }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
