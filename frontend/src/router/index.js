import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

import Login from '../views/Login.vue'
import ForgotPassword from '../views/ForgotPassword.vue'
import Dashboard from '../views/Dashboard.vue'
import Products from '../views/Products.vue'
import Inventory from '../views/Inventory.vue'
import Suppliers from '../views/Suppliers.vue'
import Clients from '../views/Clients.vue'
import ClientProfile from '../views/ClientProfile.vue'
import Vendors from '../views/Vendors.vue'
import VendorProfile from '../views/VendorProfile.vue'
import Sites from '../views/Sites.vue'
import AuditLogs from '../views/AuditLogs.vue'
import Profile from '../views/Profile.vue'
import Users from '../views/Users.vue'
import Loading from '../views/Loading.vue'

const routes = [
  {
    path: '/loading',
    name: 'Loading',
    component: Loading
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { public: true }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { public: true }
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/products',
    name: 'Products',
    component: Products,
    meta: { requiresAuth: true }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: Inventory,
    meta: { requiresAuth: true }
  },
  {
    path: '/suppliers',
    name: 'Suppliers',
    component: Suppliers,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients',
    name: 'Clients',
    component: Clients,
    meta: { requiresAuth: true }
  },
  {
    path: '/clients/:id',
    name: 'ClientProfile',
    component: ClientProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/vendors',
    name: 'Vendors',
    component: Vendors,
    meta: { requiresAuth: true }
  },
  {
    path: '/vendors/:id',
    name: 'VendorProfile',
    component: VendorProfile,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/users',
    name: 'Users',
    component: Users,
    meta: { requiresAuth: true, roles: ['admin', 'manager'] }
  },
  {
    path: '/sites',
    name: 'Sites',
    component: Sites,
    meta: { requiresAuth: true, roles: ['admin'] }
  },
  {
    path: '/audit',
    name: 'AuditLogs',
    component: AuditLogs,
    meta: { requiresAuth: true, roles: ['admin', 'manager'] }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters['auth/isAuthenticated']
  const userRole = store.getters['auth/currentUser']?.role

  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.public && isAuthenticated) {
    next('/')
  } else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    next('/')
  } else {
    next()
  }
})

export default router
