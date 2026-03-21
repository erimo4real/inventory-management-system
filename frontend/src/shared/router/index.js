import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/features/dashboard/views/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/features/auth/views/Login.vue')
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/features/auth/views/Register.vue')
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/features/auth/views/ForgotPassword.vue')
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/features/products/views/Products.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('@/features/inventory/views/Inventory.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/suppliers',
    name: 'Suppliers',
    component: () => import('@/features/suppliers/views/Suppliers.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/clients',
    name: 'Clients',
    component: () => import('@/features/clients/views/Clients.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/:id',
    name: 'ClientProfile',
    component: () => import('@/features/clients/views/ClientProfile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/vendors',
    name: 'Vendors',
    component: () => import('@/features/vendors/views/Vendors.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/vendors/:id',
    name: 'VendorProfile',
    component: () => import('@/features/vendors/views/VendorProfile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('@/features/categories/views/Categories.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: () => import('@/features/reports/views/Reports.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import('@/features/users/views/Users.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/sites',
    name: 'Sites',
    component: () => import('@/features/sites/views/Sites.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/audit',
    name: 'AuditLogs',
    component: () => import('@/features/audit/views/AuditLogs.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/features/profile/views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/loading',
    name: 'Loading',
    component: () => import('@/features/loading/views/Loading.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = Cookies.get('token')
  const isAuthenticated = !!token
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
