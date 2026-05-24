<template>
  <AppLayout>
    <div class="dashboard">
      <!-- Stats Grid -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
              <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>
          </div>
          <div class="stat-info">
            <h3>{{ formatNumber(summary.products?.total || 0) }}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon danger">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div class="stat-info">
            <h3>{{ summary.products?.low_stock_count || 0 }}</h3>
            <p>Low Stock Items</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="1" x2="12" y2="23"/>
              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
          </div>
          <div class="stat-info">
            <h3>${{ formatNumber(summary.products?.total_value || 0) }}</h3>
            <p>Inventory Value</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon info">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="23 4 23 10 17 10"/>
              <polyline points="1 20 1 14 7 14"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
          </div>
          <div class="stat-info">
            <h3>{{ summary.transactions_30d?.IN || 0 }}</h3>
            <p>Stock In (30d)</p>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="charts-grid">
        <!-- Stock Movement Chart -->
        <div class="card chart-card">
          <div class="card-header">
            <h4>Stock Movement</h4>
            <div class="chart-legend">
              <span class="legend-item">
                <span class="legend-dot success"></span> Stock In
              </span>
              <span class="legend-item">
                <span class="legend-dot danger"></span> Stock Out
              </span>
            </div>
          </div>
          <div class="card-body">
            <div class="bar-chart">
              <div class="bar-group" v-for="(month, index) in monthlyData" :key="index">
                <div class="bar-container">
                  <div class="bar-wrapper">
                    <div class="bar bar-in" :style="{ height: month.inPercent + '%' }">
                      <span class="bar-value">{{ month.in }}</span>
                    </div>
                    <div class="bar bar-out" :style="{ height: month.outPercent + '%' }">
                      <span class="bar-value">{{ month.out }}</span>
                    </div>
                  </div>
                </div>
                <span class="bar-label">{{ month.label }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Inventory by Category -->
        <div class="card chart-card">
          <div class="card-header">
            <h4>Inventory Distribution</h4>
          </div>
          <div class="card-body">
            <div class="donut-chart-container">
              <div class="donut-chart">
                <svg viewBox="0 0 100 100">
                  <circle class="donut-segment" v-for="(cat, index) in categoryData" :key="index"
                    cx="50" cy="50" r="40"
                    fill="none"
                    :stroke="cat.color"
                    stroke-width="12"
                    :stroke-dasharray="cat.dashArray"
                    :stroke-dashoffset="cat.dashOffset"
                    :style="{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }"
                  />
                </svg>
                <div class="donut-center">
                  <span class="donut-value">{{ totalItems }}</span>
                  <span class="donut-label">Items</span>
                </div>
              </div>
              <div class="donut-legend">
                <div class="donut-legend-item" v-for="(cat, index) in categoryData.slice(0, 5)" :key="index">
                  <span class="legend-color" :style="{ background: cat.color }"></span>
                  <span class="legend-name">{{ cat.name }}</span>
                  <span class="legend-value">{{ cat.value }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Data Grid -->
      <div class="dashboard-grid">
        <div class="card">
          <div class="card-header">
            <h4>Low Stock Alerts</h4>
            <router-link to="/products?low_stock=true" class="btn btn-sm btn-outline">View All</router-link>
          </div>
          <div class="card-body">
            <div v-if="summary.low_stock_products?.length" class="alert-list">
              <div 
                v-for="product in summary.low_stock_products" 
                :key="product.id"
                class="alert-item"
              >
                <div class="alert-icon danger">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div class="alert-content">
                  <span class="alert-name">{{ product.name }}</span>
                  <span class="alert-sku">{{ product.sku }}</span>
                </div>
                <div class="alert-quantity">
                  <span class="qty-badge danger">{{ product.quantity }} / {{ product.threshold }}</span>
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <div class="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h4>All Stock Levels OK</h4>
              <p>No low stock items at the moment</p>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <h4>Recent Activity</h4>
            <router-link to="/inventory" class="btn btn-sm btn-outline">View All</router-link>
          </div>
          <div class="card-body">
            <div v-if="recentTransactions.length" class="activity-list">
              <div 
                v-for="transaction in recentTransactions.slice(0, 6)" 
                :key="transaction.id"
                class="activity-item"
              >
                <div class="activity-icon" :class="transaction.type.toLowerCase()">
                  <svg v-if="transaction.type === 'IN'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="19" x2="12" y2="5"/>
                    <polyline points="5 12 12 5 19 12"/>
                  </svg>
                  <svg v-else-if="transaction.type === 'OUT'" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <polyline points="19 12 12 19 5 12"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="17 1 21 5 17 9"/>
                    <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
                  </svg>
                </div>
                <div class="activity-content">
                  <span class="activity-product">{{ transaction.product_name || 'Product' }}</span>
                  <span class="activity-meta">{{ transaction.reference || 'Manual' }} • {{ formatDate(transaction.created_at) }}</span>
                </div>
                <div class="activity-qty" :class="transaction.type.toLowerCase()">
                  {{ transaction.type === 'OUT' ? '-' : '+' }}{{ transaction.quantity }}
                </div>
              </div>
            </div>
            <div v-else class="empty-state">
              <div class="empty-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
              </div>
              <h4>No Recent Activity</h4>
              <p>Stock transactions will appear here</p>
            </div>
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
    
    const monthlyData = computed(() => {
      const inCount = summary.value.transactions_30d?.IN || 0
      const outCount = summary.value.transactions_30d?.OUT || 0
      const maxVal = Math.max(inCount, outCount, 100)
      
      return [
        { label: 'This Month', in: inCount, out: outCount, inPercent: (inCount / maxVal) * 100, outPercent: (outCount / maxVal) * 100 }
      ]
    })
    
    const categoryData = computed(() => {
      const colors = ['#7367f0', '#28c76f', '#ff9f43', '#00cfe8', '#ea5455']
      const categories = [
        { name: 'Electronics', value: 12 },
        { name: 'Furniture', value: 8 },
        { name: 'Office Supplies', value: 15 },
        { name: 'IT Equipment', value: 6 },
        { name: 'Safety Gear', value: 4 }
      ]
      
      const total = categories.reduce((sum, c) => sum + c.value, 0)
      let offset = 0
      
      return categories.map((cat, i) => {
        const percent = (cat.value / total) * 100
        const circumference = 2 * Math.PI * 40
        const dashArray = `${(percent / 100) * circumference} ${circumference}`
        const dashOffset = -(offset / 100) * circumference
        offset += percent
        
        return {
          ...cat,
          color: colors[i],
          dashArray,
          dashOffset,
          percent
        }
      })
    })
    
    const totalItems = computed(() => {
      return categoryData.value.reduce((sum, c) => sum + c.value, 0)
    })
    
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
      monthlyData,
      categoryData,
      totalItems,
      formatNumber,
      formatDate
    }
  }
}
</script>

