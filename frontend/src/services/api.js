import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - add auth token and site_id from cookie
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    const siteId = Cookies.get('site_id')
    if (siteId) {
      config.headers['x-site-id'] = siteId
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('token')
      Cookies.remove('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
  changePassword: (oldPassword, newPassword) => 
    api.post('/auth/change-password', { oldPassword, newPassword }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword })
}

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`),
  getCategories: () => api.get('/products/categories'),
  getLowStock: () => api.get('/products/low-stock')
}

// Inventory API
export const inventoryAPI = {
  stockIn: (data) => api.post('/inventory/in', data),
  stockOut: (data) => api.post('/inventory/out', data),
  adjust: (productId, data) => api.post(`/inventory/adjust/${productId}`, data),
  getHistory: (productId, params) => api.get(`/inventory/history/${productId}`, { params }),
  getRecent: (params) => api.get('/inventory/history', { params }),
  getStats: () => api.get('/inventory/stats')
}

// Suppliers API
export const suppliersAPI = {
  getAll: () => api.get('/suppliers'),
  getById: (id) => api.get(`/suppliers/${id}`),
  create: (data) => api.post('/suppliers', data),
  update: (id, data) => api.put(`/suppliers/${id}`, data),
  delete: (id) => api.delete(`/suppliers/${id}`)
}

// Clients API
export const clientsAPI = {
  getAll: (params) => api.get('/clients', { params }),
  getById: (id) => api.get(`/clients/${id}`),
  getStats: () => api.get('/clients/stats'),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`)
}

// Vendors API
export const vendorsAPI = {
  getAll: (params) => api.get('/vendors', { params }),
  getById: (id) => api.get(`/vendors/${id}`),
  getStats: () => api.get('/vendors/stats'),
  getCategories: () => api.get('/vendors/categories'),
  create: (data) => api.post('/vendors', data),
  update: (id, data) => api.put(`/vendors/${id}`, data),
  delete: (id) => api.delete(`/vendors/${id}`)
}

// Sites API
export const sitesAPI = {
  getAll: () => api.get('/sites'),
  getMySites: () => api.get('/sites/my'),
  getById: (id) => api.get(`/sites/${id}`),
  create: (data) => api.post('/sites', data),
  update: (id, data) => api.put(`/sites/${id}`, data),
  delete: (id) => api.delete(`/sites/${id}`),
  getSiteUsers: (id) => api.get(`/sites/${id}/users`),
  addUserToSite: (data) => api.post('/sites/add-user', data),
  removeUserFromSite: (data) => api.post('/sites/remove-user', data)
}

// Audit Logs API
export const auditAPI = {
  getLogs: (params) => api.get('/audit/logs', { params }),
  getStats: (params) => api.get('/audit/logs/stats', { params }),
  getEntityHistory: (entityType, entityId) => api.get(`/audit/entity/${entityType}/${entityId}`)
}

// Users API (Admin)
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
}

// Reports API
export const reportsAPI = {
  getDaily: (params) => api.get('/reports/daily', { params }),
  getProducts: (params) => api.get('/reports/products', { params }),
  getInventory: () => api.get('/reports/inventory'),
  getTransactions: (params) => api.get('/reports/transactions', { params }),
  getClients: () => api.get('/reports/clients'),
  getVendors: () => api.get('/reports/vendors'),
  getUsers: (params) => api.get('/reports/users', { params }),
  getTrends: (params) => api.get('/reports/trends', { params }),
  getComplete: (params) => api.get('/reports/complete', { params }),
  exportReport: (params) => api.get('/reports/export', { params, responseType: 'blob' })
}

// Upload API
export const uploadAPI = {
  uploadImage: (file, folder = 'inventory') => {
    const formData = new FormData()
    formData.append('image', file)
    formData.append('folder', folder)
    return api.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  uploadImages: (files, folder = 'inventory') => {
    const formData = new FormData()
    files.forEach(file => formData.append('images', file))
    formData.append('folder', folder)
    return api.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  deleteImage: (publicId) => api.delete('/upload/image', { data: { public_id: publicId } })
}

export default api
