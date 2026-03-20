<template>
  <AppLayout>
    <div class="profile-page">
      <div class="profile-header">
        <div class="avatar" :class="user?.role">
          {{ user?.name?.charAt(0).toUpperCase() }}
        </div>
        <div class="header-info">
          <h1>{{ user?.name }}</h1>
          <span class="role-badge" :class="user?.role">{{ user?.role }}</span>
          <p style="margin-top: 8px; color: #6b7280; font-size: 14px;">{{ user?.email }}</p>
        </div>
      </div>

      <div class="profile-content">
        <!-- Profile Info Card -->
        <div class="card">
          <h2>Profile Information</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>Name</label>
              <p>{{ user?.name }}</p>
            </div>
            <div class="info-item">
              <label>Email</label>
              <p>{{ user?.email }}</p>
            </div>
            <div class="info-item">
              <label>Role</label>
              <p class="role-text" :class="user?.role">{{ user?.role }}</p>
            </div>
            <div class="info-item">
              <label>Member Since</label>
              <p>{{ formatDate(user?.created_at) }}</p>
            </div>
          </div>
        </div>

        <!-- Role-Based Access Card -->
        <div class="card">
          <h2>Your Permissions</h2>
          <div class="permissions-list">
            <div v-for="(perms, feature) in permissions" :key="feature" class="permission-item">
              <span class="feature-name">{{ formatFeatureName(feature) }}</span>
              <div class="perm-badges">
                <span v-for="perm in perms" :key="perm" class="perm-badge" :class="perm">
                  {{ perm }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Admin Features -->
        <div v-if="isAdmin" class="card admin-card">
          <h2>Admin Features</h2>
          <div class="admin-actions">
            <router-link to="/users" class="admin-action">
              <span class="icon">👥</span>
              <span>Manage Users</span>
            </router-link>
            <router-link to="/settings" class="admin-action">
              <span class="icon">⚙️</span>
              <span>System Settings</span>
            </router-link>
          </div>
        </div>

        <!-- Manager Features -->
        <div v-if="isManager" class="card manager-card">
          <h2>Manager Features</h2>
          <div class="manager-actions">
            <router-link to="/products" class="action-link">Manage Products</router-link>
            <router-link to="/suppliers" class="action-link">Manage Suppliers</router-link>
            <router-link to="/inventory" class="action-link">Inventory Operations</router-link>
          </div>
        </div>

        <!-- Staff Features -->
        <div v-if="isStaff" class="card staff-card">
          <h2>Staff Features</h2>
          <div class="staff-actions">
            <router-link to="/products" class="action-link">View Products</router-link>
            <router-link to="/inventory" class="action-link">Stock In/Out</router-link>
          </div>
        </div>

        <!-- Change Password -->
        <div class="card">
          <h2>Change Password</h2>
          <form @submit.prevent="handleChangePassword" class="password-form">
            <div class="form-group">
              <label>Current Password</label>
              <input v-model="passwordForm.oldPassword" type="password" required />
            </div>
            <div class="form-group">
              <label>New Password</label>
              <input v-model="passwordForm.newPassword" type="password" required minlength="6" />
            </div>
            <div class="form-group">
              <label>Confirm New Password</label>
              <input v-model="passwordForm.confirmPassword" type="password" required />
            </div>
            <button type="submit" class="btn-primary" :disabled="loading">
              {{ loading ? 'Changing...' : 'Change Password' }}
            </button>
            <p v-if="passwordError" class="error">{{ passwordError }}</p>
            <p v-if="passwordSuccess" class="success">{{ passwordSuccess }}</p>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import AppLayout from '../components/common/AppLayout.vue'

export default {
  name: 'Profile',
  components: { AppLayout },
  setup() {
    const store = useStore()
    const loading = ref(false)
    const passwordError = ref('')
    const passwordSuccess = ref('')
    const passwordForm = ref({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    })

    const user = computed(() => store.getters['auth/currentUser'])
    const isAdmin = computed(() => user.value?.role === 'admin')
    const isManager = computed(() => user.value?.role === 'manager')
    const isStaff = computed(() => user.value?.role === 'staff')

    const permissions = {
      products: {
        create: ['admin', 'manager'],
        read: ['admin', 'manager', 'staff'],
        update: ['admin', 'manager'],
        delete: ['admin']
      },
      inventory: {
        stockIn: ['admin', 'manager', 'staff'],
        stockOut: ['admin', 'manager', 'staff'],
        adjust: ['admin', 'manager']
      },
      suppliers: {
        create: ['admin', 'manager'],
        read: ['admin', 'manager', 'staff'],
        update: ['admin', 'manager'],
        delete: ['admin']
      },
      users: {
        create: ['admin'],
        read: ['admin', 'manager'],
        update: ['admin'],
        delete: ['admin']
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

    const formatFeatureName = (name) => {
      return name.charAt(0).toUpperCase() + name.slice(1)
    }

    const handleChangePassword = async () => {
      passwordError.value = ''
      passwordSuccess.value = ''

      if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
        passwordError.value = 'New passwords do not match'
        return
      }

      if (passwordForm.value.newPassword.length < 6) {
        passwordError.value = 'Password must be at least 6 characters'
        return
      }

      loading.value = true
      try {
        await store.dispatch('auth/changePassword', {
          oldPassword: passwordForm.value.oldPassword,
          newPassword: passwordForm.value.newPassword
        })
        passwordSuccess.value = 'Password changed successfully!'
        passwordForm.value = { oldPassword: '', newPassword: '', confirmPassword: '' }
      } catch (error) {
        passwordError.value = error.response?.data?.error || 'Failed to change password'
      } finally {
        loading.value = false
      }
    }

    return {
      user,
      isAdmin,
      isManager,
      isStaff,
      permissions,
      passwordForm,
      loading,
      passwordError,
      passwordSuccess,
      formatDate,
      formatFeatureName,
      handleChangePassword
    }
  }
}
</script>

<style scoped>
.profile-page {
  max-width: 900px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  background: white;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
}

.avatar.admin { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
.avatar.manager { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); }
.avatar.staff { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }

.header-info h1 {
  margin: 0 0 12px 0;
  font-size: 28px;
  color: #1a1a2e;
}

.role-badge {
  display: inline-block;
  padding: 6px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  text-transform: capitalize;
  letter-spacing: 0.5px;
}

.role-badge.admin { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; }
.role-badge.manager { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; }
.role-badge.staff { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; }

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
  border: 1px solid #f0f0f0;
}

.card h2 {
  margin: 0 0 24px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.card.admin-card h2 { border-bottom-color: #667eea; }
.card.manager-card h2 { border-bottom-color: #f5576c; }
.card.staff-card h2 { border-bottom-color: #4facfe; }

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

@media (max-width: 600px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}

.info-item label {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.info-item p {
  margin: 0;
  font-size: 16px;
  color: #1a1a2e;
  font-weight: 500;
}

.role-text.admin { color: #667eea; font-weight: 600; }
.role-text.manager { color: #f5576c; font-weight: 600; }
.role-text.staff { color: #4facfe; font-weight: 600; }

.permissions-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 600px) {
  .permissions-list {
    grid-template-columns: 1fr;
  }
}

.permission-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 10px;
}

.feature-name {
  font-weight: 600;
  color: #1a1a2e;
  font-size: 14px;
}

.perm-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.perm-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
}

.perm-badge.admin { background: #eef2ff; color: #667eea; }
.perm-badge.manager { background: #ffe4e6; color: #f5576c; }
.perm-badge.staff { background: #e0f2fe; color: #0891b2; }

.admin-actions, .manager-actions, .staff-actions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.admin-action {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 18px 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 500;
  font-size: 15px;
  transition: all 0.2s;
}

.admin-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.manager-actions .action-link,
.staff-actions .action-link {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 20px;
  color: white;
  border-radius: 10px;
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s;
}

.manager-actions .action-link {
  background: linear-gradient(135deg, #f5576c 0%, #f5576c 100%);
}

.manager-actions .action-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(245, 87, 108, 0.3);
}

.staff-actions .action-link {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.staff-actions .action-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(79, 172, 254, 0.3);
}

.password-form {
  max-width: 450px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 8px;
  color: #374151;
}

.form-group input {
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus {
  outline: none;
  border-color: #4f46e5;
}

.btn-primary {
  padding: 12px 28px;
  background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(79, 70, 229, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.error {
  color: #dc2626;
  font-size: 14px;
  margin-top: 12px;
  padding: 10px 14px;
  background: #fef2f2;
  border-radius: 6px;
}

.success {
  color: #16a34a;
  font-size: 14px;
  margin-top: 12px;
  padding: 10px 14px;
  background: #f0fdf4;
  border-radius: 6px;
}
</style>
