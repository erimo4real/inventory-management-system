<template>
  <AppLayout>
    <div class="vendors-page">
      <div class="page-header">
        <h1 class="page-title">Vendors</h1>
        <button v-if="canManage" class="btn-primary" @click="showAddModal = true">
          + Add Vendor
        </button>
      </div>
      
      <div class="stats-row">
        <div class="stat-card">
          <span class="stat-number">{{ stats?.total_vendors || 0 }}</span>
          <span class="stat-label">Total Vendors</span>
        </div>
        <div class="stat-card">
          <span class="stat-number">{{ stats?.total_categories || 0 }}</span>
          <span class="stat-label">Categories</span>
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
            placeholder="Search vendors..."
            @input="handleSearch"
          />
        </div>
        <select v-model="categoryFilter" class="category-filter" @change="fetchVendors">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
      </div>
      
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else class="vendors-grid">
        <div v-for="vendor in vendors" :key="vendor.id" class="vendor-card" @click="viewVendor(vendor)">
          <div class="vendor-avatar">
            {{ vendor.name.charAt(0).toUpperCase() }}
          </div>
          <div class="vendor-info">
            <h3>{{ vendor.name }}</h3>
            <p v-if="vendor.company_name" class="company">{{ vendor.company_name }}</p>
            <span v-if="vendor.category" class="category-badge">{{ vendor.category }}</span>
            <div class="vendor-meta">
              <span v-if="vendor.email">📧 {{ vendor.email }}</span>
              <span v-if="vendor.phone">📞 {{ vendor.phone }}</span>
            </div>
          </div>
          <div class="vendor-actions" v-if="canManage" @click.stop>
            <button class="btn-icon" @click="editVendor(vendor)">✏️</button>
            <button class="btn-icon" @click="deleteVendor(vendor.id)">🗑️</button>
          </div>
        </div>
      </div>
      
      <div v-if="!loading && !vendors.length" class="empty-state">
        No vendors found
      </div>
      
      <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <h2>{{ showEditModal ? 'Edit Vendor' : 'Add Vendor' }}</h2>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Name *</label>
              <input v-model="form.name" type="text" required />
            </div>
            <div class="form-group">
              <label>Company Name</label>
              <input v-model="form.company_name" type="text" />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Category</label>
                <input v-model="form.category" type="text" placeholder="e.g., Electronics, Raw Materials" />
              </div>
              <div class="form-group">
                <label>Tax ID</label>
                <input v-model="form.tax_id" type="text" />
              </div>
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
        fetchStats()
      } catch (error) {
        alert('Failed to delete vendor')
      }
    }
    
    const handleSubmit = async () => {
      try {
        if (showEditModal.value) {
          await store.dispatch('vendors/updateVendor', {
            id: editingVendorId.value,
            data: form.value
          })
        } else {
          await store.dispatch('vendors/createVendor', form.value)
        }
        closeModal()
        fetchVendors()
        fetchStats()
        fetchCategories()
      } catch (error) {
        alert(error.response?.data?.error || error.response?.data?.detail || 'Operation failed')
      }
    }
    
    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      editingVendorId.value = null
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
  color: #f5576c;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

.btn-primary {
  padding: 12px 24px;
  background: #f5576c;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background: #e54558;
}

.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.search-box input {
  width: 300px;
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

.category-filter {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  min-width: 150px;
}

.vendors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.vendor-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  display: flex;
  gap: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.vendor-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  transform: translateY(-2px);
}

.vendor-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f5576c 0%, #f5576c 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 600;
  flex-shrink: 0;
}

.vendor-info {
  flex: 1;
  min-width: 0;
}

.vendor-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 4px 0;
}

.vendor-info .company {
  font-size: 14px;
  color: #6b7280;
  margin: 0 0 8px 0;
}

.category-badge {
  display: inline-block;
  padding: 4px 10px;
  background: #ffe4e6;
  color: #f5576c;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-bottom: 8px;
}

.vendor-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 13px;
  color: #6b7280;
}

.vendor-actions {
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
  border-color: #f5576c;
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
