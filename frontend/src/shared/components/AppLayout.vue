<template>
  <div class="app-layout" :class="{ 'sidebar-collapsed': collapsed, 'mobile-open': mobileOpen }">
    <!-- Mobile sidebar overlay -->
    <div class="sidebar-overlay" @click="mobileOpen = false"></div>
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <div class="logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
              <path d="M10 16L14 20L22 12" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop stop-color="#7367f0"/>
                  <stop offset="1" stop-color="#9e8cfc"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="logo-text" v-if="!collapsed">SIMS</span>
        </div>
        <button class="collapse-btn" @click="collapsed = !collapsed">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path v-if="collapsed" d="M9 18l6-6-6-6"/>
            <path v-else d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
      </div>

      <div class="sidebar-user">
        <div v-if="user?.avatar_url && !sidebarAvatarError" class="sidebar-user-avatar">
          <img :key="user?.avatar_url" :src="user?.avatar_url" alt="" @error="sidebarAvatarError = true" @load="sidebarAvatarError = false" />
        </div>
        <div v-else class="sidebar-user-fallback" :class="user?.role">
          {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
        </div>
        <div class="sidebar-user-info" v-if="!collapsed">
          <span class="sidebar-user-name">{{ user?.name }}</span>
          <span class="sidebar-user-role">{{ user?.role }}</span>
        </div>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">
          <span class="nav-section-title" v-if="!collapsed">Menu</span>
          <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="9" rx="1"/>
              <rect x="14" y="3" width="7" height="5" rx="1"/>
              <rect x="14" y="12" width="7" height="9" rx="1"/>
              <rect x="3" y="16" width="7" height="5" rx="1"/>
            </svg>
            <span class="nav-text" v-if="!collapsed">Dashboard</span>
          </router-link>

          <router-link to="/products" class="nav-item" :class="{ active: $route.path === '/products' }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            <span class="nav-text" v-if="!collapsed">Products</span>
          </router-link>

          <router-link to="/inventory" class="nav-item" :class="{ active: $route.path === '/inventory' }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            <span class="nav-text" v-if="!collapsed">Inventory</span>
          </router-link>

          <router-link to="/suppliers" class="nav-item" :class="{ active: $route.path === '/suppliers' }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="1" y="3" width="15" height="13" rx="2"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <span class="nav-text" v-if="!collapsed">Suppliers</span>
          </router-link>

          <router-link to="/clients" class="nav-item" :class="{ active: $route.path.startsWith('/clients') }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span class="nav-text" v-if="!collapsed">Clients</span>
          </router-link>

          <router-link to="/vendors" class="nav-item" :class="{ active: $route.path.startsWith('/vendors') }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            <span class="nav-text" v-if="!collapsed">Vendors</span>
          </router-link>
        </div>

        <div class="nav-section" v-if="isAdmin || isManager">
          <span class="nav-section-title" v-if="!collapsed">Management</span>
          
          <router-link v-if="isAdmin" to="/categories" class="nav-item" :class="{ active: $route.path === '/categories' }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <span class="nav-text" v-if="!collapsed">Categories</span>
          </router-link>

          <router-link to="/reports" class="nav-item" :class="{ active: $route.path === '/reports' }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            <span class="nav-text" v-if="!collapsed">Reports</span>
          </router-link>

          <router-link v-if="isAdmin" to="/users" class="nav-item" :class="{ active: $route.path === '/users' }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            <span class="nav-text" v-if="!collapsed">Users</span>
          </router-link>

          <router-link v-if="isAdmin" to="/audit" class="nav-item" :class="{ active: $route.path === '/audit' }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
            <span class="nav-text" v-if="!collapsed">Audit Logs</span>
          </router-link>

          <router-link v-if="isAdmin" to="/sites" class="nav-item" :class="{ active: $route.path === '/sites' }">
            <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span class="nav-text" v-if="!collapsed">Sites</span>
          </router-link>
        </div>
      </nav>

      <div class="sidebar-footer">
        <router-link to="/profile" class="nav-item" :class="{ active: $route.path === '/profile' }">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <span class="nav-text" v-if="!collapsed">Profile</span>
        </router-link>
        <button class="nav-item logout-btn" @click="handleLogout">
          <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span class="nav-text" v-if="!collapsed">Logout</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <div class="main-wrapper">
      <!-- Header -->
      <header class="main-header">
        <div class="header-left">
          <button class="hamburger-btn" @click="toggleMobileSidebar" aria-label="Toggle sidebar">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div class="breadcrumb-nav" ref="navDropdownRef">
            <div class="breadcrumb-trigger" @click="toggleNavDropdown">
              <span class="breadcrumb-page">{{ pageTitle }}</span>
              <svg class="chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            <nav class="nav-dropdown" v-show="navDropdownOpen">
              <div class="nav-dropdown-section">
                <router-link to="/" class="nav-dd-item" :class="{ active: $route.path === '/' }" @click="navDropdownOpen = false">
                  <svg class="nav-dd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
                  Dashboard
                </router-link>
                <router-link to="/products" class="nav-dd-item" :class="{ active: $route.path === '/products' }" @click="navDropdownOpen = false">
                  <svg class="nav-dd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                  Products
                </router-link>
                <router-link to="/inventory" class="nav-dd-item" :class="{ active: $route.path === '/inventory' }" @click="navDropdownOpen = false">
                  <svg class="nav-dd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>
                  Inventory
                </router-link>
                <router-link to="/suppliers" class="nav-dd-item" :class="{ active: $route.path === '/suppliers' }" @click="navDropdownOpen = false">
                  <svg class="nav-dd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13" rx="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  Suppliers
                </router-link>
                <router-link to="/clients" class="nav-dd-item" :class="{ active: $route.path.startsWith('/clients') }" @click="navDropdownOpen = false">
                  <svg class="nav-dd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  Clients
                </router-link>
                <router-link to="/vendors" class="nav-dd-item" :class="{ active: $route.path.startsWith('/vendors') }" @click="navDropdownOpen = false">
                  <svg class="nav-dd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
                  Vendors
                </router-link>
              </div>
              <div class="nav-dropdown-section" v-if="isAdmin || isManager">
                <div class="nav-dd-section-title">Management</div>
                <router-link v-if="isAdmin" to="/categories" class="nav-dd-item" :class="{ active: $route.path === '/categories' }" @click="navDropdownOpen = false">
                  <svg class="nav-dd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                  Categories
                </router-link>
                <router-link to="/reports" class="nav-dd-item" :class="{ active: $route.path === '/reports' }" @click="navDropdownOpen = false">
                  <svg class="nav-dd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                  Reports
                </router-link>
                <router-link v-if="isAdmin" to="/users" class="nav-dd-item" :class="{ active: $route.path === '/users' }" @click="navDropdownOpen = false">
                  <svg class="nav-dd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                  Users
                </router-link>
                <router-link v-if="isAdmin" to="/audit" class="nav-dd-item" :class="{ active: $route.path === '/audit' }" @click="navDropdownOpen = false">
                  <svg class="nav-dd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  Audit Logs
                </router-link>
                <router-link v-if="isAdmin" to="/sites" class="nav-dd-item" :class="{ active: $route.path === '/sites' }" @click="navDropdownOpen = false">
                  <svg class="nav-dd-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Sites
                </router-link>
              </div>
            </nav>
          </div>
        </div>
        <div class="header-right">
          <!-- Site Selector -->
          <div class="site-selector" @click="toggleSiteDropdown" ref="siteDropdownRef">
            <div class="site-selector-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>{{ currentSite?.name || 'Select Site' }}</span>
              <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </div>
            <div class="site-dropdown" v-show="siteDropdownOpen">
              <div 
                v-for="site in sites" 
                :key="site.id" 
                class="site-option"
                :class="{ active: site.id === currentSite?.id }"
                @click.stop="switchSite(site)"
              >
                <span>{{ site.name }}</span>
                <svg v-if="site.id === currentSite?.id" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div class="site-dropdown-divider" v-if="isAdmin"></div>
              <router-link v-if="isAdmin" to="/sites" class="site-option manage" @click="siteDropdownOpen = false" v-show="isAdmin">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                </svg>
                <span>Manage Sites</span>
              </router-link>
            </div>
          </div>

          <!-- User Dropdown -->
          <div class="user-menu" @click="toggleDropdown" ref="dropdownRef">
            <template v-if="user?.avatar_url && !avatarError">
              <img :key="user?.avatar_url" :src="user?.avatar_url" alt="" class="user-avatar user-avatar-img" @error="avatarError = true" @load="avatarError = false" />
            </template>
            <div v-else class="user-avatar" :class="user?.role">
              {{ user?.name?.charAt(0)?.toUpperCase() || 'U' }}
            </div>
            <div class="user-info">
              <span class="user-name">{{ user?.name }}</span>
              <span class="user-role">{{ user?.role }}</span>
            </div>
            <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
            <div class="user-dropdown" v-show="dropdownOpen">
              <router-link to="/profile" class="dropdown-item" @click="dropdownOpen = false">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Profile
              </router-link>
              <button class="dropdown-item danger" @click="handleLogout">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="main-content">
        <slot />
      </main>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'

export default {
  name: 'AppLayout',
  setup() {
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const collapsed = ref(false)
    const dropdownOpen = ref(false)
    const dropdownRef = ref(null)
    const avatarError = ref(false)
    const sidebarAvatarError = ref(false)
    const siteDropdownOpen = ref(false)
    const siteDropdownRef = ref(null)
    const mobileOpen = ref(false)
    const navDropdownOpen = ref(false)
    const navDropdownRef = ref(null)
    
    const user = computed(() => store.getters['auth/currentUser'])
    const isAdmin = computed(() => user.value?.role === 'admin')
    const isManager = computed(() => user.value?.role === 'manager')
    const sites = computed(() => store.getters['sites/allSites'])
    const currentSite = computed(() => store.getters['sites/currentSite'])
    
    const pageTitle = computed(() => {
      const path = route.path
      const titles = {
        '/': 'Dashboard',
        '/products': 'Products',
        '/inventory': 'Inventory',
        '/suppliers': 'Suppliers',
        '/clients': 'Clients',
        '/vendors': 'Vendors',
        '/users': 'User Management',
        '/profile': 'Profile',
        '/sites': 'Site Management',
        '/audit': 'Audit Logs',
        '/reports': 'Reports',
        '/categories': 'Categories'
      }
      if (path.startsWith('/clients/')) return 'Client Details'
      if (path.startsWith('/vendors/')) return 'Vendor Details'
      return titles[path] || 'Inventory Management'
    })
    
    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value
      if (dropdownOpen.value) siteDropdownOpen.value = false
    }
    
    const toggleSiteDropdown = () => {
      siteDropdownOpen.value = !siteDropdownOpen.value
      if (siteDropdownOpen.value) dropdownOpen.value = false
    }
    
    const switchSite = async (site) => {
      await store.dispatch('sites/setCurrentSite', site)
      siteDropdownOpen.value = false
      mobileOpen.value = false
      router.push('/')
    }
    
    const toggleNavDropdown = () => {
      navDropdownOpen.value = !navDropdownOpen.value
      if (navDropdownOpen.value) {
        dropdownOpen.value = false
        siteDropdownOpen.value = false
      }
    }

    const toggleMobileSidebar = () => {
      mobileOpen.value = !mobileOpen.value
    }
    
    const handleLogout = async () => {
      dropdownOpen.value = false
      siteDropdownOpen.value = false
      mobileOpen.value = false
      await store.dispatch('auth/logout')
      router.push('/login')
    }
    
    const handleClickOutside = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        dropdownOpen.value = false
      }
      if (siteDropdownRef.value && !siteDropdownRef.value.contains(event.target)) {
        siteDropdownOpen.value = false
      }
      if (navDropdownRef.value && !navDropdownRef.value.contains(event.target)) {
        navDropdownOpen.value = false
      }
    }
    
    onMounted(async () => {
      document.addEventListener('click', handleClickOutside)
      await store.dispatch('sites/initializeSite')
      if (window.innerWidth < 1024) {
        collapsed.value = true
      }
      window.addEventListener('resize', handleResize)
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('resize', handleResize)
    })

    const handleResize = () => {
      if (window.innerWidth < 1024) {
        collapsed.value = true
      } else {
        collapsed.value = false
      }
    }

    watch(user, (newUser) => {
      if (!newUser && route.path !== '/login') {
        router.push('/login')
      }
    })

    return {
      collapsed,
      user,
      isAdmin,
      isManager,
      sites,
      currentSite,
      dropdownOpen,
      dropdownRef,
      avatarError,
      sidebarAvatarError,
      siteDropdownOpen,
      siteDropdownRef,
      pageTitle,
      navDropdownOpen,
      navDropdownRef,
      toggleDropdown,
      toggleSiteDropdown,
      toggleNavDropdown,
      switchSite,
      toggleMobileSidebar,
      handleLogout
    }
  }
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
  background: var(--light-color);
}

