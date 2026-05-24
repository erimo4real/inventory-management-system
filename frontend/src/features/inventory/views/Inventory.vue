<template>
  <AppLayout>
    <div class="inventory-page">
      <div class="page-header">
        <div class="page-title-area">
          <h1 class="page-title">Inventory Management</h1>
          <nav class="breadcrumb">
            <router-link to="/">Dashboard</router-link>
            <span class="separator">/</span>
            <span class="current">Inventory</span>
          </nav>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            Quick Actions
          </h2>
          <div class="row">
            <div class="col-4">
              <button class="action-card stock-in" @click="openStockModal('in')">
                <div class="action-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </div>
                <span class="action-label">Stock In</span>
                <span class="action-desc">Add new inventory</span>
              </button>
            </div>
            <div class="col-4">
              <button class="action-card stock-out" @click="openStockModal('out')">
                <div class="action-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="7 14 12 9 17 14"/>
                    <line x1="12" y1="9" x2="12" y2="21"/>
                  </svg>
                </div>
                <span class="action-label">Stock Out</span>
                <span class="action-desc">Remove from inventory</span>
              </button>
            </div>
            <div class="col-4">
              <button class="action-card adjust" @click="openAdjustModal">
                <div class="action-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                </div>
                <span class="action-label">Adjust Stock</span>
                <span class="action-desc">Fix inventory counts</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-body p-0">
          <div class="card-header">
            <h2 class="section-title mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Recent Transactions
            </h2>
          </div>
          
          <div v-if="loading" class="card-body text-center py-5">
            <div class="spinner-border text-primary"></div>
          </div>
          
          <div v-else-if="transactions.length" class="transactions-list">
            <div v-for="transaction in transactions" :key="transaction.id" class="transaction-item">
              <div class="transaction-type" :class="transaction.type.toLowerCase()">
                <svg v-if="transaction.type === 'IN'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                <svg v-else-if="transaction.type === 'OUT'" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="7 14 12 9 17 14"/>
                  <line x1="12" y1="9" x2="12" y2="21"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                {{ transaction.type }}
              </div>
              <div class="transaction-details">
                <span class="product-name">Product: {{ transaction.product_id.slice(-8) }}</span>
                <span class="transaction-note">{{ transaction.note || 'No note' }}</span>
              </div>
              <div class="transaction-qty">
                <span class="qty-change" :class="transaction.type.toLowerCase()">
                  {{ transaction.type === 'OUT' ? '-' : '+' }}{{ transaction.quantity }}
                </span>
                <span class="qty-total">→ {{ transaction.new_quantity }}</span>
              </div>
              <div class="transaction-date">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                {{ formatDate(transaction.created_at) }}
              </div>
            </div>
          </div>
          
          <div v-else class="card-body text-center py-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-muted mb-3">
              <polyline points="23 4 23 10 17 10"/>
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
            </svg>
            <h4>No transactions yet</h4>
            <p class="text-muted">Start by adding stock to your inventory</p>
          </div>
        </div>
      </div>

      <div v-if="showStockModal" class="modal-backdrop" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>
              <svg v-if="stockModalType === 'in'" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--success-color);">
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--danger-color);">
                <polyline points="7 14 12 9 17 14"/>
                <line x1="12" y1="9" x2="12" y2="21"/>
              </svg>
              {{ stockModalType === 'in' ? 'Stock In' : 'Stock Out' }}
            </h3>
            <button class="btn-icon" @click="closeModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <form @submit.prevent="handleStockSubmit">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Product *</label>
                <select v-model="stockForm.product_id" class="form-control" required>
                  <option value="">Select a product</option>
                  <option v-for="product in products" :key="product.id" :value="product.id">
                    {{ product.name }} ({{ product.sku }}) - Qty: {{ product.quantity }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">Quantity *</label>
                <input v-model.number="stockForm.quantity" type="number" class="form-control" min="1" required />
              </div>
              <div class="form-group mb-0">
                <label class="form-label">Note (Optional)</label>
                <textarea v-model="stockForm.note" class="form-control" rows="2"></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" @click="closeModal">Cancel</button>
              <button type="submit" class="btn" :class="stockModalType === 'in' ? 'btn-success' : 'btn-danger'" :disabled="submitting">
                {{ submitting ? 'Processing...' : (stockModalType === 'in' ? 'Add Stock' : 'Remove Stock') }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div v-if="showAdjustModal" class="modal-backdrop" @click="closeModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: var(--warning-color);">
                <circle cx="12" cy="12" r="3"/>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
              </svg>
              Adjust Stock
            </h3>
            <button class="btn-icon" @click="closeModal">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
          <form @submit.prevent="handleAdjustSubmit">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Product *</label>
                <select v-model="adjustForm.product_id" class="form-control" required @change="onProductSelect">
                  <option value="">Select a product</option>
                  <option v-for="product in products" :key="product.id" :value="product.id">
                    {{ product.name }} ({{ product.sku }}) - Current: {{ product.quantity }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">New Quantity *</label>
                <input v-model.number="adjustForm.new_quantity" type="number" class="form-control" min="0" required />
              </div>
              <div class="form-group mb-0">
                <label class="form-label">Reason *</label>
                <textarea v-model="adjustForm.note" class="form-control" rows="2" required></textarea>
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-warning" :disabled="submitting">
                {{ submitting ? 'Processing...' : 'Adjust Stock' }}
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
  name: 'Inventory',
  components: { AppLayout },
  setup() {
    const store = useStore()

    const showStockModal = ref(false)
    const showAdjustModal = ref(false)
    const stockModalType = ref('in')
    const submitting = ref(false)

    const stockForm = ref({
      product_id: '',
      quantity: 1,
      note: ''
    })

    const adjustForm = ref({
      product_id: '',
      new_quantity: 0,
      note: ''
    })

    const transactions = computed(() => store.getters['inventory/allTransactions'])
    const products = computed(() => store.getters['products/allProducts'])
    const loading = computed(() => store.getters['inventory/inventoryLoading'])

    const openStockModal = (type) => {
      stockModalType.value = type
      showStockModal.value = true
    }

    const openAdjustModal = () => {
      showAdjustModal.value = true
    }

    const onProductSelect = () => {
      const product = products.value.find(p => p.id === adjustForm.value.product_id)
      if (product) {
        adjustForm.value.new_quantity = product.quantity
      }
    }

    const handleStockSubmit = async () => {
      submitting.value = true
      try {
        const action = stockModalType.value === 'in' ? 'inventory/stockIn' : 'inventory/stockOut'
        await store.dispatch(action, {
          product_id: stockForm.value.product_id,
          quantity: stockForm.value.quantity,
          note: stockForm.value.note
        })
        showSuccess(`Stock ${stockModalType.value === 'in' ? 'added' : 'removed'} successfully`)
        closeModal()
        store.dispatch('inventory/fetchTransactions', { limit: 20 })
        store.dispatch('products/fetchProducts')
      } catch (error) {
        showError(error.response?.data?.detail || 'Operation failed')
      } finally {
        submitting.value = false
      }
    }

    const handleAdjustSubmit = async () => {
      submitting.value = true
      try {
        await store.dispatch('inventory/adjustStock', {
          productId: adjustForm.value.product_id,
          data: {
            new_quantity: adjustForm.value.new_quantity,
            note: adjustForm.value.note
          }
        })
        showSuccess('Stock adjusted successfully')
        closeModal()
        store.dispatch('inventory/fetchTransactions', { limit: 20 })
        store.dispatch('products/fetchProducts')
      } catch (error) {
        showError(error.response?.data?.detail || 'Operation failed')
      } finally {
        submitting.value = false
      }
    }

    const closeModal = () => {
      showStockModal.value = false
      showAdjustModal.value = false
      submitting.value = false
      stockForm.value = { product_id: '', quantity: 1, note: '' }
      adjustForm.value = { product_id: '', new_quantity: 0, note: '' }
    }

    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    onMounted(() => {
      store.dispatch('inventory/fetchTransactions', { limit: 20 })
      store.dispatch('products/fetchProducts')
    })

    return {
      showStockModal,
      showAdjustModal,
      stockModalType,
      stockForm,
      adjustForm,
      transactions,
      products,
      loading,
      submitting,
      openStockModal,
      openAdjustModal,
      onProductSelect,
      handleStockSubmit,
      handleAdjustSubmit,
      closeModal,
      formatDate
    }
  }
}
</script>

<style scoped>
.inventory-page {
  padding: 24px;
  max-width: 900px;
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

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 16px;
}

.section-title svg {
  color: var(--primary-color);
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--gray-200);
}

.card-body {
  padding: 24px;
}

.card-body.p-0 {
  padding: 0 !important;
}

.p-0 {
  padding: 0 !important;
}

.py-5 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.mb-0 {
  margin-bottom: 0 !important;
}

.mb-3 {
  margin-bottom: 1rem;
}

.action-card {
  width: 100%;
  padding: 32px 24px;
  background: var(--gray-50);
  border: 2px dashed var(--gray-300);
  border-radius: var(--border-radius-lg);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-card:hover {
  border-style: solid;
}

.action-card.stock-in:hover {
  background: rgba(40, 199, 111, 0.05);
  border-color: var(--success-color);
}

.action-card.stock-in:hover .action-icon {
  color: var(--success-color);
  background: rgba(40, 199, 111, 0.1);
}

.action-card.stock-out:hover {
  background: rgba(234, 84, 85, 0.05);
  border-color: var(--danger-color);
}

.action-card.stock-out:hover .action-icon {
  color: var(--danger-color);
  background: rgba(234, 84, 85, 0.1);
}

.action-card.adjust:hover {
  background: rgba(255, 159, 67, 0.05);
  border-color: var(--warning-color);
}

.action-card.adjust:hover .action-icon {
  color: var(--warning-color);
  background: rgba(255, 159, 67, 0.1);
}

.action-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-500);
  transition: all 0.2s;
}

