import axios from 'axios'
import { getSession } from 'next-auth/react'

// Crear instancia de axios con configuración base
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Cache para la sesión para evitar múltiples llamadas
let cachedSession: { accessToken?: string } | null = null
let sessionPromise: Promise<{ accessToken?: string } | null> | null = null

// Interceptor para agregar token de autenticación
apiClient.interceptors.request.use(
  async (config) => {
    // Evitar llamadas múltiples a getSession usando cache y promise
    if (!sessionPromise) {
      sessionPromise = getSession().then(session => {
        cachedSession = session
        sessionPromise = null
        return session
      })
    }
    
    const session = cachedSession || await sessionPromise
    
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`
    }
    
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar respuestas y errores
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config
    
    // Evitar bucles infinitos
    if (originalRequest._retry) {
      return Promise.reject(error)
    }
    
    // Manejar errores de autenticación
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      // Limpiar cache de sesión
      cachedSession = null
      sessionPromise = null
      
      // Intentar obtener una nueva sesión
      try {
        const newSession = await getSession()
        if (newSession?.accessToken) {
          // Actualizar cache
          cachedSession = newSession
          // Reintentar la petición original con el nuevo token
          originalRequest.headers.Authorization = `Bearer ${newSession.accessToken}`
          return apiClient(originalRequest)
        } else {
          // Si no hay sesión válida, redirigir al login
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/signin'
          }
        }
      } catch {
        if (typeof window !== 'undefined') {
          window.location.href = '/auth/signin'
        }
      }
    }

    // Manejar otros errores se hace automáticamente por el reject
    
    return Promise.reject(error)
  }
)

export default apiClient
