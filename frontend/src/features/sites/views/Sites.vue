<template>
  <AppLayout>
    <div class="sites-page">
      <div class="page-header">
        <div class="page-title-area">
          <h1 class="page-title">Site Management</h1>
          <nav class="breadcrumb">
            <router-link to="/">Dashboard</router-link>
            <span class="separator">/</span>
            <span class="current">Sites</span>
          </nav>
        </div>
        <button class="btn btn-primary" @click="showAddModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Site
        </button>
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
              placeholder="Search sites..."
              @input="handleSearch"
            />
          </div>
        </div>
        
        <div v-if="loading" class="card-body text-center py-5">
          <div class="spinner-border text-primary"></div>
        </div>
        
        <div v-else-if="filteredSites.length" class="card-body p-0">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Site</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="site in filteredSites" :key="site.id">
                  <td>
                    <div class="d-flex align-center gap-3">
                      <img v-if="site.logo_url" :src="site.logo_url" alt="" class="entity-thumb" style="border-radius:50%" />
                      <div v-else class="entity-thumb entity-thumb-placeholder" style="border-radius:50%">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                      </div>
                      <div>
                        <div class="fw-600">{{ site.name }}</div>
                        <div class="text-muted small">{{ site.slug }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div v-if="site.email || site.phone">
                      <div v-if="site.email" class="d-flex align-center gap-2 small">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                          <polyline points="22,6 12,13 2,6"/>
                        </svg>
                        {{ site.email }}
                      </div>
                      <div v-if="site.phone" class="d-flex align-center gap-2 small text-muted">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                        </svg>
                        {{ site.phone }}
                      </div>
                    </div>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td>
                    <span class="badge" :class="site.is_active ? 'badge-success' : 'badge-secondary'">
                      {{ site.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="text-muted">{{ formatDate(site.created_at) }}</td>
                  <td class="text-right">
                    <div class="d-flex gap-2 justify-end">
                      <button class="btn btn-sm btn-outline" @click="viewSiteDetails(site)" title="View">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                      <button class="btn btn-sm btn-outline" @click="editSite(site)" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="btn btn-sm btn-outline btn-outline-danger" @click="deleteSite(site.id)" title="Delete">
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
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <h4>No sites found</h4>
          <p class="text-muted">Get started by adding your first site</p>
          <button class="btn btn-primary" @click="showAddModal = true">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add Site
          </button>
        </div>
      </div>
      
      <div v-if="showAddModal || showEditModal" class="modal-backdrop" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>{{ showEditModal ? 'Edit Site' : 'Add Site' }}</h3>
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
                <label class="form-label">Site Name *</label>
                <input v-model="form.name" type="text" class="form-control" required />
              </div>
              <div class="form-group">
                <label class="form-label">Slug *</label>
                <input v-model="form.slug" type="text" class="form-control" required placeholder="e.g., main-warehouse" />
                <small class="text-muted">Unique identifier for the site</small>
              </div>
              <div class="form-group">
                <label class="form-label">Logo</label>
                <div class="entity-image-upload" @click="$refs.siteLogoInput.click()">
                  <img v-if="form.logo_url" :src="form.logo_url" alt="" class="entity-image-preview" />
                  <div v-else class="entity-image-placeholder">
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
                    <span>Click to upload</span>
                  </div>
                  <input ref="siteLogoInput" type="file" accept="image/jpeg,image/png,image/gif,image/webp" style="display:none" @change="handleImageSelect" />
                </div>
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
              <div class="form-group mb-0">
                <label class="form-label">Address</label>
                <textarea v-model="form.address" class="form-control" rows="2"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-primary">{{ showEditModal ? 'Update' : 'Create' }}</button>
            </div>
          </form>
        </div>
      </div>
      
      <div v-if="showDetailsModal" class="modal-backdrop" @click="showDetailsModal = false">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>{{ selectedSite?.name }}</h3>
            <button class="btn-icon" @click="showDetailsModal = false">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="details-grid">
              <div class="detail-item">
                <label>Slug</label>
                <span class="fw-600">{{ selectedSite?.slug }}</span>
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
                <span class="badge" :class="selectedSite?.is_active ? 'badge-success' : 'badge-secondary'">
                  {{ selectedSite?.is_active ? 'Active' : 'Inactive' }}
                </span>
              </div>
              <div class="detail-item">
                <label>Created</label>
                <span>{{ formatDate(selectedSite?.created_at) }}</span>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-outline" @click="showDetailsModal = false">Close</button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import AppLayout from '@/shared/components/AppLayout.vue'
import { showConfirm } from '@/shared/components/ConfirmDialog.vue'
import api from '@/shared/services/api'
import { showSuccess, showError } from '@/shared/components/ToastContainer.vue'

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
    
    const imageFile = ref(null)

    const form = ref({
      name: '',
      slug: '',
      email: '',
      phone: '',
      address: '',
      logo_url: ''
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
    
    const handleSearch = () => {
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
      imageFile.value = null
      form.value = {
        name: site.name,
        slug: site.slug,
        email: site.email || '',
        phone: site.phone || '',
        address: site.address || '',
        logo_url: site.logo_url || ''
      }
      showEditModal.value = true
    }
    
    const viewSiteDetails = (site) => {
      selectedSite.value = site
      showDetailsModal.value = true
    }
    
    const deleteSite = async (siteId) => {
      const ok = await showConfirm('Are you sure you want to delete this site? All data associated with this site will be lost.')
      if (!ok) return
      try {
        await store.dispatch('sites/deleteSite', siteId)
        showSuccess('Site deleted successfully')
        fetchSites()
      } catch (error) {
        showError('Failed to delete site')
      }
    }
    
    const handleImageSelect = (e) => {
      const file = e.target.files[0]
      if (!file) return
      if (file.size > 5 * 1024 * 1024) {
        showError('Image must be under 5MB')
        return
      }
      if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
        showError('Image must be JPEG, PNG, GIF, or WebP')
        return
      }
      imageFile.value = file
      const reader = new FileReader()
      reader.onload = (ev) => { form.value.logo_url = ev.target.result }
      reader.readAsDataURL(file)
    }

    const handleSubmit = async () => {
      try {
        if (showEditModal.value) {
          if (imageFile.value) {
            const fd = new FormData()
            fd.append('image', imageFile.value)
            const res = await api.put(`/sites/${editingSiteId.value}/logo`, fd, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            form.value.logo_url = res.data.url
          }
          await store.dispatch('sites/updateSite', {
            id: editingSiteId.value,
            data: form.value
          })
          showSuccess('Site updated successfully')
        } else {
          const newSite = await store.dispatch('sites/createSite', form.value)
          if (imageFile.value) {
            const fd = new FormData()
            fd.append('image', imageFile.value)
            const res = await api.put(`/sites/${newSite.id}/logo`, fd, {
              headers: { 'Content-Type': 'multipart/form-data' }
            })
            await store.dispatch('sites/updateSite', {
              id: newSite.id,
              data: { logo_url: res.data.url }
            })
          }
          showSuccess('Site created successfully')
        }
        closeModal()
        fetchSites()
      } catch (error) {
        showError(error.response?.data?.error || error.response?.data?.detail || 'Operation failed')
      }
    }
    
    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      editingSiteId.value = null
      imageFile.value = null
      form.value = {
        name: '',
        slug: '',
        email: '',
        phone: '',
        address: '',
        logo_url: ''
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
      handleImageSelect,
      handleSubmit,
      closeModal
    }
  }
}
</script>

<style scoped>
.sites-page {
  padding: 24px;
  max-width: 1200px;
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

.avatar {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-color), var(--primary-dark));
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  flex-shrink: 0;
}

.fw-600 {
  font-weight: 600;
}

.small {
  font-size: 13px;
}

.card-body {
  padding: 24px;
}

.p-0 {
  padding: 0 !important;
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

.details-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.detail-item label {
  font-size: 12px;
  color: var(--gray-500);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: block;
  margin-bottom: 4px;
}

.detail-item span {
  font-size: 14px;
  color: var(--gray-800);
}

.text-muted {
  color: var(--gray-500);
}

.mb-3 {
  margin-bottom: 1rem;
}

.text-right {
  text-align: right;
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

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .search-box .form-control {
    width: 100%;
  }
  
  .details-grid {
    grid-template-columns: 1fr;
  }
}
</style>