.action-label {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-900);
}

.action-desc {
  font-size: 13px;
  color: var(--gray-500);
}

.transactions-list {
  display: flex;
  flex-direction: column;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--gray-100);
  transition: background 0.2s;
}

.transaction-item:hover {
  background: var(--gray-50);
}

.transaction-item:last-child {
  border-bottom: none;
}

.transaction-type {
  padding: 8px 14px;
  border-radius: var(--border-radius);
  font-size: 12px;
  font-weight: 600;
  min-width: 90px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.transaction-type.in {
  background: rgba(40, 199, 111, 0.1);
  color: var(--success-color);
}

.transaction-type.out {
  background: rgba(234, 84, 85, 0.1);
  color: var(--danger-color);
}

.transaction-type.adjust {
  background: rgba(255, 159, 67, 0.1);
  color: var(--warning-color);
}

.transaction-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-name {
  font-weight: 500;
  color: var(--gray-900);
}

.transaction-note {
  font-size: 13px;
  color: var(--gray-500);
}

.transaction-qty {
  display: flex;
  align-items: center;
  gap: 12px;
}

.qty-change {
  font-weight: 600;
  font-size: 16px;
}

.qty-change.in {
  color: var(--success-color);
}

.qty-change.out {
  color: var(--danger-color);
}

.qty-change.adjust {
  color: var(--warning-color);
}

.qty-total {
  color: var(--gray-500);
  font-size: 14px;
}

.transaction-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--gray-500);
  min-width: 120px;
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

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.modal-header h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.modal-body {
  padding: 24px;
}

.mb-0 {
  margin-bottom: 0 !important;
}

.text-center {
  text-align: center;
}

.text-muted {
  color: var(--gray-500);
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
  
  .transaction-item {
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .transaction-details {
    order: 1;
    width: calc(100% - 120px);
  }
  
  .transaction-qty {
    order: 2;
  }
  
  .transaction-date {
    order: 3;
    width: 100%;
    justify-content: flex-start;
    padding-left: 106px;
  }
}
</style>