/* Sidebar */
.sidebar {
  width: 260px;
  background: var(--white);
  border-right: 1px solid var(--gray-200);
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 100;
  transition: width 0.3s ease;
}

.sidebar-collapsed .sidebar {
  width: 72px;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--gray-200);
}

.sidebar-user {
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid var(--gray-200);
}

.sidebar-collapsed .sidebar-user {
  justify-content: center;
  padding: 12px 0;
}

.sidebar-user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.sidebar-user-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sidebar-user-fallback {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--white);
  flex-shrink: 0;
}

.sidebar-user-fallback.admin { background: linear-gradient(118deg, var(--primary-color), var(--primary-dark)); }
.sidebar-user-fallback.manager { background: linear-gradient(118deg, var(--success-color), #1fab4d); }
.sidebar-user-fallback.staff { background: linear-gradient(118deg, var(--info-color), #00a3bf); }

.sidebar-user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sidebar-user-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--gray-800);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-user-role {
  font-size: 12px;
  color: var(--gray-500);
  text-transform: capitalize;
}

.sidebar-collapsed .sidebar-user-info {
  display: none;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: 20px;
  font-weight: 700;
  color: var(--primary-color);
  letter-spacing: 1px;
}

.collapse-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  border: none;
  background: var(--gray-100);
  color: var(--gray-600);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: var(--transition);
}

.collapse-btn:hover {
  background: var(--gray-200);
  color: var(--gray-800);
}

.sidebar-collapsed .collapse-btn {
  margin-left: auto;
  margin-right: auto;
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
}

.nav-section {
  margin-bottom: 24px;
}

.nav-section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--gray-500);
  padding: 0 12px;
  margin-bottom: 8px;
  display: block;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: var(--border-radius);
  color: var(--gray-600);
  text-decoration: none;
  transition: var(--transition);
  margin-bottom: 4px;
  cursor: pointer;
  border: none;
  background: none;
  width: 100%;
  font-size: 14px;
  font-family: inherit;
}

