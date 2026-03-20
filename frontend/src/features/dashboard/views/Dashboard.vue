<template>
  <AppLayout>
    <div class="dashboard">
      <h1 class="page-title">Dashboard</h1>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon products">📦</div>
          <div class="stat-info">
            <span class="stat-value">{{ summary.products?.total || 0 }}</span>
            <span class="stat-label">Total Products</span>
          </div>
        </div>
        
        <div class="stat-card warning">
          <div class="stat-icon low-stock">⚠️</div>
          <div class="stat-info">
            <span class="stat-value">{{ summary.products?.low_stock_count || 0 }}</span>
            <span class="stat-label">Low Stock Items</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon value">💰</div>
          <div class="stat-info">
            <span class="stat-value">${{ formatNumber(summary.products?.total_value || 0) }}</span>
            <span class="stat-label">Inventory Value</span>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon transactions">🔄</div>
          <div class="stat-info">
            <span class="stat-value">{{ summary.transactions_30d?.IN || 0 }}</span>
            <span class="stat-label">Stock In (30d)</span>
          </div>
        </div>
      </div>
      
      <div class="dashboard-sections">
        <div class="section">
          <div class="section-header">
            <h2>Low Stock Alerts</h2>
            <router-link to="/products?low_stock=true" class="view-all">View All</router-link>
          </div>
          <div v-if="summary.low_stock_products?.length" class="alert-list">
            <div 
              v-for="product in summary.low_stock_products" 
              :key="product.id"
              class="alert-item"
            >
              <div class="alert-info">
                <span class="alert-name">{{ product.name }}</span>
                <span class="alert-sku">{{ product.sku }}</span>
              </div>
              <div class="alert-quantity">
                <span class="qty-current">{{ product.quantity }}</span>
                <span class="qty-separator">/</span>
                <span class="qty-threshold">{{ product.threshold }}</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            No low stock items
          </div>
        </div>
        
        <div class="section">
          <div class="section-header">
            <h2>Recent Activity</h2>
            <router-link to="/inventory" class="view-all">View All</router-link>
          </div>
          <div v-if="recentTransactions.length" class="activity-list">
            <div 
              v-for="transaction in recentTransactions.slice(0, 5)" 
              :key="transaction.id"
              class="activity-item"
            >
              <div class="activity-type" :class="transaction.type.toLowerCase()">
                {{ transaction.type }}
              </div>
              <div class="activity-details">
                <span class="activity-product">{{ transaction.product_name || 'Product' }}</span>
                <span class="activity-time">{{ formatDate(transaction.created_at) }}</span>
              </div>
              <div class="activity-qty">
                {{ transaction.type === 'OUT' ? '-' : '+' }}{{ transaction.quantity }}
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            No recent activity
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import AppLayout from '@/shared/components/AppLayout.vue'
import api from '@/shared/services/api'

export default {
  name: 'Dashboard',
  components: { AppLayout },
  setup() {
    const store = useStore()
    const summary = ref({})
    
    const recentTransactions = computed(() => store.getters['inventory/allTransactions'])
    
    const fetchSummary = async () => {
      try {
        const response = await api.get('/dashboard/stats')
        summary.value = response.data
      } catch (error) {
        console.error('Failed to fetch dashboard summary:', error)
      }
    }
    
    const formatNumber = (num) => {
      return new Intl.NumberFormat('en-US').format(num)
    }
    
    const formatDate = (dateString) => {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    onMounted(() => {
      fetchSummary()
      store.dispatch('inventory/fetchTransactions', { limit: 10 })
    })
    
    return {
      summary,
      recentTransactions,
      formatNumber,
      formatDate
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stat-card.warning {
  background: #fef3c7;
  border: 1px solid #fcd34d;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background: #f3f4f6;
}

.stat-icon.low-stock {
  background: #fee2e2;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
}

.dashboard-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.section {
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
}

.section-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a2e;
}

.view-all {
  font-size: 14px;
  color: #4f46e5;
  text-decoration: none;
}

.view-all:hover {
  text-decoration: underline;
}

.alert-list, .activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.alert-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #fef3c7;
  border-radius: 8px;
  border-left: 4px solid #f59e0b;
}

.alert-info {
  display: flex;
  flex-direction: column;
}

.alert-name {
  font-weight: 500;
  color: #1a1a2e;
}

.alert-sku {
  font-size: 12px;
  color: #6b7280;
}

.alert-quantity {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
}

.qty-current {
  font-weight: 600;
  color: #dc2626;
}

.qty-separator {
  color: #9ca3af;
}

.qty-threshold {
  color: #6b7280;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-type {
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
}

.activity-type.in {
  background: #d1fae5;
  color: #059669;
}

.activity-type.out {
  background: #fee2e2;
  color: #dc2626;
}

.activity-type.adjust {
  background: #e0e7ff;
  color: #4f46e5;
}

.activity-details {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.activity-product {
  font-weight: 500;
  color: #1a1a2e;
}

.activity-time {
  font-size: 12px;
  color: #6b7280;
}

.activity-qty {
  font-weight: 600;
  color: #1a1a2e;
}

.empty-state {
  text-align: center;
  padding: 32px;
  color: #9ca3af;
  font-size: 14px;
}
</style>
