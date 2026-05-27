<template>
  <AppLayout>
    <div class="profile-page">
      <div class="page-header">
        <div class="page-title-area">
          <h1 class="page-title">My Profile</h1>
          <nav class="breadcrumb">
            <router-link to="/">Dashboard</router-link>
            <span class="separator">/</span>
            <span class="current">Profile</span>
          </nav>
        </div>
      </div>

      <div class="row">
        <div class="col-8">
          <div class="card mb-4">
            <div class="card-header">
              <h4>Profile Information</h4>
            </div>
            <div class="card-body">
              <div class="profile-header">
                <div class="avatar-section">
                  <div class="avatar-lg" :class="user?.role" v-if="!previewUrl && !user?.avatar_url">
                    {{ user?.name?.charAt(0).toUpperCase() }}
                  </div>
                  <img v-else :src="previewUrl || user?.avatar_url" alt="Avatar" class="avatar-img avatar-lg" />
                  <label class="avatar-upload-btn" title="Change photo">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                      <circle cx="12" cy="13" r="4"/>
                    </svg>
                    <input type="file" accept="image/jpeg,image/png,image/gif,image/webp" @change="handleAvatarChange" />
                  </label>
                </div>
                <div class="profile-info">
                  <h2>{{ user?.name }}</h2>
                  <span class="badge" :class="getRoleBadgeClass(user?.role)">{{ user?.role }}</span>
                  <p class="text-muted mt-2">{{ user?.email }}</p>
                </div>
              </div>
              <div class="info-grid">
                <div class="info-item">
                  <label>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                      <circle cx="12" cy="7" r="4"/>
                    </svg>
                    Name
                  </label>
                  <p>{{ user?.name }}</p>
                </div>
                <div class="info-item">
                  <label>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                      <polyline points="22,6 12,13 2,6"/>
                    </svg>
                    Email
                  </label>
                  <p>{{ user?.email }}</p>
                </div>
                <div class="info-item">
                  <label>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    Role
                  </label>
                  <p class="fw-600 text-capitalize">{{ user?.role }}</p>
                </div>
                <div class="info-item">
                  <label>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    Member Since
                  </label>
                  <p>{{ formatDate(user?.created_at) }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="card mb-4">
            <div class="card-header">
              <h4>Change Password</h4>
            </div>
            <div class="card-body">
              <form @submit.prevent="handleChangePassword" class="password-form">
                <div class="form-group">
                  <label class="form-label">Current Password</label>
                  <input v-model="passwordForm.oldPassword" type="password" class="form-control" required />
                </div>
                <div class="row">
                  <div class="col-6">
                    <div class="form-group">
                      <label class="form-label">New Password</label>
                      <input v-model="passwordForm.newPassword" type="password" class="form-control" required minlength="6" />
                      <div v-if="passwordForm.newPassword" class="password-strength">
                        <div class="strength-bar">
                          <div class="strength-fill" :class="pwStrength.level" :style="{ width: pwStrength.pct + '%' }"></div>
                        </div>
                        <span class="strength-label" :class="pwStrength.level">{{ pwStrength.label }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="col-6">
                    <div class="form-group">
                      <label class="form-label">Confirm New Password</label>
                      <input v-model="passwordForm.confirmPassword" type="password" class="form-control" required />
                    </div>
                  </div>
                </div>
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  {{ loading ? 'Changing...' : 'Change Password' }}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div class="col-4">
          <div class="card mb-4">
            <div class="card-header">
              <h4>Your Permissions</h4>
            </div>
            <div class="card-body">
              <div class="permissions-list">
                <div v-for="(perms, feature) in permissions" :key="feature" class="permission-item">
                  <span class="feature-name">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="9 11 12 14 22 4"/>
                      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                    </svg>
                    {{ formatFeatureName(feature) }}
                  </span>
                  <div class="perm-badges">
                    <span v-for="perm in perms" :key="perm" class="badge" :class="getPermBadgeClass(perm)">{{ perm }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-if="isAdmin" class="card admin-card">
            <div class="card-header">
              <h4>Admin Features</h4>
            </div>
            <div class="card-body">
              <div class="admin-actions">
                <router-link to="/users" class="action-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span>Manage Users</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </router-link>
                <router-link to="/sites" class="action-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                  <span>Manage Sites</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </router-link>
                <router-link to="/audit" class="action-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  <span>Audit Logs</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </router-link>
              </div>
            </div>
          </div>

          <div class="card">
            <div class="card-header">
              <h4>Quick Actions</h4>
            </div>
            <div class="card-body">
              <div class="admin-actions">
                <router-link to="/products" class="action-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                  <span>Products</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </router-link>
                <router-link to="/inventory" class="action-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                  <span>Inventory</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </router-link>
                <router-link to="/reports" class="action-item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                  <span>Reports</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="arrow">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import api from '@/shared/services/api'
import AppLayout from '@/shared/components/AppLayout.vue'
import { showSuccess, showError } from '@/shared/components/ToastContainer.vue'

export default {
  name: 'Profile',
  components: { AppLayout },
  setup() {
    const store = useStore()
    const avatarUploading = ref(false)
    const previewUrl = ref(null)
    
    const user = computed(() => store.getters['auth/currentUser'])
    const loading = computed(() => store.getters['auth/authLoading'])
    const isAdmin = computed(() => store.getters['auth/isAdmin'])
    const isManager = computed(() => store.getters['auth/isManager'])
    const isStaff = computed(() => store.getters['auth/isStaff'])
    
    const handleAvatarChange = async (event) => {
      const file = event.target.files?.[0]
      if (!file) return

      if (file.size > 5 * 1024 * 1024) {
        showError('Image must be less than 5MB')
        return
      }
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        showError('Image must be JPEG, PNG, GIF, or WebP')
        return
      }

      previewUrl.value = URL.createObjectURL(file)

      const formData = new FormData()
      formData.append('avatar', file)

      avatarUploading.value = true
      try {
        const response = await api.put('/profile/avatar', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        store.commit('auth/SET_USER', { ...user.value, avatar_url: response.data.avatar_url })
        showSuccess('Avatar updated successfully')
      } catch (error) {
        previewUrl.value = null
        showError(error.response?.data?.error || 'Failed to upload avatar')
      } finally {
        avatarUploading.value = false
        event.target.value = ''
      }
    }
    
    const passwordForm = ref({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    
    const pwStrength = computed(() => {
      const pw = passwordForm.value.newPassword || ''
      let score = 0
      if (pw.length >= 8) score++
      if (pw.length >= 12) score++
      if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
      if (/\d/.test(pw)) score++
      if (/[^a-zA-Z0-9]/.test(pw)) score++
      if (score <= 1) return { level: 'weak', label: 'Weak', pct: 20 }
      if (score <= 2) return { level: 'fair', label: 'Fair', pct: 40 }
      if (score <= 3) return { level: 'medium', label: 'Medium', pct: 60 }
      if (score <= 4) return { level: 'strong', label: 'Strong', pct: 80 }
      return { level: 'very-strong', label: 'Very Strong', pct: 100 }
    })
    
    const permissions = computed(() => {
      const role = user.value?.role
      const allPermissions = {
        products: ['view'],
        inventory: ['view', 'stock_in', 'stock_out'],
        suppliers: ['view'],
        clients: ['view'],
        vendors: ['view'],
        users: ['view'],
        sites: ['view'],
        audit: ['view'],
        reports: ['view']
      }
      
      if (role === 'admin') {
        return {
          products: ['view', 'create', 'update', 'delete'],
          inventory: ['view', 'stock_in', 'stock_out', 'adjust'],
          suppliers: ['view', 'create', 'update', 'delete'],
          clients: ['view', 'create', 'update', 'delete'],
          vendors: ['view', 'create', 'update', 'delete'],
          users: ['view', 'create', 'update', 'delete'],
          sites: ['view', 'create', 'update', 'delete'],
          audit: ['view'],
          reports: ['view']
        }
      } else if (role === 'manager') {
        return {
          products: ['view', 'create', 'update'],
          inventory: ['view', 'stock_in', 'stock_out', 'adjust'],
          suppliers: ['view', 'create', 'update'],
          clients: ['view', 'create', 'update'],
          vendors: ['view', 'create', 'update'],
          users: ['view'],
          sites: ['view'],
          audit: ['view'],
          reports: ['view']
        }
      }
      return allPermissions
    })
    
    const getRoleBadgeClass = (role) => {
      switch (role) {
        case 'admin': return 'badge-primary'
        case 'manager': return 'badge-warning'
        case 'staff': return 'badge-info'
        default: return 'badge-secondary'
      }
    }
    
    const getPermBadgeClass = (perm) => {
      switch (perm) {
        case 'view': return 'badge-secondary'
        case 'create': return 'badge-success'
        case 'update': return 'badge-warning'
        case 'delete': return 'badge-danger'
        default: return 'badge-info'
      }
    }
    
    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
    
    const formatFeatureName = (feature) => {
      return feature.charAt(0).toUpperCase() + feature.slice(1)
    }
    
    const handleChangePassword = async () => {
      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        showError('Passwords do not match')
        return
      }
      
      try {
        await store.dispatch('auth/changePassword', {
          oldPassword: passwordForm.value.oldPassword,
          newPassword: passwordForm.value.newPassword
        })
        showSuccess('Password changed successfully')
        passwordForm.value = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        }
      } catch (error) {
        showError(error.response?.data?.error || 'Failed to change password')
      }
    }
    
    return {
      user,
      loading,
      isAdmin,
      isManager,
      isStaff,
      avatarUploading,
      previewUrl,
      handleAvatarChange,
      passwordForm,
      pwStrength,
      permissions,
      getRoleBadgeClass,
      getPermBadgeClass,
      formatDate,
      formatFeatureName,
      handleChangePassword
    }
  }
}
</script>

<style scoped>
.profile-page {
  padding: 24px;
}

.page-header {
  margin-bottom: 24px;
}

.page-title-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--gray-900);
  margin: 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.breadcrumb a {
  color: var(--gray-500);
}

.breadcrumb .separator {
  color: var(--gray-400);
}

.breadcrumb .current {
  color: var(--gray-700);
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--gray-200);
}

.avatar-section {
  position: relative;
}

.avatar-lg {
  width: 80px;
  height: 80px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
  color: white;
  object-fit: cover;
}

.avatar-lg.admin { background: linear-gradient(135deg, var(--primary-color), var(--primary-dark)); }
.avatar-lg.manager { background: linear-gradient(135deg, #ff9f43, #f77e4a); }
.avatar-lg.staff { background: linear-gradient(135deg, var(--info-color), #00a7c4); }

.avatar-img {
  background: var(--gray-100);
}

.avatar-upload-btn {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 2px solid white;
  transition: background 0.2s;
}

.avatar-upload-btn:hover {
  background: var(--primary-dark);
}

.avatar-upload-btn input {
  display: none;
}

.profile-info h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.profile-info p {
  margin: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.info-item label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.info-item p {
  font-size: 15px;
  color: var(--gray-800);
  margin: 0;
}

.permissions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.permission-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.feature-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-700);
}

.perm-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding-left: 22px;
}

.admin-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: var(--gray-50);
  border-radius: var(--border-radius);
  color: var(--gray-700);
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
}

.action-item:hover {
  background: var(--gray-100);
  color: var(--primary-color);
}

.action-item .arrow {
  margin-left: auto;
  opacity: 0.5;
}

.fw-600 {
  font-weight: 600;
}

.text-muted {
  color: var(--gray-500);
}

.text-capitalize {
  text-transform: capitalize;
}

.mt-2 {
  margin-top: 8px;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 0;
}

.card-body {
  padding: 24px;
}

.admin-card .card-header {
  background: rgba(115, 103, 240, 0.05);
}

.admin-card .card-header h4 {
  color: var(--primary-color);
}

.password-form {
  max-width: 500px;
}

.password-strength {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 8px;
}

.strength-bar {
  flex: 1;
  height: 4px;
  background: var(--gray-200);
  border-radius: 2px;
  overflow: hidden;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.strength-fill.weak { background: var(--danger-color); }
.strength-fill.fair { background: var(--warning-color); }
.strength-fill.medium { background: #ffc107; }
.strength-fill.strong { background: #8bc34a; }
.strength-fill.very-strong { background: var(--success-color); }

.strength-label {
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  min-width: 70px;
  text-align: right;
}

.strength-label.weak { color: var(--danger-color); }
.strength-label.fair { color: var(--warning-color); }
.strength-label.medium { color: #ffc107; }
.strength-label.strong { color: #8bc34a; }
.strength-label.very-strong { color: var(--success-color); }

@media (max-width: 992px) {
  .col-8, .col-4 {
    flex: 0 0 100%;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
