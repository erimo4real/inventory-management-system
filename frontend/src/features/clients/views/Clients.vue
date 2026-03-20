<template>
  <AppLayout>
    <div class="clients-page">
      <div class="page-header">
        <h1 class="page-title">Clients</h1>
        <button v-if="canManage" class="btn-primary" @click="showAddModal = true">
          + Add Client
        </button>
      </div>
      
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-number">{{ stats?.total_clients || 0 }}</span>
          <span class="stat-label">Total Clients</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">{{ stats?.new_this_month || 0 }}</span>
          <span class="stat-label">New This Month</span>
        </div>
      </div>
      
      <div class="filters">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search clients..."
            @input="handleSearch"
          />
        </div>
      </div>
      
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else class="clients-grid">
        <div v-for="client in clients" :key="client.id" class="client-card" @click="viewClient(client)">
          <div class="client-avatar">
            {{ client.name.charAt(0).toUpperCase() }}
          </div>
          <div class="client-info">
            <h3>{{ client.name }}</h3>
            <p v-if="client.company_name" class="company">{{ client.company_name }}</p>
            <div class="client-meta">
              <span v-if="client.email">📧 {{ client.email }}</span>
              <span v-if="client.phone">📞 {{ client.phone }}</span>
            </div>
          </div>
          <div class="client-actions" v-if="canManage" @click.stop>
            <button class="btn-icon" @click="editClient(client)">✏️</button>
            <button class="btn-icon" @click="deleteClient(client.id)">🗑️</button>
          </div>
        </div>
      </div>
      
      <div v-if="!loading && !clients.length" class="empty-state">
        No clients found
      </div>
      
      <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <h2>{{ showEditModal ? 'Edit Client' : 'Add Client' }}</h2>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Name *</label>
              <input v-model="form.name" type="text" required />
            </div>
            <div class="form-group">
              <label>Company Name</label>
              <input v-model="form.company_name" type="text" />
            </div>
            <div class="form-group">
              <label>Contact Person</label>
              <input v-model="form.contact_person" type="text" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Email</label>
                <input v-model="form.email" type="email" />
              </div>
              <div class="form-group">
                <label>Phone</label>
                <input v-model="form.phone" type="tel" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>City</label>
                <input v-model="form.city" type="text" />
              </div>
              <div class="form-group">
                <label>Country</label>
                <input v-model="form.country" type="text" />
              </div>
            </div>
            <div class="form-group">
              <label>Address</label>
              <textarea v-model="form.address" rows="2"></textarea>
            </div>
            <div class="form-group">
              <label>Notes</label>
              <textarea v-model="form.notes" rows="2"></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="closeModal">Cancel</button>
              <button type="submit" class="btn-primary">{{ showEditModal ? 'Update' : 'Create' }}</button>
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
        fetchStats()
      } catch (error) {
        alert('Failed to delete client')
      }
    }
    
    const handleSubmit = async () => {
      try {
        if (showEditModal.value) {
          await store.dispatch('clients/updateClient', {
            id: editingClientId.value,
            data: form.value
          })
        } else {
          await store.dispatch('clients/createClient', form.value)
        }
        closeModal()
        fetchClients()
        fetchStats()
      } catch (error) {
        alert(error.response?.data?.error || error.response?.data?.detail || 'Operation failed')
      }
    }
    
    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      editingClientId.value = null
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
  max-width: 1200px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
}

.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 20px 32px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stat-number {
  font-size: 32px;
  font-weight: 700;
  color: #4f46e5;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

.btn-primary {
  padding: 12px 24px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #4338ca;
}

.filters {
  margin-bottom: 24px;
}

.search-box input {
  width: 300px;
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

.clients-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.client-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.client-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}

.client-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  flex-shrink: 0;
}

.client-info {
  flex: 1;
  min-width: 0;
}

.client-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 4px 0;
}

.client-info .company {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.client-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: #6b7280;
}

.client-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
}

.loading, .empty-state {
  text-align: center;
  padding: 48px;
  color: #6b7280;
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
  padding: 32px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal h2 {
  margin-bottom: 24px;
  font-size: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4f46e5;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-secondary {
  padding: 10px 20px;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #e5e7eb;
}
</style>
