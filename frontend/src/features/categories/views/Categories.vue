<template>
  <AppLayout>
    <div class="categories-page">
      <div class="page-header">
        <h1 class="page-title">Categories</h1>
        <button class="btn-primary" @click="showAddModal = true">
          + Add Category
        </button>
      </div>

      <div class="filters">
        <div class="filter-group">
          <label>Filter by Type:</label>
          <select v-model="selectedType" @change="fetchCategories">
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
            <h2>{{ type.label }}</h2>
            <span class="count">{{ getCategoriesByType(type.value).length }}</span>
          </div>
          <div v-if="loading" class="loading">Loading...</div>
          <div v-else-if="getCategoriesByType(type.value).length" class="category-grid">
            <div v-for="cat in getCategoriesByType(type.value)" :key="cat.id" class="category-card">
              <div class="category-info">
                <h3>{{ cat.name }}</h3>
                <p v-if="cat.description">{{ cat.description }}</p>
              </div>
              <div class="category-actions">
                <button class="btn-icon" @click="editCategory(cat)" title="Edit">
                  ✏️
                </button>
                <button class="btn-icon delete" @click="deleteCategory(cat)" title="Delete">
                  🗑️
                </button>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            No {{ type.label.toLowerCase() }} categories yet
          </div>
        </div>
      </div>

      <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <h2>{{ showEditModal ? 'Edit Category' : 'Add Category' }}</h2>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Name *</label>
              <input v-model="form.name" type="text" required placeholder="e.g., Electronics" />
            </div>
            <div class="form-group" v-if="!showEditModal">
              <label>Type *</label>
              <select v-model="form.type" required>
                <option value="">Select Type</option>
                <option value="product">Product</option>
                <option value="vendor">Vendor</option>
                <option value="supplier">Supplier</option>
                <option value="client">Client</option>
              </select>
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="form.description" rows="3" placeholder="Category description..."></textarea>
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
import AppLayout from '@/shared/components/AppLayout.vue'

export default {
  name: 'Categories',
  components: { AppLayout },
  setup() {
    const store = useStore()

    const selectedType = ref('')
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const editingCategoryId = ref(null)

    const form = ref({
      name: '',
      type: '',
      description: ''
    })

    const categoryTypes = [
      { value: 'product', label: 'Products' },
      { value: 'vendor', label: 'Vendors' },
      { value: 'supplier', label: 'Suppliers' },
      { value: 'client', label: 'Clients' }
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
        fetchCategories()
      } catch (error) {
        alert(error.response?.data?.error || 'Failed to delete category')
      }
    }

    const handleSubmit = async () => {
      try {
        if (showEditModal.value) {
          await store.dispatch('categories/updateCategory', {
            id: editingCategoryId.value,
            data: form.value
          })
        } else {
          await store.dispatch('categories/createCategory', form.value)
        }
        closeModal()
        fetchCategories()
      } catch (error) {
        alert(error.response?.data?.error || 'Operation failed')
      }
    }

    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      editingCategoryId.value = null
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

.filter-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.filter-group select {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
}

.category-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.category-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
}

.section-header .count {
  background: #e0e7ff;
  color: #4f46e5;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 16px;
}

.category-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  transition: all 0.2s;
}

.category-card:hover {
  background: #f3f4f6;
}

.category-info h3 {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 4px 0;
}

.category-info p {
  font-size: 13px;
  color: #6b7280;
  margin: 0;
}

.category-actions {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: white;
  border: none;
  cursor: pointer;
  font-size: 14px;
  padding: 6px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-icon:hover {
  background: #e5e7eb;
}

.btn-icon.delete:hover {
  background: #fee2e2;
}

.loading, .empty-state {
  text-align: center;
  padding: 32px;
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

.form-group label {
  display: block;
  margin-bottom: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:focus,
.form-group select:focus,
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
