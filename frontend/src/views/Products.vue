<template>
  <AppLayout>
    <div class="products-page">
      <div class="page-header">
        <h1 class="page-title">Products</h1>
        <button class="btn-primary" @click="showAddModal = true">
          + Add Product
        </button>
      </div>
      
      <div class="filters">
        <div class="search-box">
          <input 
            v-model="searchQuery" 
            type="text" 
            placeholder="Search products..."
            @input="handleSearch"
          />
        </div>
        <select v-model="selectedCategory" @change="handleFilter">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        <label class="checkbox">
          <input v-model="lowStockOnly" type="checkbox" @change="handleFilter" />
          Low Stock Only
        </label>
      </div>
      
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else class="products-table">
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td class="sku">{{ product.sku }}</td>
              <td>{{ product.name }}</td>
              <td>
                <span class="category-tag">{{ product.category }}</span>
              </td>
              <td>
                <span 
                  class="quantity" 
                  :class="{ 'low-stock': product.quantity <= product.low_stock_threshold }"
                >
                  {{ product.quantity }}
                </span>
              </td>
              <td>${{ product.price }}</td>
              <td>
                <span class="status" :class="product.is_active ? 'active' : 'inactive'">
                  {{ product.is_active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>
                <button class="btn-icon" @click="editProduct(product)">✏️</button>
                <button class="btn-icon" @click="deleteProduct(product.id)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <!-- Add/Edit Modal -->
      <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <h2>{{ showEditModal ? 'Edit Product' : 'Add Product' }}</h2>
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label>Name *</label>
              <input v-model="form.name" type="text" required />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>SKU *</label>
                <input v-model="form.sku" type="text" required :disabled="showEditModal" />
              </div>
              <div class="form-group">
                <label>Category *</label>
                <input v-model="form.category" type="text" required />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Quantity</label>
                <input v-model.number="form.quantity" type="number" min="0" />
              </div>
              <div class="form-group">
                <label>Price</label>
                <input v-model.number="form.price" type="number" min="0" step="0.01" />
              </div>
            </div>
            <div class="form-group">
              <label>Low Stock Threshold</label>
              <input v-model.number="form.low_stock_threshold" type="number" min="0" />
            </div>
            <div class="form-group">
              <label>Description</label>
              <textarea v-model="form.description" rows="3"></textarea>
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
  name: 'Products',
  components: { AppLayout },
  setup() {
    const store = useStore()
    
    const searchQuery = ref('')
    const selectedCategory = ref('')
    const lowStockOnly = ref(false)
    const showAddModal = ref(false)
    const showEditModal = ref(false)
    const editingProductId = ref(null)
    
    const form = ref({
      name: '',
      sku: '',
      category: '',
      quantity: 0,
      price: 0,
      low_stock_threshold: 10,
      description: ''
    })
    
    const products = computed(() => store.getters['products/allProducts'])
    const categories = computed(() => store.getters['products/allCategories'])
    const loading = computed(() => store.getters['products/productsLoading'])
    
    let searchTimeout = null
    
    const handleSearch = () => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        fetchProducts()
      }, 300)
    }
    
    const handleFilter = () => {
      fetchProducts()
    }
    
    const fetchProducts = () => {
      store.dispatch('products/fetchProducts', {
        query: searchQuery.value || undefined,
        category: selectedCategory.value || undefined,
        low_stock: lowStockOnly.value || undefined
      })
    }
    
    const editProduct = (product) => {
      editingProductId.value = product.id
      form.value = {
        name: product.name,
        sku: product.sku,
        category: product.category,
        quantity: product.quantity,
        price: product.price,
        low_stock_threshold: product.low_stock_threshold,
        description: product.description || ''
      }
      showEditModal.value = true
    }
    
    const deleteProduct = async (productId) => {
      if (!confirm('Are you sure you want to delete this product?')) return
      try {
        await store.dispatch('products/deleteProduct', productId)
      } catch (error) {
        alert('Failed to delete product')
      }
    }
    
    const handleSubmit = async () => {
      try {
        if (showEditModal.value) {
          await store.dispatch('products/updateProduct', {
            id: editingProductId.value,
            data: form.value
          })
        } else {
          await store.dispatch('products/createProduct', form.value)
        }
        closeModal()
        fetchProducts()
      } catch (error) {
        alert(error.response?.data?.detail || 'Operation failed')
      }
    }
    
    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      editingProductId.value = null
      form.value = {
        name: '',
        sku: '',
        category: '',
        quantity: 0,
        price: 0,
        low_stock_threshold: 10,
        description: ''
      }
    }
    
    onMounted(() => {
      fetchProducts()
      store.dispatch('products/fetchCategories')
    })
    
    return {
      searchQuery,
      selectedCategory,
      lowStockOnly,
      showAddModal,
      showEditModal,
      form,
      products,
      categories,
      loading,
      handleSearch,
      handleFilter,
      editProduct,
      deleteProduct,
      handleSubmit,
      closeModal
    }
  }
}
</script>

<style scoped>
.products-page {
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
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
}

.search-box input {
  width: 300px;
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

.filters select {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
}

.checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  cursor: pointer;
}

.products-table {
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #f3f4f6;
}

th {
  font-weight: 600;
  color: #6b7280;
  font-size: 12px;
  text-transform: uppercase;
  background: #f9fafb;
}

tbody tr:hover {
  background: #f9fafb;
}

.sku {
  font-family: monospace;
  font-size: 12px;
  color: #6b7280;
}

.category-tag {
  padding: 4px 10px;
  background: #e0e7ff;
  color: #4f46e5;
  border-radius: 4px;
  font-size: 12px;
}

.quantity {
  font-weight: 600;
}

.quantity.low-stock {
  color: #dc2626;
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

.btn-icon {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
  margin-right: 8px;
}

.loading {
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
.form-group textarea,
.form-group select {
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
