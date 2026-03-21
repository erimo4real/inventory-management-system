<template>
  <AppLayout>
    <div class="categories-page">
      <div class="page-header">
        <div class="page-title-area">
          <h1 class="page-title">Categories</h1>
          <nav class="breadcrumb">
            <router-link to="/">Dashboard</router-link>
            <span class="separator">/</span>
            <span class="current">Categories</span>
          </nav>
        </div>
        <button class="btn btn-primary" @click="showAddModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Category
        </button>
      </div>

      <div class="filters mb-4">
        <div class="filter-group">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
          </svg>
          <label>Filter by Type:</label>
          <select v-model="selectedType" class="form-control" style="width: 180px;" @change="fetchCategories">
            <option value="">All Types</option>
            <option value="product">Products</option>
            <option value="vendor">Vendors</option>
            <option value="supplier">Suppliers</option>
            <option value="client">Clients</option>
          </select>
        </div>
      </div>

      <div class="category-sections">
        <div v-for="type in categoryTypes" :key="type.value" class="category-section">
          <div class="section-header">
            <div class="d-flex align-center gap-3">
              <div class="type-icon" :style="{ background: type.color + '15', color: type.color }">
                <svg v-if="type.value === 'product'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                </svg>
                <svg v-else-if="type.value === 'vendor'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                <svg v-else-if="type.value === 'supplier'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M2 12h20"/>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <h2>{{ type.label }}</h2>
            </div>
            <span class="count-badge" :style="{ background: type.color + '15', color: type.color }">
              {{ getCategoriesByType(type.value).length }}
            </span>
          </div>
          
          <div v-if="loading" class="card-body text-center py-4">
            <div class="spinner-border text-primary"></div>
          </div>
          
          <div v-else-if="getCategoriesByType(type.value).length" class="category-grid">
            <div v-for="cat in getCategoriesByType(type.value)" :key="cat.id" class="category-card">
              <div class="category-info">
                <h3>{{ cat.name }}</h3>
                <p v-if="cat.description">{{ cat.description }}</p>
              </div>
              <div class="category-actions">
                <button class="btn btn-sm btn-outline" @click="editCategory(cat)" title="Edit">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                </button>
                <button class="btn btn-sm btn-outline btn-outline-danger" @click="deleteCategory(cat)" title="Delete">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div v-else class="card-body text-center py-4 text-muted">
            No {{ type.label.toLowerCase() }} categories yet
          </div>
        </div>
      </div>

      <div v-if="showAddModal || showEditModal" class="modal-backdrop" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>{{ showEditModal ? 'Edit Category' : 'Add Category' }}</h3>
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
                <input v-model="form.name" type="text" class="form-control" required placeholder="e.g., Electronics" />
              </div>
              <div class="form-group" v-if="!showEditModal">
                <label class="form-label">Type *</label>
                <select v-model="form.type" class="form-control" required>
                  <option value="">Select Type</option>
                  <option value="product">Product</option>
                  <option value="vendor">Vendor</option>
                  <option value="supplier">Supplier</option>
                  <option value="client">Client</option>
                </select>
              </div>
              <div class="form-group mb-0">
                <label class="form-label">Description</label>
                <textarea v-model="form.description" class="form-control" rows="3" placeholder="Category description..."></textarea>
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
import AppLayout from '@/shared/components/AppLayout.vue'
import { showSuccess, showError } from '@/shared/components/ToastContainer.vue'

export default {
  name: 'Categories',
  components: { AppLayout },
  setup() {
    const store = useStore()

    const selectedType = ref('')
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const editingCategoryId = ref(null)
    const submitting = ref(false)

    const form = ref({
      name: '',
      type: '',
      description: ''
    })

    const categoryTypes = [
      { value: 'product', label: 'Products', color: '#7367f0' },
      { value: 'vendor', label: 'Vendors', color: '#f5576c' },
      { value: 'supplier', label: 'Suppliers', color: '#00cfe8' },
      { value: 'client', label: 'Clients', color: '#28c76f' }
    ]

    const categories = computed(() => store.getters['categories/allCategories'])
    const loading = computed(() => store.getters['categories/categoriesLoading'])

    const getCategoriesByType = (type) => {
      if (selectedType.value && selectedType.value !== type) return []
      return categories.value.filter(c => c.type === type)
    }

    const fetchCategories = () => {
      const params = {}
      if (selectedType.value) {
        params.type = selectedType.value
      }
      store.dispatch('categories/fetchCategories', params)
    }

    const editCategory = (category) => {
      editingCategoryId.value = category.id
      form.value = {
        name: category.name,
        type: category.type,
        description: category.description || ''
      }
      showEditModal.value = true
    }

    const deleteCategory = async (category) => {
      if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return
      try {
        await store.dispatch('categories/deleteCategory', category.id)
        showSuccess('Category deleted successfully')
        fetchCategories()
      } catch (error) {
        showError(error.response?.data?.error || 'Failed to delete category')
      }
    }

    const handleSubmit = async () => {
      submitting.value = true
      try {
        if (showEditModal.value) {
          await store.dispatch('categories/updateCategory', {
            id: editingCategoryId.value,
            data: form.value
          })
          showSuccess('Category updated successfully')
        } else {
          await store.dispatch('categories/createCategory', form.value)
          showSuccess('Category created successfully')
        }
        closeModal()
        fetchCategories()
      } catch (error) {
        showError(error.response?.data?.error || 'Operation failed')
      } finally {
        submitting.value = false
      }
    }

    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      editingCategoryId.value = null
      submitting.value = false
      form.value = {
        name: '',
        type: '',
        description: ''
      }
    }

    onMounted(() => {
      fetchCategories()
    })

    return {
      selectedType,
      showAddModal,
      showEditModal,
      form,
      categories,
      loading,
      categoryTypes,
      submitting,
      getCategoriesByType,
      fetchCategories,
      editCategory,
      deleteCategory,
      handleSubmit,
      closeModal
    }
  }
}
</script>

<style scoped>
.categories-page {
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

.filters {
  display: flex;
  gap: 16px;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border-radius: var(--border-radius);
  border: 1px solid var(--gray-200);
}

.filter-group svg {
  color: var(--gray-500);
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-700);
  margin: 0;
}

.category-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category-section {
  background: white;
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--gray-200);
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--gray-200);
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0;
}

.type-icon {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
}

.count-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  padding: 20px 24px;
}

.category-card {
  background: var(--gray-50);
  border-radius: var(--border-radius);
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.category-card:hover {
  background: var(--gray-100);
  border-color: var(--gray-200);
}

.category-info h3 {
  font-size: 15px;
  font-weight: 600;
  color: var(--gray-900);
  margin: 0 0 4px 0;
}

.category-info p {
  font-size: 13px;
  color: var(--gray-500);
  margin: 0;
}

.category-actions {
  display: flex;
  gap: 8px;
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

.card-body {
  padding: 24px;
}

.text-center {
  text-align: center;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
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

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .category-grid {
    grid-template-columns: 1fr;
  }
}
</style>
