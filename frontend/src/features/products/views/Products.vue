<template>
  <AppLayout>
    <div class="products-page">
      <div class="page-header">
        <div class="page-title-area">
          <h1 class="page-title">Products</h1>
          <nav class="breadcrumb">
            <router-link to="/">Dashboard</router-link>
            <span class="separator">/</span>
            <span class="current">Products</span>
          </nav>
        </div>
        <button class="btn btn-primary" @click="showAddModal = true">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Product
        </button>
      </div>
      
      <div class="card">
        <div class="card-header">
          <div class="d-flex gap-3 flex-wrap">
            <div class="search-box">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input 
                v-model="searchQuery" 
                type="text" 
                class="form-control" 
                placeholder="Search products..."
                @input="handleSearch"
              />
            </div>
            <select v-model="selectedCategory" class="form-control" style="width: 180px;" @change="handleFilter">
              <option value="">All Categories</option>
              <option v-for="cat in productCategories" :key="cat" :value="cat">{{ cat }}</option>
            </select>
            <label class="checkbox-wrapper d-flex align-center gap-2">
              <input v-model="lowStockOnly" type="checkbox" @change="handleFilter" />
              <span class="text-muted" style="font-size: 14px;">Low Stock Only</span>
            </label>
          </div>
        </div>
        
        <div v-if="loading" class="card-body">
          <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>
        </div>
        
        <div v-else-if="products.length" class="card-body p-0">
          <div class="table-responsive">
            <table class="table">
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Quantity</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th class="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in products" :key="product.id">
                  <td>
                    <code class="sku-code">{{ product.sku }}</code>
                  </td>
                  <td class="fw-600">{{ product.name }}</td>
                  <td>
                    <span class="badge badge-primary">{{ product.category }}</span>
                  </td>
                  <td>
                    <span 
                      class="fw-600" 
                      :class="{ 'text-danger': product.quantity <= product.low_stock_threshold }"
                    >
                      {{ product.quantity }}
                    </span>
                    <span v-if="product.quantity <= product.low_stock_threshold" class="badge badge-danger ml-2" style="margin-left: 8px;">
                      Low
                    </span>
                  </td>
                  <td>${{ product.price?.toFixed(2) }}</td>
                  <td>
                    <span class="badge" :class="product.is_active ? 'badge-success' : 'badge-secondary'">
                      {{ product.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </td>
                  <td class="text-right">
                    <div class="d-flex gap-2 justify-end">
                      <button class="btn btn-sm btn-outline" @click="editProduct(product)" title="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                      </button>
                      <button class="btn btn-sm btn-outline btn-outline-danger" @click="deleteProduct(product.id)" title="Delete">
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
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
            <h4>No products found</h4>
            <p>Get started by adding your first product</p>
            <button class="btn btn-primary" @click="showAddModal = true">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Add Product
            </button>
          </div>
        </div>
      </div>
      
      <div v-if="showAddModal || showEditModal" class="modal-backdrop" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>{{ showEditModal ? 'Edit Product' : 'Add Product' }}</h3>
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
              <div class="row">
                <div class="col-6">
                  <div class="form-group">
                    <label class="form-label">SKU *</label>
                    <input v-model="form.sku" type="text" class="form-control" required :disabled="showEditModal" />
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label class="form-label">Category *</label>
                    <select v-model="form.category" class="form-control" required>
                      <option value="">Select Category</option>
                      <option v-for="cat in productCategories" :key="cat" :value="cat">{{ cat }}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <div class="form-group">
                    <label class="form-label">Quantity</label>
                    <input v-model.number="form.quantity" type="number" class="form-control" min="0" />
                  </div>
                </div>
                <div class="col-6">
                  <div class="form-group">
                    <label class="form-label">Price</label>
                    <input v-model.number="form.price" type="number" class="form-control" min="0" step="0.01" />
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Low Stock Threshold</label>
                <input v-model.number="form.low_stock_threshold" type="number" class="form-control" min="0" />
              </div>
              <div class="form-group mb-0">
                <label class="form-label">Description</label>
                <textarea v-model="form.description" class="form-control" rows="3"></textarea>
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
    const submitting = ref(false)
    
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
    const productCategories = computed(() => store.getters['categories/productCategories'].map(c => c.name))
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
        showSuccess('Product deleted successfully')
      } catch (error) {
        showError('Failed to delete product')
      }
    }
    
    const handleSubmit = async () => {
      submitting.value = true
      try {
        if (showEditModal.value) {
          await store.dispatch('products/updateProduct', {
            id: editingProductId.value,
            data: form.value
          })
          showSuccess('Product updated successfully')
        } else {
          await store.dispatch('products/createProduct', form.value)
          showSuccess('Product created successfully')
        }
        closeModal()
        fetchProducts()
      } catch (error) {
        showError(error.response?.data?.detail || 'Operation failed')
      } finally {
        submitting.value = false
      }
    }
    
    const closeModal = () => {
      showAddModal.value = false
      showEditModal.value = false
      editingProductId.value = null
      submitting.value = false
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
      store.dispatch('categories/fetchCategories', { type: 'product' })
    })
    
    return {
      searchQuery,
      selectedCategory,
      lowStockOnly,
      showAddModal,
      showEditModal,
      form,
      products,
      productCategories,
      loading,
      submitting,
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

.checkbox-wrapper input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.sku-code {
  font-family: 'Courier New', monospace;
  font-size: 12px;
  background: var(--gray-100);
  padding: 4px 8px;
  border-radius: 4px;
  color: var(--gray-700);
}

.fw-600 {
  font-weight: 600;
}

.ml-2 {
  margin-left: 8px;
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

.p-0 {
  padding: 0 !important;
}

.mb-0 {
  margin-bottom: 0 !important;
}

.py-5 {
  padding-top: 3rem;
  padding-bottom: 3rem;
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

.text-danger {
  color: var(--danger-color);
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