<style scoped>
.dashboard {
  max-width: 1400px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
  transition: var(--transition);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.primary {
  background: rgba(115, 103, 240, 0.1);
  color: var(--primary-color);
}

.stat-icon.success {
  background: rgba(40, 199, 111, 0.1);
  color: var(--success-color);
}

.stat-icon.danger {
  background: rgba(234, 84, 85, 0.1);
  color: var(--danger-color);
}

.stat-icon.info {
  background: rgba(0, 207, 232, 0.1);
  color: var(--info-color);
}

.stat-info h3 {
  font-size: 28px;
  font-weight: 700;
  color: var(--gray-900);
  margin-bottom: 4px;
}

.stat-info p {
  font-size: 13px;
  color: var(--gray-500);
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: 1.5fr 1fr;
  gap: 24px;
  margin-bottom: 24px;
}

.chart-card {
  min-height: 350px;
}

.chart-legend {
  display: flex;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--gray-600);
}

.legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.legend-dot.success { background: var(--success-color); }
.legend-dot.danger { background: var(--danger-color); }

/* Bar Chart */
.bar-chart {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 24px;
  height: 220px;
  padding: 20px 0;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.bar-container {
  height: 180px;
  display: flex;
  align-items: flex-end;
}

.bar-wrapper {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}

.bar {
  width: 40px;
  border-radius: 6px 6px 0 0;
  position: relative;
  transition: height 0.5s ease;
  min-height: 20px;
}

.bar-in {
  background: linear-gradient(180deg, var(--success-color) 0%, #1fab4d 100%);
}

.bar-out {
  background: linear-gradient(180deg, var(--danger-color) 0%, #d63c3d 100%);
}

.bar-value {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  font-weight: 600;
  color: var(--gray-700);
}

.bar-label {
  font-size: 12px;
  color: var(--gray-500);
  font-weight: 500;
}

/* Donut Chart */
.donut-chart-container {
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 20px;
}

.donut-chart {
  position: relative;
  width: 160px;
  height: 160px;
}

.donut-chart svg {
  width: 100%;
  height: 100%;
}

.donut-segment {
  transition: stroke-dasharray 0.5s ease;
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.donut-value {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: var(--gray-900);
}

.donut-label {
  font-size: 12px;
  color: var(--gray-500);
}

.donut-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.donut-legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  flex-shrink: 0;
}

.legend-name {
  flex: 1;
  font-size: 13px;
  color: var(--gray-700);
}

.legend-value {
  font-size: 13px;
  font-weight: 600;
  color: var(--gray-800);
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

.card {
  background: var(--white);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--gray-200);
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-900);
}

.card-body {
  padding: 0;
}

/* Alert List */
.alert-list {
  display: flex;
  flex-direction: column;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--gray-100);
  transition: var(--transition);
}

.alert-item:last-child {
  border-bottom: none;
}

.alert-item:hover {
  background: var(--gray-50);
}

.alert-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.alert-icon.danger {
  background: rgba(234, 84, 85, 0.1);
  color: var(--danger-color);
}

.alert-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.alert-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-800);
}

.alert-sku {
  font-size: 12px;
  color: var(--gray-500);
}

.qty-badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.qty-badge.danger {
  background: rgba(234, 84, 85, 0.1);
  color: var(--danger-color);
}

/* Activity List */
.activity-list {
  display: flex;
  flex-direction: column;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--gray-100);
  transition: var(--transition);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-item:hover {
  background: var(--gray-50);
}

.activity-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.in {
  background: rgba(40, 199, 111, 0.1);
  color: var(--success-color);
}

.activity-icon.out {
  background: rgba(234, 84, 85, 0.1);
  color: var(--danger-color);
}

.activity-icon.adjust {
  background: rgba(115, 103, 240, 0.1);
  color: var(--primary-color);
}

.activity-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.activity-product {
  font-size: 14px;
  font-weight: 500;
  color: var(--gray-800);
}

.activity-meta {
  font-size: 12px;
  color: var(--gray-500);
}

.activity-qty {
  font-size: 14px;
  font-weight: 600;
}

.activity-qty.in {
  color: var(--success-color);
}

.activity-qty.out {
  color: var(--danger-color);
}

.activity-qty.adjust {
  color: var(--primary-color);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 48px 24px;
}

.empty-icon {
  color: var(--gray-400);
  margin-bottom: 16px;
}

.empty-state h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--gray-800);
  margin-bottom: 4px;
}

.empty-state p {
  font-size: 13px;
  color: var(--gray-500);
}

@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