.nav-item:hover {
  background: var(--gray-100);
  color: var(--gray-800);
}

.nav-item.active {
  background: linear-gradient(118deg, var(--primary-color), var(--primary-dark));
  color: var(--white);
  box-shadow: 0 3px 12px rgba(115, 103, 240, 0.35);
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-collapsed .nav-item {
  justify-content: center;
  padding: 12px;
}

.sidebar-collapsed .nav-text {
  display: none;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 16px 12px;
  border-top: 1px solid var(--gray-200);
}

.logout-btn {
  color: var(--danger-color);
}

.logout-btn:hover {
  background: rgba(234, 84, 85, 0.1);
}

/* Main Wrapper */
.main-wrapper {
  flex: 1;
  margin-left: 260px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: margin-left 0.3s ease;
}

.sidebar-collapsed .main-wrapper {
  margin-left: 72px;
}

/* Header */
.main-header {
  height: 64px;
  background: var(--white);
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.header-left {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
}

/* Breadcrumb Nav Dropdown */
.breadcrumb-nav {
  position: relative;
}

.breadcrumb-trigger {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
}

.breadcrumb-trigger:hover {
  background: var(--gray-100);
}

.breadcrumb-page {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-900);
}

.breadcrumb-trigger .chevron {
  display: none;
  color: var(--gray-500);
  transition: transform 0.2s;
}

.nav-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 220px;
  max-height: 70vh;
  overflow-y: auto;
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
  padding: 8px;
  z-index: 200;
}

