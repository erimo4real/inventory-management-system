<template>
  <AppLayout>
    <div class="clients-page">
      <div class="page-header">
        <div class="page-title-area">
          <h1 class="page-title">Clients</h1>
          <nav class="breadcrumb">
            <router-link to="/">Dashboard</router-link>
            <span class="separator">/</span>
            <span class="current">Clients</span>
          </nav>
        </div>
        <button v-if="canManage" class="btn btn-primary" @click="showAddModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Client
        </button>
      </div>
      
      <div class="row mb-4">
        <div class="col-6">
          <div class="stat-card">
            <div class="stat-icon primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>{{ stats?.total_clients || 0 }}</h3>
              <p>Total Clients</p>
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="stat-card">
            <div class="stat-icon success">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="8.5" cy="7" r="4"/>
                <line x1="20" y1="8" x2="20" y2="14"/>
                <line x1="23" y1="11" x2="17" y2="11"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>{{ stats?.new_this_month || 0 }}</h3>
              <p>New This Month</p>
            </div>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input 
              v-model="searchQuery" 
              type="text" 
              class="form-control" 
              placeholder="Search clients..."
              @input="handleSearch"
            />
          </div>
        </div>
        
        <div v-if="loading" class="card-body">
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>
        </div>
        
        <div v-else-if="clients.length" class="card-body p-0">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Company</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th v-if="canManage" class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="client in clients" :key="client.id" class="cursor-pointer" @click="viewClient(client)">
                  <td>
                    <div class="d-flex align-center gap-3">
                      <div class="avatar">
                        {{ client.name.charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <div class="fw-600">{{ client.name }}</div>
                        <div v-if="client.contact_person" class="text-muted small">{{ client.contact_person }}</div>
                      </div>
                    </div>
                  </td>
                  <td>{{ client.company_name || '-' }}</td>
                  <td>
                    <div v-if="client.email" class="small">{{ client.email }}</div>
                    <div v-if="client.phone" class="text-muted small">{{ client.phone }}</div>
                  </td>
                  <td>
                    <span v-if="client.city || client.country">
                      {{ [client.city, client.country].filter(Boolean).join(', ') }}
                    </span>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td v-if="canManage" class="text-right" @click.stop>
                    <div class="d-flex gap-2 justify-end">
                      <button class="btn btn-sm btn-outline" @click="editClient(client)" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="btn btn-sm btn-outline btn-outline-danger" @click="deleteClient(client.id)" title="Delete">
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
        
        <div v-else class="card-body">
          <div class="empty-state">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-muted mb-3">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <h4>No clients found</h4>
            <p>Get started by adding your first client</p>
            <button v-if="canManage" class="btn btn-primary" @click="showAddModal = true">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Client
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="showAddModal || showEditModal" class="modal-backdrop" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>{{ showEditModal ? 'Edit Client' : 'Add Client' }}</h3>
            <button class="btn-icon" @click="closeModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <form @submit.prevent="handleSubmit">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Name *</label>
                <input v-model="form.name" type="text" class="form-control" required />
              </div>
              <div class="form-group">
                <label class="form-label">Company Name</label>
                <input v-model="form.company_name" type="text" class="form-control" />
              </div>
              <div class="form-group">
                <label class="form-label">Contact Person</label>
                <input v-model="form.contact_person" type="text" class="form-control" />
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="form-group">
                    <label class="form-label">Email</label>
                    <input v-model="form.email" type="email" class="form-control" />
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label class="form-label">Phone</label>
                    <input v-model="form.phone" type="tel" class="form-control" />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="form-group">
                    <label class="form-label">City</label>
                    <input v-model="form.city" type="text" class="form-control" />
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label class="form-label">Country</label>
                    <input v-model="form.country" type="text" class="form-control" />
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Address</label>
                <textarea v-model="form.address" class="form-control" rows="2"></textarea>
              </div>
              <div class="form-group mb-0">
                <label class="form-label">Notes</label>
                <textarea v-model="form.notes" class="form-control" rows="2"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="submitting">
                {{ submitting ? 'Saving...' : (showEditModal ? 'Update' : 'Create') }}
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
import { useRouter } from 'vue-router'
import AppLayout from '@/shared/components/AppLayout.vue'
import { showSuccess, showError } from '@/shared/components/ToastContainer.vue'

export default {
  name: 'Clients',
  components: { AppLayout },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const searchQuery = ref('')
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const editingClientId = ref(null)
    const stats = ref(null)
    const submitting = ref(false)
    
    const form = ref({
      name: '',
      company_name: '',
      contact_person: '',
      email: '',
      phone: '',
      city: '',
      country: '',
      address: '',
      notes: ''
    })
    
    const clients = computed(() => store.getters['clients/allClients'])
    const loading = computed(() => store.getters['clients/clientsLoading'])
    const currentUser = computed(() => store.getters['auth/currentUser'])
    const canManage = computed(() => ['admin', 'manager'].includes(currentUser.value?.role))
    
    let searchTimeout = null
    
    const handleSearch = () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        fetchClients()
      }, 300)
    }
    
    const fetchClients = () => {
      store.dispatch('clients/fetchClients', {
        search: searchQuery.value || undefined
      })
    }
    
    const fetchStats = async () => {
      try {
        stats.value = await store.dispatch('clients/fetchClientStats')
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }
    
    const viewClient = (client) => {
      router.push(`/clients/${client.id}`)
    }
    
    const editClient = (client) => {
      editingClientId.value = client.id
      form.value = {
        name: client.name,
        company_name: client.company_name || '',
        contact_person: client.contact_person || '',
        email: client.email || '',
        phone: client.phone || '',
        city: client.city || '',
        country: client.country || '',
        address: client.address || '',
        notes: client.notes || ''
      }
      showEditModal.value = true
    }
    
    const deleteClient = async (clientId) => {
      if (!confirm('Are you sure you want to delete this client?')) return
      try {
        await store.dispatch('clients/deleteClient', clientId)
        showSuccess('Client deleted successfully')
        fetchStats()
      } catch (error) {
        showError('Failed to delete client')
      }
    }
    
    const handleSubmit = async () => {
      submitting.value = true
      try {
        if (showEditModal.value) {
          await store.dispatch('clients/updateClient', {
            id: editingClientId.value,
            data: form.value
          })
          showSuccess('Client updated successfully')
        } else {
          await store.dispatch('clients/createClient', form.value)
          showSuccess('Client created successfully')
        }
        closeModal()
        fetchClients()
        fetchStats()
      } catch (error) {
        showError(error.response?.data?.error || error.response?.data?.detail || 'Operation failed')
      } finally {
        submitting.value = false
      }
    }
    
    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      editingClientId.value = null
      submitting.value = false
      form.value = {
        name: '',
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        city: '',
        country: '',
        address: '',
        notes: ''
      }
    }
    
    onMounted(() => {
      fetchClients()
      fetchStats()
    })
    
    return {
      searchQuery,
      showAddModal,
      showEditModal,
      form,
      clients,
      loading,
      stats,
      canManage,
      submitting,
      handleSearch,
      viewClient,
      editClient,
      deleteClient,
      handleSubmit,
      closeModal
    }
  }
}
</script>

<style scoped>
.clients-page {
  padding: 24px;
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
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  flex-shrink: 0;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box svg {
  position: absolute;
  left: 14px;
  color: var(--gray-400);
  pointer-events: none;
}

.search-box .form-control {
  padding-left: 44px;
  width: 300px;
}

.card-header {
  flex-direction: row;
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

.fw-600 {
  font-weight: 600;
}

.small {
  font-size: 13px;
}

.py-5 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.p-0 {
  padding: 0 !important;
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

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-state svg {
  opacity: 0.4;
}

.empty-state h4 {
  font-size: 18px;
  margin-bottom: 8px;
  color: var(--gray-800);
}

.empty-state p {
  color: var(--gray-500);
  margin-bottom: 20px;
}

.text-right {
  text-align: right;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .search-box .form-control {
    width: 100%;
  }
}
</style>
