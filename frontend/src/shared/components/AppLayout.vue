<template>
  <div class="app-layout">
    <header class="top-header" :class="{ expanded: collapsed }">
      <div class="header-left">
        <h1 class="page-title">{{ pageTitle }}</h1>
      </div>
      <div class="header-right">
        <div class="site-selector" @click="toggleSiteDropdown" ref="siteDropdownRef">
          <span class="site-icon">🏢</span>
          <span class="site-name">{{ currentSite?.name || 'Select Site' }}</span>
          <span class="dropdown-arrow">▼</span>
          
          <div class="dropdown-menu site-dropdown" v-show="siteDropdownOpen">
            <div v-for="site in sites" :key="site.id" 
                 class="dropdown-item" 
                 :class="{ active: site.id === currentSite?.id }"
                 @click.stop="switchSite(site)">
              <span class="site-item-name">{{ site.name }}</span>
              <span v-if="site.id === currentSite?.id" class="check-mark">✓</span>
            </div>
            <router-link v-if="isAdmin" to="/sites" class="dropdown-item manage-sites" @click="siteDropdownOpen = false">
              <span>⚙️</span>
              <span>Manage Sites</span>
            </router-link>
          </div>
        </div>
        
        <div class="user-dropdown" @click="toggleDropdown" ref="dropdownRef">
          <div class="avatar" :class="user?.role">
            {{ user?.name?.charAt(0).toUpperCase() }}
          </div>
          <span class="user-name">{{ user?.name }}</span>
          <span class="dropdown-arrow">▼</span>
          
          <div class="dropdown-menu" v-show="dropdownOpen">
            <router-link to="/profile" class="dropdown-item" @click="dropdownOpen = false">
              <span class="dropdown-icon">👤</span>
              Profile
            </router-link>
            <button class="dropdown-item logout" @click="handleLogout">
              <span class="dropdown-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
    <aside class="sidebar" :class="{ collapsed }">
      <div class="logo">
        <h2 v-if="!collapsed">SIMS</h2>
        <span v-else class="logo-icon">📦</span>
        <button class="collapse-btn" @click="collapsed = !collapsed">
          {{ collapsed ? '→' : '←' }}
        </button>
      </div>
      <nav class="nav-menu">
        <router-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
          <span class="icon">📊</span>
          <span v-if="!collapsed">Dashboard</span>
        </router-link>
        <router-link to="/products" class="nav-item" :class="{ active: $route.path === '/products' }">
          <span class="icon">📦</span>
          <span v-if="!collapsed">Products</span>
        </router-link>
        <router-link to="/inventory" class="nav-item" :class="{ active: $route.path === '/inventory' }">
          <span class="icon">🔄</span>
          <span v-if="!collapsed">Inventory</span>
        </router-link>
        <router-link to="/suppliers" class="nav-item" :class="{ active: $route.path === '/suppliers' }">
          <span class="icon">🏢</span>
          <span v-if="!collapsed">Suppliers</span>
        </router-link>
        
        <router-link to="/clients" class="nav-item" :class="{ active: $route.path === '/clients' || $route.path.startsWith('/clients/') }">
          <span class="icon">👥</span>
          <span v-if="!collapsed">Clients</span>
        </router-link>
        
        <router-link to="/vendors" class="nav-item" :class="{ active: $route.path === '/vendors' || $route.path.startsWith('/vendors/') }">
          <span class="icon">🚚</span>
          <span v-if="!collapsed">Vendors</span>
        </router-link>
        
        <router-link to="/reports" class="nav-item" :class="{ active: $route.path === '/reports' }">
          <span class="icon">📋</span>
          <span v-if="!collapsed">Reports</span>
        </router-link>
        
        <router-link v-if="isAdmin" to="/users" class="nav-item" :class="{ active: $route.path === '/users' }">
          <span class="icon">👥</span>
          <span v-if="!collapsed">Users</span>
        </router-link>
        
        <router-link v-if="isAdmin" to="/audit" class="nav-item" :class="{ active: $route.path === '/audit' }">
          <span class="icon">📜</span>
          <span v-if="!collapsed">Audit Logs</span>
        </router-link>
      </nav>
      
      <div class="user-section">
        <div class="avatar-small" :class="user?.role">
          {{ user?.name?.charAt(0).toUpperCase() }}
        </div>
        <div v-if="!collapsed" class="user-details">
          <span class="user-name">{{ user?.name }}</span>
          <span class="user-role">{{ user?.role }}</span>
        </div>
      </div>
    </aside>
    <main class="main-content" :class="{ expanded: collapsed }">
      <slot />
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
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
    const siteDropdownOpen = ref(false)
    const siteDropdownRef = ref(null)
    
    const user = computed(() => store.getters['auth/currentUser'])
    const isAdmin = computed(() => user.value?.role === 'admin')
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
        '/users': 'Users',
        '/profile': 'Profile',
        '/sites': 'Site Management',
        '/audit': 'Audit Logs',
        '/reports': 'Reports & Records'
      }
      if (path.startsWith('/clients/')) return 'Client Details'
      if (path.startsWith('/vendors/')) return 'Vendor Details'
      if (path.startsWith('/sites/')) return 'Site Management'
      return titles[path] || 'Inventory Management'
    })
    
    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value
    }
    
    const toggleSiteDropdown = () => {
      siteDropdownOpen.value = !siteDropdownOpen.value
    }
    
    const switchSite = async (site) => {
      await store.dispatch('sites/setCurrentSite', site)
      siteDropdownOpen.value = false
      router.push('/')
    }
    
    const handleLogout = () => {
      dropdownOpen.value = false
      store.dispatch('auth/logout')
      router.push('/login')
    }
    
    const handleClickOutside = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        dropdownOpen.value = false
      }
      if (siteDropdownRef.value && !siteDropdownRef.value.contains(event.target)) {
        siteDropdownOpen.value = false
      }
    }
    
    onMounted(async () => {
      document.addEventListener('click', handleClickOutside)
      await store.dispatch('sites/initializeSite')
    })
    
    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })
    return {
      collapsed,
      user,
      isAdmin,
      sites,
      currentSite,
      dropdownOpen,
      dropdownRef,
      siteDropdownOpen,
      siteDropdownRef,
      pageTitle,
      toggleDropdown,
      toggleSiteDropdown,
      switchSite,
      handleLogout
    }
  }
}
</script>

