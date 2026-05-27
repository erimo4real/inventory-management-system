import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 15000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

api.interceptors.request.use(
  (config) => {
    const siteId = Cookies.get('site_id')
    if (siteId) {
      config.headers['x-site-id'] = siteId
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthRequest = error.config?.url?.includes('/auth/login') ||
                          error.config?.url?.includes('/auth/register')

    if (error.response?.status === 401 && !isAuthRequest) {
      const isProduction = window.location.protocol === 'https:'
      const opts = { sameSite: 'Strict', secure: isProduction }
      Cookies.remove('auth_status', opts)
      Cookies.remove('user_role', opts)
      Cookies.remove('site_id', opts)
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email })
}

export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
}

export const auditAPI = {
  getLogs: (params) => api.get('/audit/logs', { params }),
  getStats: (params) => api.get('/audit/logs/stats', { params }),
  getByEntity: (entityType, entityId) => api.get(`/audit/entity/${entityType}/${entityId}`)
}

export default api
