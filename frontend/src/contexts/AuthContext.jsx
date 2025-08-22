import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext({})

// const cors = require('cors');
// app.use(cors());

// frontend m cors nhi hota! 



// Configure axios defaults
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'
axios.defaults.baseURL = API_BASE_URL

// Debug log the API URL
console.log('API Base URL configured:', API_BASE_URL)

// Add token to requests if available
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle token expiration
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          setLoading(false)
          return
        }

        // Verify token with backend
        const response = await axios.get('/auth/verify')
        if (response.data.success) {
          setUser(response.data.data.user)
          setIsAuthenticated(true)
        } else {
          localStorage.removeItem('token')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async ({ email, password }) => {
    try {
      setLoading(true)
      const response = await axios.post('/auth/login', { email, password })
      
      if (response.data.success) {
        const { user, token } = response.data.data
        
        // Store token
        localStorage.setItem('token', token)
        
        // Update state
        setUser(user)
        setIsAuthenticated(true)
        
        return { success: true, user }
      } else {
        return { success: false, error: response.data.message }
      }
    } catch (error) {
      console.error('Login failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed. Please try again.' 
      }
    } finally {
      setLoading(false)
    }
  }

  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await axios.post('/auth/register', userData)
      
      if (response.data.success) {
        const { user, token } = response.data.data
        
        // Store token
        localStorage.setItem('token', token)
        
        // Update state
        setUser(user)
        setIsAuthenticated(true)
        
        return { success: true, user }
      } else {
        return { success: false, error: response.data.message }
      }
    } catch (error) {
      console.error('Registration failed:', error)
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed. Please try again.' 
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('token')
  }

  const hasPermission = (permission) => {
    if (!user?.permissions) return false
    return user.permissions.includes('all_permissions') || user.permissions.includes(permission)
  }

  const hasRole = (roles) => {
    if (!user?.roleName) return false
    const roleArray = Array.isArray(roles) ? roles : [roles]
    return roleArray.includes(user.roleName)
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    hasPermission,
    hasRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
