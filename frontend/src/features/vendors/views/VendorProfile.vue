<template>
  <div class="vendor-profile-page">
    <div class="back-link">
      <router-link to="/vendors" class="back-btn">← Back to Vendors</router-link>
    </div>
    
    <div v-if="loading" class="loading">Loading...</div>
    
    <div v-else-if="vendor" class="profile-content">
      <div class="profile-header-card">
        <div class="avatar-large">
          {{ vendor.name.charAt(0).toUpperCase() }}
        </div>
        <div class="header-info">
          <h1>{{ vendor.name }}</h1>
          <p v-if="vendor.company_name" class="company">{{ vendor.company_name }}</p>
          <div class="badges">
            <span v-if="vendor.category" class="category-badge">{{ vendor.category }}</span>
            <span class="status-badge" :class="vendor.is_active ? 'active' : 'inactive'">
              {{ vendor.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>
        </div>
        <div class="header-actions" v-if="canManage">
          <button class="btn-secondary" @click="openEditModal">Edit Profile</button>
        </div>
      </div>
      
      <div class="info-grid">
        <div class="info-card">
          <h3>Contact Information</h3>
          <div class="info-list">
            <div class="info-item" v-if="vendor.contact_person">
              <span class="label">Contact Person</span>
              <span class="value">{{ vendor.contact_person }}</span>
            </div>
            <div class="info-item" v-if="vendor.email">
              <span class="label">Email</span>
              <span class="value">{{ vendor.email }}</span>
            </div>
            <div class="info-item" v-if="vendor.phone">
              <span class="label">Phone</span>
              <span class="value">{{ vendor.phone }}</span>
            </div>
          </div>
        </div>
        
        <div class="info-card">
          <h3>Location</h3>
          <div class="info-list">
            <div class="info-item" v-if="vendor.address">
              <span class="label">Address</span>
              <span class="value">{{ vendor.address }}</span>
            </div>
            <div class="info-item" v-if="vendor.city">
              <span class="label">City</span>
              <span class="value">{{ vendor.city }}</span>
            </div>
            <div class="info-item" v-if="vendor.country">
              <span class="label">Country</span>
              <span class="value">{{ vendor.country }}</span>
            </div>
          </div>
        </div>
        
        <div class="info-card">
          <h3>Business Details</h3>
          <div class="info-list">
            <div class="info-item" v-if="vendor.category">
              <span class="label">Category</span>
              <span class="value">{{ vendor.category }}</span>
            </div>
            <div class="info-item" v-if="vendor.tax_id">
              <span class="label">Tax ID</span>
              <span class="value">{{ vendor.tax_id }}</span>
            </div>
          </div>
        </div>
        
        <div class="info-card full-width" v-if="vendor.notes">
          <h3>Notes</h3>
          <p class="notes">{{ vendor.notes }}</p>
        </div>
        
        <div class="info-card full-width">
          <h3>Account Details</h3>
          <div class="info-list">
            <div class="info-item">
              <span class="label">Vendor ID</span>
              <span class="value">#{{ vendor.id }}</span>
            </div>
            <div class="info-item">
              <span class="label">Created</span>
              <span class="value">{{ formatDate(vendor.created_at) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Last Updated</span>
              <span class="value">{{ formatDate(vendor.updated_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="showEditModal" class="modal-overlay" @click="closeEditModal">
      <div class="modal" @click.stop>
        <h2>Edit Vendor</h2>
        <form @submit.prevent="handleUpdate">
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
              <input v-model="form.category" type="text" />
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
            <textarea v-model="form.notes" rows="3"></textarea>
          </div>
          <div class="modal-actions">
            <button type="button" class="btn-secondary" @click="closeEditModal">Cancel</button>
            <button type="submit" class="btn-primary">Update</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import AppLayout from '@/shared/components/AppLayout.vue'

export default {
  name: 'VendorProfile',
  components: { AppLayout },
  setup() {
    const store = useStore()
    const route = useRoute()
    
    const vendor = ref(null)
    const loading = ref(false)
    const showEditModal = ref(false)
    
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
    
    const currentUser = computed(() => store.getters['auth/currentUser'])
    const canManage = computed(() => ['admin', 'manager'].includes(currentUser.value?.role))
    
    const fetchVendor = async () => {
      loading.value = true
      try {
        vendor.value = await store.dispatch('vendors/fetchVendor', route.params.id)
      } catch (error) {
        console.error('Failed to fetch vendor:', error)
      } finally {
        loading.value = false
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
    
    const openEditModal = () => {
      form.value = {
        name: vendor.value.name,
        company_name: vendor.value.company_name || '',
        contact_person: vendor.value.contact_person || '',
        email: vendor.value.email || '',
        phone: vendor.value.phone || '',
        city: vendor.value.city || '',
        country: vendor.value.country || '',
        address: vendor.value.address || '',
        category: vendor.value.category || '',
        tax_id: vendor.value.tax_id || '',
        notes: vendor.value.notes || ''
      }
      showEditModal.value = true
    }
    
    const closeEditModal = () => {
      showEditModal.value = false
    }
    
    const handleUpdate = async () => {
      try {
        await store.dispatch('vendors/updateVendor', {
          id: route.params.id,
          data: form.value
        })
        closeEditModal()
        fetchVendor()
      } catch (error) {
        alert(error.response?.data?.error || error.response?.data?.detail || 'Update failed')
      }
    }
    
    onMounted(() => {
      fetchVendor()
    })
    
    return {
      vendor,
      loading,
      showEditModal,
      form,
      canManage,
      formatDate,
      openEditModal,
      closeEditModal,
      handleUpdate
    }
  }
}
</script>

<style scoped>
.vendor-profile-page {
  max-width: 1000px;
}

.back-link {
  margin-bottom: 24px;
}

.back-btn {
  color: #f5576c;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
}

.back-btn:hover {
  text-decoration: underline;
}

.loading {
  text-align: center;
  padding: 48px;
  color: #6b7280;
}

.profile-header-card {
  background: white;
  border-radius: 16px;
  padding: 32px;
  display: flex;
  align-items: center;
  gap: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  margin-bottom: 24px;
}

.avatar-large {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, #f5576c 0%, #f5576c 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
  font-weight: 600;
  flex-shrink: 0;
}

.header-info {
  flex: 1;
}

.header-info h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #1a1a2e;
}

.header-info .company {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #6b7280;
}

.badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.category-badge {
  display: inline-block;
  padding: 4px 12px;
  background: #ffe4e6;
  color: #f5576c;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge {
  display: inline-block;
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

.header-actions {
  display: flex;
  gap: 12px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}

.info-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.info-card.full-width {
  grid-column: 1 / -1;
}

.info-card h3 {
  margin: 0 0 20px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
  padding-bottom: 12px;
  border-bottom: 1px solid #f0f0f0;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item .value {
  font-size: 15px;
  color: #1a1a2e;
  font-weight: 500;
}

.notes {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin: 0;
}

.btn-primary {
  padding: 10px 20px;
  background: #f5576c;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary:hover {
  background: #e54558;
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
</style>
