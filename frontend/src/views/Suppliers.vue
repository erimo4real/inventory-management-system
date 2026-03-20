<template>
  <AppLayout>
    <div class="suppliers-page">
      <div class="page-header">
        <h1 class="page-title">Suppliers</h1>
        <button class="btn-primary" @click="showAddModal = true">
          + Add Supplier
        </button>
      </div>
      
      <div class="filters">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search suppliers..."
            @input="handleSearch"
          />
        </div>
      </div>
      
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else class="suppliers-grid">
        <div v-for="supplier in suppliers" :key="supplier.id" class="supplier-card">
          <div class="supplier-header">
            <h3>{{ supplier.name }}</h3>
            <span class="status" :class="supplier.is_active ? 'active' : 'inactive'">
              {{ supplier.is_active ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <div class="supplier-details">
            <div v-if="supplier.contact_person" class="detail">
              <span class="label">Contact:</span>
              <span>{{ supplier.contact_person }}</span>
            </div>
            <div v-if="supplier.email" class="detail">
              <span class="label">Email:</span>
              <span>{{ supplier.email }}</span>
            </div>
            <div v-if="supplier.phone" class="detail">
              <span class="label">Phone:</span>
              <span>{{ supplier.phone }}</span>
            </div>
            <div v-if="supplier.address" class="detail">
              <span class="label">Address:</span>
              <span>{{ supplier.address }}</span>
            </div>
          </div>
          <div class="supplier-actions">
            <button class="btn-icon" @click="editSupplier(supplier)">✏️</button>
            <button class="btn-icon" @click="deleteSupplier(supplier.id)">🗑️</button>
          </div>
        </div>
      </div>
      
      <div v-if="!loading && !suppliers.length" class="empty-state">
        No suppliers found
      </div>
      
      <!-- Add/Edit Modal -->
      <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <h2>{{ showEditModal ? 'Edit Supplier' : 'Add Supplier' }}</h2>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Name *</label>
              <input v-model="form.name" type="text" required />
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
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import AppLayout from '../components/common/AppLayout.vue'

export default {
  name: 'Suppliers',
  components: { AppLayout },
  setup() {
    const store = useStore()
    
    const searchQuery = ref('')
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const editingSupplierId = ref(null)
    
    const form = ref({
      name: '',
      contact_person: '',
      email: '',
      phone: '',
      address: ''
    })
    
    const suppliers = computed(() => store.getters['suppliers/allSuppliers'])
    const loading = computed(() => store.getters['suppliers/suppliersLoading'])
    
    let searchTimeout = null
    
    const handleSearch = () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        fetchSuppliers()
      }, 300)
    }
    
    const fetchSuppliers = () => {
      store.dispatch('suppliers/fetchSuppliers', {
        query: searchQuery.value || undefined
      })
    }
    
    const editSupplier = (supplier) => {
      editingSupplierId.value = supplier.id
      form.value = {
        name: supplier.name,
        contact_person: supplier.contact_person || '',
        email: supplier.email || '',
        phone: supplier.phone || '',
        address: supplier.address || ''
      }
      showEditModal.value = true
    }
    
    const deleteSupplier = async (supplierId) => {
      if (!confirm('Are you sure you want to delete this supplier?')) return
      try {
        await store.dispatch('suppliers/deleteSupplier', supplierId)
      } catch (error) {
        alert('Failed to delete supplier')
      }
    }
    
    const handleSubmit = async () => {
      try {
        if (showEditModal.value) {
          await store.dispatch('suppliers/updateSupplier', {
            id: editingSupplierId.value,
            data: form.value
          })
        } else {
          await store.dispatch('suppliers/createSupplier', form.value)
        }
        closeModal()
        fetchSuppliers()
      } catch (error) {
        alert(error.response?.data?.detail || 'Operation failed')
      }
    }
    
    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      editingSupplierId.value = null
      form.value = {
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: ''
      }
    }
    
    onMounted(() => {
      fetchSuppliers()
    })
    
    return {
      searchQuery,
      showAddModal,
      showEditModal,
      form,
      suppliers,
      loading,
      handleSearch,
      editSupplier,
      deleteSupplier,
      handleSubmit,
      closeModal
    }
  }
}
</script>

<style scoped>
.suppliers-page {
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

.suppliers-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.supplier-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.supplier-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.supplier-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
}

.status {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status.active {
  background: #d1fae5;
  color: #059669;
}

.status.inactive {
  background: #f3f4f6;
  color: #6b7280;
}

.supplier-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.detail {
  display: flex;
  gap: 8px;
  font-size: 14px;
}

.detail .label {
  color: #6b7280;
  min-width: 60px;
}

.supplier-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
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
  max-width: 450px;
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