<style scoped>
.app-layout {
  display: flex;
  min-height: 100vh;
}

.top-header {
  position: fixed;
  top: 0;
  left: 240px;
  right: 0;
  height: 64px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  z-index: 90;
  transition: left 0.3s ease;
}

.top-header.expanded {
  left: 70px;
}

.header-left {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-dropdown {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
}

.user-dropdown:hover {
  background: #f3f4f6;
}

.user-dropdown .avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.user-dropdown .avatar.admin { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.user-dropdown .avatar.manager { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.user-dropdown .avatar.staff { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

.user-dropdown .user-name {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a2e;
}

.site-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 8px;
  cursor: pointer;
  position: relative;
  transition: background 0.2s;
  background: #f3f4f6;
  margin-right: 12px;
}

.site-selector:hover {
  background: #e5e7eb;
}

.site-icon {
  font-size: 16px;
}

.site-name {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a2e;
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.site-dropdown {
  min-width: 220px;
}

.site-item-name {
  flex: 1;
}

.check-mark {
  color: #4f46e5;
  font-weight: bold;
}

.manage-sites {
  border-top: 1px solid #e5e7eb;
  margin-top: 4px;
  padding-top: 12px;
}

.dropdown-arrow {
  font-size: 10px;
  color: #6b7280;
  transition: transform 0.2s;
}

.user-dropdown:hover .dropdown-arrow {
  transform: translateY(2px);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  min-width: 180px;
  overflow: hidden;
  z-index: 100;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  font-size: 14px;
  color: #1a1a2e;
  text-decoration: none;
  transition: background 0.2s;
  border: none;
  background: none;
  width: 100%;
  cursor: pointer;
  text-align: left;
}

.dropdown-item:hover {
  background: #f3f4f6;
}

.dropdown-item.logout {
  color: #dc2626;
  border-top: 1px solid #e5e7eb;
}

.dropdown-item.logout:hover {
  background: #fef2f2;
}

.dropdown-icon {
  font-size: 16px;
}

.sidebar {
  width: 240px;
  background: #1a1a2e;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  transition: width 0.3s ease;
  z-index: 100;
}

.sidebar.collapsed {
  width: 70px;
}

.logo {
  padding: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo h2 {
  font-size: 22px;
  font-weight: 700;
  color: #4f46e5;
  margin: 0;
}

.logo-icon {
  font-size: 24px;
}

.collapse-btn {
  background: rgba(255,255,255,0.1);
  border: none;
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.collapse-btn:hover {
  background: rgba(255,255,255,0.2);
}

.nav-menu {
  flex: 1;
  padding: 16px 12px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  margin-bottom: 4px;
  transition: all 0.2s;
  white-space: nowrap;
}

.sidebar.collapsed .nav-item {
  justify-content: center;
  padding: 12px;
}

.nav-item:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

.nav-item.active {
  background: #4f46e5;
  color: white;
}

.icon {
  font-size: 18px;
  flex-shrink: 0;
}

.user-section {
  padding: 16px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 8px;
  text-decoration: none;
  margin-bottom: 12px;
  transition: background 0.2s;
  white-space: nowrap;
}

.sidebar.collapsed .user-info {
  justify-content: center;
}

.user-info:hover {
  background: rgba(255,255,255,0.1);
}

.avatar-small {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  color: white;
  flex-shrink: 0;
}

.avatar-small.admin { background: #667eea; }
.avatar-small.manager { background: #f5576c; }
.avatar-small.staff { background: #4facfe; }

.user-details {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-name {
  font-weight: 500;
  font-size: 14px;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  text-transform: capitalize;
}

.logout-btn {
  width: 100%;
  padding: 10px 12px;
  background: rgba(255,255,255,0.1);
  border: none;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background 0.2s;
}

.logout-btn:hover {
  background: rgba(255,255,255,0.2);
}

.main-content {
  flex: 1;
  margin-left: 240px;
  margin-top: 64px;
  padding: 24px;
  background: #f5f7fa;
  min-height: calc(100vh - 64px);
  transition: margin-left 0.3s ease;
}

.main-content.expanded {
  margin-left: 70px;
}
</style>
