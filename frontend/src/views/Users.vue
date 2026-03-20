<template>
  <AppLayout>
    <div class="users-page">
      <div class="page-header">
        <h1>User Management</h1>
        <button class="btn-primary" @click="showCreateModal = true">
          + Add User
        </button>
      </div>

      <!-- Users Table -->
      <div class="card">
        <table class="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users" :key="user.id">
              <td>
                <div class="user-cell">
                  <div class="avatar-small" :class="user.role">
                    {{ user.name?.charAt(0).toUpperCase() }}
                  </div>
                  <span>{{ user.name }}</span>
                </div>
              </td>
              <td>{{ user.email }}</td>
              <td>
                <span class="role-badge" :class="user.role">{{ user.role }}</span>
              </td>
              <td>{{ formatDate(user.created_at) }}</td>
              <td>
                <div class="actions">
                  <button class="btn-icon" @click="editUser(user)" title="Edit">
                    ✏️
                  </button>
                  <button 
                    class="btn-icon delete" 
                    @click="deleteUser(user)" 
                    title="Delete"
                    :disabled="user.id === currentUser?.id"
                  >
                    🗑️
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p v-if="users.length === 0" class="no-data">No users found</p>
      </div>

      <!-- Create/Edit Modal -->
      <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click.self="closeModals">
        <div class="modal">
          <h2>{{ showEditModal ? 'Edit User' : 'Create User' }}</h2>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Name</label>
              <input v-model="form.name" type="text" required />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="form.email" type="email" required />
            </div>
            <div class="form-group" v-if="!showEditModal">
              <label>Password</label>
              <input v-model="form.password" type="password" required minlength="6" />
            </div>
            <div class="form-group">
              <label>Role</label>
              <select v-model="form.role" required>
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="closeModals">
                Cancel
              </button>
              <button type="submit" class="btn-primary" :disabled="loading">
                {{ loading ? 'Saving...' : 'Save' }}
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
import AppLayout from '../components/common/AppLayout.vue'
import { usersAPI } from '../services/api'

export default {
  name: 'Users',
  components: { AppLayout },
  setup() {
    const store = useStore()
    const users = ref([])
    const loading = ref(false)
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

    const fetchUsers = async () => {
      loading.value = true
      try {
        const response = await usersAPI.getAll()
        users.value = response.data
      } catch (error) {
        console.error('Failed to fetch users:', error)
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
        await usersAPI.delete(user.id)
        users.value = users.value.filter(u => u.id !== user.id)
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to delete user')
      }
    }

    const handleSubmit = async () => {
      loading.value = true
      try {
        if (showEditModal.value) {
          const updateData = {
            name: form.value.name,
            role: form.value.role
          }
          await usersAPI.update(form.value.id, updateData)
        } else {
          await usersAPI.create(form.value)
        }
        await fetchUsers()
        closeModals()
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to save user')
      } finally {
        loading.value = false
      }
    }

    const closeModals = () => {
      showCreateModal.value = false
      showEditModal.value = false
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
      showCreateModal,
      showEditModal,
      form,
      currentUser,
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
  max-width: 1000px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h1 {
  margin: 0;
  font-size: 24px;
  color: #1a1a2e;
}

.btn-primary {
  padding: 10px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary:hover {
  background: #4338ca;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.users-table th {
  font-size: 12px;
  font-weight: 600;
  color: #666;
  text-transform: uppercase;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar-small {
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

.avatar-small.admin { background: #667eea; }
.avatar-small.manager { background: #f5576c; }
.avatar-small.staff { background: #4facfe; }

.role-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.role-badge.admin { background: #eef2ff; color: #667eea; }
.role-badge.manager { background: #ffe4e6; color: #f5576c; }
.role-badge.staff { background: #e0f2fe; color: #0891b2; }

.actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  padding: 6px 10px;
  background: #f5f7fa;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-icon.delete:hover {
  background: #fee2e2;
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.no-data {
  text-align: center;
  color: #666;
  padding: 40px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 12px;
  padding: 24px;
  width: 400px;
  max-width: 90%;
}

.modal h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #1a1a2e;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #1a1a2e;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4f46e5;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}

.btn-secondary {
  padding: 10px 20px;
  background: #f5f7fa;
  color: #1a1a2e;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #e5e7eb;
}
</style>
