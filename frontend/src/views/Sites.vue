<template>
  <AppLayout>
    <div class="sites-page">
      <div class="page-header">
        <h1 class="page-title">Site Management</h1>
        <button class="btn-primary" @click="showAddModal = true">
          + Add Site
        </button>
      </div>
      
      <div class="filters">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search sites..."
            @input="handleSearch"
          />
        </div>
      </div>
      
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else class="sites-grid">
        <div v-for="site in filteredSites" :key="site.id" class="site-card">
          <div class="site-header">
            <div class="site-avatar">{{ site.name.charAt(0).toUpperCase() }}</div>
            <div class="site-info">
              <h3>{{ site.name }}</h3>
              <span class="site-slug">{{ site.slug }}</span>
            </div>
            <span class="status-badge" :class="site.is_active ? 'active' : 'inactive'">
              {{ site.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          
          <div class="site-details">
            <div v-if="site.email" class="detail">
              <span class="icon">📧</span>
              <span>{{ site.email }}</span>
            </div>
            <div v-if="site.phone" class="detail">
              <span class="icon">📞</span>
              <span>{{ site.phone }}</span>
            </div>
            <div v-if="site.address" class="detail">
              <span class="icon">📍</span>
              <span>{{ site.address }}</span>
            </div>
          </div>
          
          <div class="site-meta">
            <span>Created: {{ formatDate(site.created_at) }}</span>
          </div>
          
          <div class="site-actions">
            <button class="btn-secondary" @click="viewSiteDetails(site)">View Details</button>
            <button class="btn-icon" @click="editSite(site)">✏️</button>
            <button class="btn-icon delete" @click="deleteSite(site.id)">🗑️</button>
          </div>
        </div>
      </div>
      
      <div v-if="!loading && !filteredSites.length" class="empty-state">
        No sites found
      </div>
      
      <!-- Add/Edit Modal -->
      <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <h2>{{ showEditModal ? 'Edit Site' : 'Add Site' }}</h2>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Site Name *</label>
              <input v-model="form.name" type="text" required />
            </div>
            <div class="form-group">
              <label>Slug *</label>
              <input v-model="form.slug" type="text" required placeholder="e.g., main-warehouse" />
              <small>Unique identifier for the site</small>
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
            <div class="form-group">
              <label>Address</label>
              <textarea v-model="form.address" rows="2"></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="closeModal">Cancel</button>
              <button type="submit" class="btn-primary">{{ showEditModal ? 'Update' : 'Create' }}</button>
            </div>
          </form>
        </div>
      </div>
      
      <!-- Site Details Modal -->
      <div v-if="showDetailsModal" class="modal-overlay" @click="showDetailsModal = false">
        <div class="modal modal-large" @click.stop>
          <h2>{{ selectedSite?.name }}</h2>
          <div class="details-grid">
            <div class="detail-item">
              <label>Slug</label>
              <span>{{ selectedSite?.slug }}</span>
            </div>
            <div class="detail-item">
              <label>Email</label>
              <span>{{ selectedSite?.email || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <label>Phone</label>
              <span>{{ selectedSite?.phone || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <label>Address</label>
              <span>{{ selectedSite?.address || 'N/A' }}</span>
            </div>
            <div class="detail-item">
              <label>Status</label>
              <span class="status-badge" :class="selectedSite?.is_active ? 'active' : 'inactive'">
                {{ selectedSite?.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="detail-item">
              <label>Created</label>
              <span>{{ formatDate(selectedSite?.created_at) }}</span>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="showDetailsModal = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import AppLayout from '../components/common/AppLayout.vue'

export default {
  name: 'Sites',
  components: { AppLayout },
  setup() {
    const store = useStore()
    
    const searchQuery = ref('')
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const showDetailsModal = ref(false)
    const editingSiteId = ref(null)
    const selectedSite = ref(null)
    
    const form = ref({
      name: '',
      slug: '',
      email: '',
      phone: '',
      address: ''
    })
    
    const sites = computed(() => store.getters['sites/allSites'])
    const loading = computed(() => store.getters['sites/sitesLoading'])
    
    const filteredSites = computed(() => {
      if (!searchQuery.value) return sites.value
      const query = searchQuery.value.toLowerCase()
      return sites.value.filter(site => 
        site.name.toLowerCase().includes(query) ||
        site.slug.toLowerCase().includes(query)
      )
    })
    
    let searchTimeout = null
    
    const handleSearch = () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
      }, 300)
    }
    
    const fetchSites = async () => {
      try {
        await store.dispatch('sites/fetchSites')
      } catch (error) {
        console.error('Failed to fetch sites:', error)
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
    
    const editSite = (site) => {
      editingSiteId.value = site.id
      form.value = {
        name: site.name,
        slug: site.slug,
        email: site.email || '',
        phone: site.phone || '',
        address: site.address || ''
      }
      showEditModal.value = true
    }
    
    const viewSiteDetails = (site) => {
      selectedSite.value = site
      showDetailsModal.value = true
    }
    
    const deleteSite = async (siteId) => {
      if (!confirm('Are you sure you want to delete this site? All data associated with this site will be lost.')) return
      try {
        await store.dispatch('sites/deleteSite', siteId)
        fetchSites()
      } catch (error) {
        alert('Failed to delete site')
      }
    }
    
    const handleSubmit = async () => {
      try {
        if (showEditModal.value) {
          await store.dispatch('sites/updateSite', {
            id: editingSiteId.value,
            data: form.value
          })
        } else {
          await store.dispatch('sites/createSite', form.value)
        }
        closeModal()
        fetchSites()
      } catch (error) {
        alert(error.response?.data?.error || error.response?.data?.detail || 'Operation failed')
      }
    }
    
    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      editingSiteId.value = null
      form.value = {
        name: '',
        slug: '',
        email: '',
        phone: '',
        address: ''
      }
    }
    
    onMounted(() => {
      fetchSites()
    })
    
    return {
      searchQuery,
      showAddModal,
      showEditModal,
      showDetailsModal,
      form,
      sites,
      loading,
      filteredSites,
      selectedSite,
      handleSearch,
      formatDate,
      editSite,
      viewSiteDetails,
      deleteSite,
      handleSubmit,
      closeModal
    }
  }
}
</script>

<style scoped>
.sites-page {
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

.btn-primary {
  padding: 12px 24px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
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

.sites-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 20px;
}

.site-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.site-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
}

.site-avatar {
  width: 50px;
  height: 50px;
  border-radius: 12px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
}

.site-info {
  flex: 1;
}

.site-info h3 {
  margin: 0;
  font-size: 18px;
  color: #1a1a2e;
}

.site-slug {
  font-size: 13px;
  color: #6b7280;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background: #d1fae5;
  color: #059669;
}

.status-badge.inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.site-details {
  margin-bottom: 16px;
}

.detail {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.detail .icon {
  font-size: 14px;
}

.site-meta {
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 16px;
}

.site-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.btn-secondary {
  padding: 8px 16px;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
}

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px 8px;
}

.btn-icon.delete:hover {
  color: #dc2626;
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
  max-width: 450px;
}

.modal-large {
  max-width: 550px;
}

.modal h2 {
  margin: 0 0 24px 0;
  font-size: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group small {
  display: block;
  font-size: 12px;
  color: #6b7280;
  margin-top: 4px;
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

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-item label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
}

.detail-item span {
  font-size: 14px;
  color: #1a1a2e;
}
</style>
