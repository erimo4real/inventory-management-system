<template>
  <AppLayout>
    <div class="inventory-page">
      <h1 class="page-title">Inventory Management</h1>
      
      <div class="quick-actions">
        <h3>Quick Actions</h3>
        <div class="action-buttons">
          <button class="action-btn stock-in" @click="openStockModal('in')">
            <span class="icon">⬇️</span>
            <span>Stock In</span>
          </button>
          <button class="action-btn stock-out" @click="openStockModal('out')">
            <span class="icon">⬆️</span>
            <span>Stock Out</span>
          </button>
          <button class="action-btn adjust" @click="openAdjustModal">
            <span class="icon">⚖️</span>
            <span>Adjust Stock</span>
          </button>
        </div>
      </div>
      
      <div class="transaction-history">
        <h3>Recent Transactions</h3>
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else-if="transactions.length" class="transactions-list">
          <div 
            v-for="transaction in transactions" 
            :key="transaction.id"
            class="transaction-item"
          >
            <div class="transaction-type" :class="transaction.type.toLowerCase()">
              {{ transaction.type }}
            </div>
            <div class="transaction-details">
              <span class="product-id">Product: {{ transaction.product_id.slice(-6) }}</span>
              <span class="transaction-note">{{ transaction.note || 'No note' }}</span>
            </div>
            <div class="transaction-qty">
              <span class="qty-change" :class="transaction.type.toLowerCase()">
                {{ transaction.type === 'OUT' ? '-' : '+' }}{{ transaction.quantity }}
              </span>
              <span class="qty-total">→ {{ transaction.new_quantity }}</span>
            </div>
            <div class="transaction-date">
              {{ formatDate(transaction.created_at) }}
            </div>
          </div>
        </div>
        <div v-else class="empty-state">No transactions yet</div>
      </div>
      
      <div v-if="showStockModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <h2>{{ stockModalType === 'in' ? 'Stock In' : 'Stock Out' }}</h2>
          <form @submit.prevent="handleStockSubmit">
            <div class="form-group">
              <label>Product</label>
              <select v-model="stockForm.product_id" required>
                <option value="">Select a product</option>
                <option v-for="product in products" :key="product.id" :value="product.id">
                  {{ product.name }} ({{ product.sku }}) - Qty: {{ product.quantity }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Quantity</label>
              <input v-model.number="stockForm.quantity" type="number" min="1" required />
            </div>
            <div class="form-group">
              <label>Note (Optional)</label>
              <textarea v-model="stockForm.note" rows="2"></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="closeModal">Cancel</button>
              <button type="submit" class="btn-primary">
                {{ stockModalType === 'in' ? 'Add Stock' : 'Remove Stock' }}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div v-if="showAdjustModal" class="modal-overlay" @click="closeModal">
        <div class="modal" @click.stop>
          <h2>Adjust Stock</h2>
          <form @submit.prevent="handleAdjustSubmit">
            <div class="form-group">
              <label>Product</label>
              <select v-model="adjustForm.product_id" required @change="onProductSelect">
                <option value="">Select a product</option>
                <option v-for="product in products" :key="product.id" :value="product.id">
                  {{ product.name }} ({{ product.sku }}) - Current: {{ product.quantity }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>New Quantity</label>
              <input v-model.number="adjustForm.new_quantity" type="number" min="0" required />
            </div>
            <div class="form-group">
              <label>Reason</label>
              <textarea v-model="adjustForm.note" rows="2" required></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" class="btn-secondary" @click="closeModal">Cancel</button>
              <button type="submit" class="btn-primary">Adjust Stock</button>
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
  name: 'Inventory',
  components: { AppLayout },
  setup() {
    const store = useStore()
    
    const showStockModal = ref(false)
    const showAdjustModal = ref(false)
    const stockModalType = ref('in')
    
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
      try {
        const action = stockModalType.value === 'in' ? 'inventory/stockIn' : 'inventory/stockOut'
        await store.dispatch(action, {
          product_id: stockForm.value.product_id,
          quantity: stockForm.value.quantity,
          note: stockForm.value.note
        })
        closeModal()
        store.dispatch('inventory/fetchTransactions', { limit: 20 })
        store.dispatch('products/fetchProducts')
      } catch (error) {
        alert(error.response?.data?.detail || 'Operation failed')
      }
    }
    
    const handleAdjustSubmit = async () => {
      try {
        await store.dispatch('inventory/adjustStock', {
          productId: adjustForm.value.product_id,
          data: {
            new_quantity: adjustForm.value.new_quantity,
            note: adjustForm.value.note
          }
        })
        closeModal()
        store.dispatch('inventory/fetchTransactions', { limit: 20 })
        store.dispatch('products/fetchProducts')
      } catch (error) {
        alert(error.response?.data?.detail || 'Operation failed')
      }
    }
    
    const closeModal = () => {
      showStockModal.value = false
      showAdjustModal.value = false
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
  max-width: 900px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 24px;
}

.quick-actions {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.quick-actions h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #374151;
}

.action-buttons {
  display: flex;
  gap: 16px;
}

.action-btn {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
  border: 2px dashed #d1d5db;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: #4f46e5;
  background: #f5f7ff;
}

.action-btn .icon {
  font-size: 32px;
}

.action-btn span:last-child {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.transaction-history {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.transaction-history h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #374151;
}

.transactions-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.transaction-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
}

.transaction-type {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  min-width: 70px;
  text-align: center;
}

.transaction-type.in {
  background: #d1fae5;
  color: #059669;
}

.transaction-type.out {
  background: #fee2e2;
  color: #dc2626;
}

.transaction-type.adjust {
  background: #e0e7ff;
  color: #4f46e5;
}

.transaction-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-id {
  font-weight: 500;
  color: #1a1a2e;
}

.transaction-note {
  font-size: 13px;
  color: #6b7280;
}

.transaction-qty {
  display: flex;
  align-items: center;
  gap: 8px;
}

.qty-change {
  font-weight: 600;
  font-size: 16px;
}

.qty-change.in {
  color: #059669;
}

.qty-change.out {
  color: #dc2626;
}

.qty-change.adjust {
  color: #4f46e5;
}

.qty-total {
  color: #6b7280;
  font-size: 14px;
}

.transaction-date {
  font-size: 13px;
  color: #9ca3af;
  min-width: 100px;
  text-align: right;
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
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #4f46e5;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-primary {
  padding: 10px 20px;
  background: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
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
</style>
