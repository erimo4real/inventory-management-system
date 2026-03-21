<template>
  <AppLayout>
    <div class="users-page">
      <div class="page-header">
        <div class="page-title-area">
          <h1 class="page-title">User Management</h1>
          <nav class="breadcrumb">
            <router-link to="/">Dashboard</router-link>
            <span class="separator">/</span>
            <span class="current">Users</span>
          </nav>
        </div>
        <button class="btn btn-primary" @click="showCreateModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="8.5" cy="7" r="4"/>
            <line x1="20" y1="8" x2="20" y2="14"/>
            <line x1="23" y1="11" x2="17" y2="11"/>
          </svg>
          Add User
        </button>
      </div>

      <div class="card">
        <div v-if="loading" class="card-body text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
        
        <div v-else-if="users.length" class="card-body p-0">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>
                    <div class="d-flex align-center gap-3">
                      <div class="avatar" :class="user.role">
                        {{ user.name?.charAt(0).toUpperCase() }}
                      </div>
                      <span class="fw-600">{{ user.name }}</span>
                    </div>
                  </td>
                  <td>{{ user.email }}</td>
                  <td>
                    <span class="badge" :class="getRoleBadgeClass(user.role)">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 4px;">
                        <path v-if="user.role === 'admin'" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        <path v-else-if="user.role === 'manager'" d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle v-else cx="12" cy="7" r="4"/>
                      </svg>
                      {{ user.role }}
                    </span>
                  </td>
                  <td class="text-muted">{{ formatDate(user.created_at) }}</td>
                  <td class="text-right">
                    <div class="d-flex gap-2 justify-end">
                      <button class="btn btn-sm btn-outline" @click="editUser(user)" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button 
                        class="btn btn-sm btn-outline btn-outline-danger" 
                        @click="deleteUser(user)" 
                        title="Delete"
                        :disabled="user.id === currentUser?.id"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <polyline points="3 6 5 6 21 6"/>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div v-else class="card-body text-center py-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-muted mb-3">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <h4>No users found</h4>
          <p class="text-muted">Get started by adding your first user</p>
          <button class="btn btn-primary" @click="showCreateModal = true">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
            Add User
          </button>
        </div>
      </div>

      <div v-if="showCreateModal || showEditModal" class="modal-backdrop" @click.self="closeModals">
        <div class="modal">
          <div class="modal-header">
            <h3>{{ showEditModal ? 'Edit User' : 'Create User' }}</h3>
            <button class="btn-icon" @click="closeModals">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Name</label>
                <input v-model="form.name" type="text" class="form-control" required />
              </div>
              <div class="form-group">
                <label class="form-label">Email</label>
                <input v-model="form.email" type="email" class="form-control" required />
              </div>
              <div class="form-group" v-if="!showEditModal">
                <label class="form-label">Password</label>
                <input v-model="form.password" type="password" class="form-control" required minlength="6" />
              </div>
              <div class="form-group mb-0">
                <label class="form-label">Role</label>
                <select v-model="form.role" class="form-control" required>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" @click="closeModals">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                {{ submitting ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import AppLayout from '@/shared/components/AppLayout.vue'
import api from '@/shared/services/api'
import { showSuccess, showError } from '@/shared/components/ToastContainer.vue'

export default {
  name: 'Users',
  components: { AppLayout },
  setup() {
    const store = useStore()
    const users = ref([])
    const loading = ref(false)
    const submitting = ref(false)
    const showCreateModal = ref(false)
    const showEditModal = ref(false)
    const form = ref({
      id: null,
      name: '',
      email: '',
      password: '',
      role: 'staff'
    })

    const currentUser = computed(() => store.getters['auth/currentUser'])

    const getRoleBadgeClass = (role) => {
      switch (role) {
        case 'admin': return 'badge-primary'
        case 'manager': return 'badge-warning'
        case 'staff': return 'badge-info'
        default: return 'badge-secondary'
      }
    }

    const fetchUsers = async () => {
      loading.value = true
      try {
        const response = await api.get('/users')
        users.value = response.data
      } catch (error) {
        console.error('Failed to fetch users:', error)
        showError('Failed to load users')
      } finally {
        loading.value = false
      }
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }

    const editUser = (user) => {
      form.value = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: '',
        role: user.role
      }
      showEditModal.value = true
    }

    const deleteUser = async (user) => {
      if (!confirm(`Are you sure you want to delete ${user.name}?`)) return
      
      try {
        await api.delete(`/users/${user.id}`)
        showSuccess('User deleted successfully')
        users.value = users.value.filter(u => u.id !== user.id)
      } catch (error) {
        showError(error.response?.data?.error || 'Failed to delete user')
      }
    }

    const handleSubmit = async () => {
      submitting.value = true
      try {
        if (showEditModal.value) {
          const updateData = {
            name: form.value.name,
            role: form.value.role
          }
          await api.put(`/users/${form.value.id}`, updateData)
          showSuccess('User updated successfully')
        } else {
          await api.post('/users', form.value)
          showSuccess('User created successfully')
        }
        await fetchUsers()
        closeModals()
      } catch (error) {
        showError(error.response?.data?.error || 'Failed to save user')
      } finally {
        submitting.value = false
      }
    }

    const closeModals = () => {
      showCreateModal.value = false
      showEditModal.value = false
      submitting.value = false
      form.value = {
        id: null,
        name: '',
        email: '',
        password: '',
        role: 'staff'
      }
    }

    onMounted(() => {
      fetchUsers()
    })

    return {
      users,
      loading,
      submitting,
      showCreateModal,
      showEditModal,
      form,
      currentUser,
      getRoleBadgeClass,
      formatDate,
      editUser,
      deleteUser,
      handleSubmit,
      closeModals
    }
  }
}
</script>

<style scoped>
.users-page {
  padding: 24px;
  max-width: 1000px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
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

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  color: white;
}

.avatar.admin { background: linear-gradient(135deg, #7367f0, #5b52d9); }
.avatar.manager { background: linear-gradient(135deg, #ff9f43, #f77e4a); }
.avatar.staff { background: linear-gradient(135deg, #00cfe8, #00a7c4); }

.fw-600 {
  font-weight: 600;
}

.card-body {
  padding: 24px;
}

.p-0 {
  padding: 0 !important;
}

.text-center {
  text-align: center;
}

.py-5 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.mb-0 {
  margin-bottom: 0 !important;
}

.spinner-border {
  width: 2rem;
  height: 2rem;
  border: 0.25em solid rgba(115, 103, 240, 0.2);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: var(--gray-500);
  transition: var(--transition);
}

.btn-icon:hover {
  color: var(--gray-700);
}

.btn-outline-danger:hover {
  color: var(--danger-color);
  border-color: var(--danger-color);
}

.text-right {
  text-align: right;
}

.empty-state svg {
  opacity: 0.4;
}

.text-muted {
  color: var(--gray-500);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
}
</style>