.nav-dropdown-section {
  margin-bottom: 8px;
}

.nav-dropdown-section:last-child {
  margin-bottom: 0;
  padding-top: 8px;
  border-top: 1px solid var(--gray-200);
}

.nav-dd-section-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--gray-500);
  padding: 8px 12px 4px;
}

.nav-dd-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  color: var(--gray-600);
  text-decoration: none;
  font-size: 14px;
  transition: var(--transition);
}

.nav-dd-item:hover {
  background: var(--gray-100);
  color: var(--gray-800);
}

.nav-dd-item.active {
  background: rgba(115, 103, 240, 0.1);
  color: var(--primary-color);
  font-weight: 500;
}

.nav-dd-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* Site Selector */
.site-selector {
  position: relative;
}

.site-selector-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 14px;
  background: var(--gray-100);
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  color: var(--gray-700);
  font-size: 14px;
  font-weight: 500;
}

.site-selector-btn:hover {
  background: var(--gray-200);
}

.site-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 240px;
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
  padding: 8px;
  z-index: 100;
}

.site-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 6px;
  color: var(--gray-700);
  cursor: pointer;
  transition: var(--transition);
  font-size: 14px;
}

.site-option:hover {
  background: var(--gray-100);
}

.site-option.active {
  background: rgba(115, 103, 240, 0.1);
  color: var(--primary-color);
  font-weight: 500;
}

