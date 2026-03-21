<template>
  <AppLayout>
    <div class="vendors-page">
      <div class="page-header">
        <div class="page-title-area">
          <h1 class="page-title">Vendors</h1>
          <nav class="breadcrumb">
            <router-link to="/">Dashboard</router-link>
            <span class="separator">/</span>
            <span class="current">Vendors</span>
          </nav>
        </div>
        <button v-if="canManage" class="btn btn-primary" @click="showAddModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Vendor
        </button>
      </div>
      
      <div class="row mb-4">
        <div class="col-4">
          <div class="stat-card">
            <div class="stat-icon" style="background: rgba(245, 87, 108, 0.1); color: #f5576c;">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="1" y="3" width="15" height="13"/>
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>{{ stats?.total_vendors || 0 }}</h3>
              <p>Total Vendors</p>
            </div>
          </div>
        </div>
        <div class="col-4">
          <div class="stat-card">
            <div class="stat-icon warning">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div class="stat-info">
              <h3>{{ stats?.total_categories || 0 }}</h3>
              <p>Categories</p>
            </div>
          </div>
        </div>
        <div class="col-4">
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
          <div class="d-flex gap-3">
            <div class="search-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input 
                v-model="searchQuery" 
                type="text" 
                class="form-control" 
                placeholder="Search vendors..."
                @input="handleSearch"
              />
            </div>
            <select v-model="categoryFilter" class="form-control" style="width: 180px;" @change="fetchVendors">
              <option value="">All Categories</option>
              <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
        </div>
        
        <div v-if="loading" class="card-body">
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>
        </div>
        
        <div v-else-if="vendors.length" class="card-body p-0">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>Vendor</th>
                  <th>Category</th>
                  <th>Contact</th>
                  <th>Location</th>
                  <th v-if="canManage" class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="vendor in vendors" :key="vendor.id" class="cursor-pointer" @click="viewVendor(vendor)">
                  <td>
                    <div class="d-flex align-center gap-3">
                      <div class="avatar" style="background: linear-gradient(135deg, #f5576c, #e54558);">
                        {{ vendor.name.charAt(0).toUpperCase() }}
                      </div>
                      <div>
                        <div class="fw-600">{{ vendor.name }}</div>
                        <div v-if="vendor.company_name" class="text-muted small">{{ vendor.company_name }}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span v-if="vendor.category" class="badge badge-danger">{{ vendor.category }}</span>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td>
                    <div v-if="vendor.email" class="small d-flex align-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      {{ vendor.email }}
                    </div>
                    <div v-if="vendor.phone" class="text-muted small d-flex align-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      {{ vendor.phone }}
                    </div>
                  </td>
                  <td>
                    <span v-if="vendor.city || vendor.country">
                      {{ [vendor.city, vendor.country].filter(Boolean).join(', ') }}
                    </span>
                    <span v-else class="text-muted">-</span>
                  </td>
                  <td v-if="canManage" class="text-right" @click.stop>
                    <div class="d-flex gap-2 justify-end">
                      <button class="btn btn-sm btn-outline" @click="editVendor(vendor)" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="btn btn-sm btn-outline btn-outline-danger" @click="deleteVendor(vendor.id)" title="Delete">
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
              <rect x="1" y="3" width="15" height="13"/>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
              <circle cx="5.5" cy="18.5" r="2.5"/>
              <circle cx="18.5" cy="18.5" r="2.5"/>
            </svg>
            <h4>No vendors found</h4>
            <p>Get started by adding your first vendor</p>
            <button v-if="canManage" class="btn btn-primary" @click="showAddModal = true">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Vendor
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="showAddModal || showEditModal" class="modal-backdrop" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>{{ showEditModal ? 'Edit Vendor' : 'Add Vendor' }}</h3>
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
              <div class="row">
                <div class="col-6">
                  <div class="form-group">
                    <label class="form-label">Category</label>
                    <input v-model="form.category" type="text" class="form-control" placeholder="e.g., Electronics" />
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label class="form-label">Tax ID</label>
                    <input v-model="form.tax_id" type="text" class="form-control" />
                  </div>
                </div>
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
  name: 'Vendors',
  components: { AppLayout },
  setup() {
    const store = useStore()
    const router = useRouter()
    
    const searchQuery = ref('')
    const categoryFilter = ref('')
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const editingVendorId = ref(null)
    const stats = ref(null)
    const categories = ref([])
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
      category: '',
      tax_id: '',
      notes: ''
    })
    
    const vendors = computed(() => store.getters['vendors/allVendors'])
    const loading = computed(() => store.getters['vendors/vendorsLoading'])
    const currentUser = computed(() => store.getters['auth/currentUser'])
    const canManage = computed(() => ['admin', 'manager'].includes(currentUser.value?.role))
    
    let searchTimeout = null
    
    const handleSearch = () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        fetchVendors()
      }, 300)
    }
    
    const fetchVendors = () => {
      store.dispatch('vendors/fetchVendors', {
        search: searchQuery.value || undefined,
        category: categoryFilter.value || undefined
      })
    }
    
    const fetchStats = async () => {
      try {
        stats.value = await store.dispatch('vendors/fetchVendorStats')
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }
    
    const fetchCategories = async () => {
      try {
        categories.value = await store.dispatch('vendors/fetchVendorCategories')
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }
    
    const viewVendor = (vendor) => {
      router.push(`/vendors/${vendor.id}`)
    }
    
    const editVendor = (vendor) => {
      editingVendorId.value = vendor.id
      form.value = {
        name: vendor.name,
        company_name: vendor.company_name || '',
        contact_person: vendor.contact_person || '',
        email: vendor.email || '',
        phone: vendor.phone || '',
        city: vendor.city || '',
        country: vendor.country || '',
        address: vendor.address || '',
        category: vendor.category || '',
        tax_id: vendor.tax_id || '',
        notes: vendor.notes || ''
      }
      showEditModal.value = true
    }
    
    const deleteVendor = async (vendorId) => {
      if (!confirm('Are you sure you want to delete this vendor?')) return
      try {
        await store.dispatch('vendors/deleteVendor', vendorId)
        showSuccess('Vendor deleted successfully')
        fetchStats()
      } catch (error) {
        showError('Failed to delete vendor')
      }
    }
    
    const handleSubmit = async () => {
      submitting.value = true
      try {
        if (showEditModal.value) {
          await store.dispatch('vendors/updateVendor', {
            id: editingVendorId.value,
            data: form.value
          })
          showSuccess('Vendor updated successfully')
        } else {
          await store.dispatch('vendors/createVendor', form.value)
          showSuccess('Vendor created successfully')
        }
        closeModal()
        fetchVendors()
        fetchStats()
        fetchCategories()
      } catch (error) {
        showError(error.response?.data?.error || error.response?.data?.detail || 'Operation failed')
      } finally {
        submitting.value = false
      }
    }
    
    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      editingVendorId.value = null
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
        category: '',
        tax_id: '',
        notes: ''
      }
    }
    
    onMounted(() => {
      fetchVendors()
      fetchStats()
      fetchCategories()
    })
    
    return {
      searchQuery,
      categoryFilter,
      showAddModal,
      showEditModal,
      form,
      vendors,
      loading,
      stats,
      categories,
      canManage,
      submitting,
      handleSearch,
      viewVendor,
      editVendor,
      deleteVendor,
      handleSubmit,
      closeModal,
      fetchVendors
    }
  }
}
</script>

<style scoped>
.vendors-page {
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
  width: 250px;
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