.site-option.manage {
  color: var(--gray-600);
  font-size: 13px;
}

.site-dropdown-divider {
  height: 1px;
  background: var(--gray-200);
  margin: 8px 0;
}

.chevron {
  color: var(--gray-500);
}

/* User Menu */
.user-menu {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 6px 12px 6px 6px;
  border-radius: var(--border-radius);
  cursor: pointer;
  position: relative;
  transition: var(--transition);
}

.user-menu:hover {
  background: var(--gray-100);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--white);
  object-fit: cover;
}

.user-avatar.admin { background: linear-gradient(118deg, var(--primary-color), var(--primary-dark)); }
.user-avatar.manager { background: linear-gradient(118deg, var(--success-color), #1fab4d); }
.user-avatar.staff { background: linear-gradient(118deg, var(--info-color), #00a3bf); }

.user-avatar-img {
  background: var(--gray-100);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-800);
}

.user-role {
  font-size: 12px;
  color: var(--gray-500);
  text-transform: capitalize;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 180px;
  background: var(--white);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--gray-200);
  padding: 8px;
  z-index: 100;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  color: var(--gray-700);
  cursor: pointer;
  transition: var(--transition);
  font-size: 14px;
  text-decoration: none;
  border: none;
  background: none;
  width: 100%;
  font-family: inherit;
}

.dropdown-item:hover {
  background: var(--gray-100);
}

.dropdown-item.danger {
  color: var(--danger-color);
}

.dropdown-item.danger:hover {
  background: rgba(234, 84, 85, 0.1);
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 24px;
}

/* Sidebar overlay for mobile */
.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

.hamburger-btn {
  display: none;
  width: 36px;
  height: 36px;
  border: none;
  background: transparent;
  color: var(--gray-600);
  cursor: pointer;
  border-radius: 6px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.hamburger-btn:hover {
  background: var(--gray-100);
}

@media (max-width: 768px) {
  .sidebar-overlay.mobile-open {
    display: block;
  }

  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    z-index: 100;
  }

  .mobile-open .sidebar {
    transform: translateX(0);
  }

  .sidebar-collapsed .sidebar {
    width: 260px;
  }

  .main-wrapper {
    margin-left: 0 !important;
    width: 100% !important;
  }

  .hamburger-btn {
    display: inline-flex;
  }

  .collapse-btn {
    display: none;
  }

  .main-header {
    padding: 0 16px;
  }

  .header-right {
    gap: 8px;
  }

  .page-title {
    font-size: 18px;
  }

  .user-info {
    display: none;
  }

  .user-menu {
    padding: 8px;
  }

  .site-selector-btn span {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sidebar-user-info {
    display: block !important;
  }

  .breadcrumb-trigger .chevron {
    display: block;
  }

  .nav-dropdown {
    left: 0;
    right: auto;
    min-width: 240px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 16px;
  }

  .site-selector-btn span {
    display: none;
  }

  .main-content {
    padding: 16px;
  }
}
</style>
