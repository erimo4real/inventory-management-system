<template>
  <AppLayout>
    <div class="reports-page">
      <div class="page-header">
        <h1 class="page-title">Reports & Records</h1>
        <div class="header-actions">
          <input type="date" v-model="selectedDate" class="date-picker" @change="fetchAllReports" />
          <button class="btn-primary" @click="exportReport">
            📥 Export Report
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading">Loading reports...</div>

      <div v-else class="reports-content">
        <section class="summary-section">
          <h2>📊 Daily Summary - {{ formatDate(selectedDate) }}</h2>
          <div class="summary-grid">
            <div class="summary-card products">
              <div class="card-icon">📦</div>
              <div class="card-info">
                <span class="card-value">{{ daily?.products?.total_active_products || 0 }}</span>
                <span class="card-label">Total Products</span>
              </div>
            </div>
            <div class="summary-card stock">
              <div class="card-icon">📈</div>
              <div class="card-info">
                <span class="card-value">{{ daily?.products?.total_stock || 0 }}</span>
                <span class="card-label">Total Stock</span>
              </div>
            </div>
            <div class="summary-card value">
              <div class="card-icon">💰</div>
              <div class="card-info">
                <span class="card-value">${{ formatNumber(daily?.products?.total_value || 0) }}</span>
                <span class="card-label">Total Value</span>
              </div>
            </div>
            <div class="summary-card low-stock">
              <div class="card-icon">⚠️</div>
              <div class="card-info">
                <span class="card-value">{{ daily?.products?.low_stock_count || 0 }}</span>
                <span class="card-label">Low Stock</span>
              </div>
            </div>
            <div class="summary-card out-stock">
              <div class="card-icon">🚫</div>
              <div class="card-info">
                <span class="card-value">{{ daily?.products?.out_of_stock_count || 0 }}</span>
                <span class="card-label">Out of Stock</span>
              </div>
            </div>
            <div class="summary-card transactions">
              <div class="card-icon">🔄</div>
              <div class="card-info">
                <span class="card-value">{{ daily?.transactions?.total_transactions || 0 }}</span>
                <span class="card-label">Transactions Today</span>
              </div>
            </div>
          </div>
        </section>

        <section class="section">
          <h2>📦 Products Added Today: {{ daily?.products?.products_added_today || 0 }}</h2>
        </section>

        <section class="section">
          <h2>🔄 Today's Transactions</h2>
          <div class="transaction-summary">
            <div class="trans-card stock-in">
              <span class="trans-icon">📥</span>
              <span class="trans-value">{{ daily?.transactions?.stock_in_count || 0 }}</span>
              <span class="trans-label">Stock In ({{ daily?.transactions?.total_quantity_in || 0 }} units)</span>
            </div>
            <div class="trans-card stock-out">
              <span class="trans-icon">📤</span>
              <span class="trans-value">{{ daily?.transactions?.stock_out_count || 0 }}</span>
              <span class="trans-label">Stock Out ({{ daily?.transactions?.total_quantity_out || 0 }} units)</span>
            </div>
            <div class="trans-card adjustments">
              <span class="trans-icon">⚙️</span>
              <span class="trans-value">{{ daily?.transactions?.adjustments_count || 0 }}</span>
              <span class="trans-label">Adjustments</span>
            </div>
          </div>
        </section>

        <section class="section">
          <h2>⚠️ Low Stock Products</h2>
          <div v-if="products?.low_stock?.length" class="data-table">
            <table>
              <thead>
                <tr>
                  <th>SKU</th>
                  <th>Product Name</th>
                  <th>Current Stock</th>
                  <th>Threshold</th>
                  <th>Shortage</th>
                  <th>Supplier</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in products.low_stock" :key="item.id">
                  <td>{{ item.sku }}</td>
                  <td>{{ item.name }}</td>
                  <td class="stock-cell" :class="item.quantity === 0 ? 'out' : 'low'">{{ item.quantity }}</td>
                  <td>{{ item.low_stock_threshold }}</td>
                  <td>{{ item.shortage }}</td>
                  <td>{{ item.supplier_name }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="empty-message">No low stock products 🎉</div>
        </section>

        <section class="section">
          <h2>📊 Inventory by Category</h2>
          <div class="category-grid">
            <div v-for="cat in products?.by_category" :key="cat.category" class="category-card">
              <span class="cat-name">{{ cat.category || 'Uncategorized' }}</span>
              <div class="cat-stats">
                <span>{{ cat.product_count }} products</span>
                <span>{{ cat.total_stock }} units</span>
                <span>${{ formatNumber(cat.total_value) }}</span>
              </div>
            </div>
          </div>
        </section>

        <section class="section">
          <h2>📈 Monthly Trends</h2>
          <div v-if="trends?.length" class="trends-grid">
            <div v-for="trend in trends" :key="trend.month" class="trend-card">
              <span class="trend-month">{{ formatMonth(trend.month) }}</span>
              <div class="trend-stats">
                <span class="trend-in">📥 {{ trend.quantity_in }}</span>
                <span class="trend-out">📤 {{ trend.quantity_out }}</span>
              </div>
            </div>
          </div>
          <div v-else class="empty-message">No trend data available</div>
        </section>

        <section class="section">
          <h2>💎 Inventory Valuation</h2>
          <div v-if="inventory?.length" class="data-table">
            <table>
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Products</th>
                  <th>Quantity</th>
                  <th>Avg Price</th>
                  <th>Total Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in inventory" :key="item.category">
                  <td>{{ item.category || 'Uncategorized' }}</td>
                  <td>{{ item.product_count }}</td>
                  <td>{{ item.total_quantity }}</td>
                  <td>${{ formatNumber(item.avg_price) }}</td>
                  <td class="highlight">${{ formatNumber(item.total_value) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="empty-message">No inventory data</div>
        </section>

        <section class="section">
          <h2>👥 User Activity (Last 30 Days)</h2>
          <div v-if="users?.length" class="data-table">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                  <th>Creates</th>
                  <th>Updates</th>
                  <th>Deletes</th>
                  <th>Last Activity</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in users" :key="user.id">
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td><span class="role-badge" :class="user.role">{{ user.role }}</span></td>
                  <td class="highlight">{{ user.action_count || 0 }}</td>
                  <td>{{ user.creates || 0 }}</td>
                  <td>{{ user.updates || 0 }}</td>
                  <td>{{ user.deletes || 0 }}</td>
                  <td>{{ user.last_action ? formatDateTime(user.last_action) : 'N/A' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-else class="empty-message">No user activity data</div>
        </section>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import AppLayout from '@/shared/components/AppLayout.vue'

export default {
  name: 'Reports',
  components: { AppLayout },
  setup() {
    const store = useStore()
    const selectedDate = ref(new Date().toISOString().split('T')[0])

    const loading = computed(() => store.getters['reports/reportsLoading'])
    const daily = computed(() => store.getters['reports/dailyReport'])
    const products = computed(() => store.getters['reports/productReport'])
    const inventory = computed(() => store.getters['reports/inventoryReport'])
    const users = computed(() => store.getters['reports/userReport'])
    const trends = computed(() => store.getters['reports/trends'])

    const fetchAllReports = async () => {
      try {
        await Promise.all([
          store.dispatch('reports/fetchDailyReport'),
          store.dispatch('reports/fetchInventoryReport'),
          store.dispatch('reports/fetchUserReport', { days: 30 }),
          store.dispatch('reports/fetchTrends', { months: 6 })
        ])
      } catch (error) {
        console.error('Failed to fetch reports:', error)
      }
    }

    const exportReport = async () => {
      try {
        await store.dispatch('reports/exportReport', { date: selectedDate.value })
      } catch (error) {
        console.error('Failed to export report:', error)
      }
    }

    const formatDate = (dateStr) => {
      return new Date(dateStr).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    const formatMonth = (dateStr) => {
      return new Date(dateStr).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric'
      })
    }

    const formatDateTime = (dateStr) => {
      return new Date(dateStr).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }

    const formatNumber = (num) => {
      return parseFloat(num || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }

    onMounted(() => {
      fetchAllReports()
    })

    return {
      selectedDate,
      loading,
      daily,
      inventory,
      users,
      trends,
      fetchAllReports,
      exportReport,
      formatDate,
      formatMonth,
      formatDateTime,
      formatNumber
    }
  }
}
</script>

<style scoped>
.reports-page {
  max-width: 1400px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.date-picker {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
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

.loading {
  text-align: center;
  padding: 48px;
  color: #6b7280;
}

.summary-section {
  margin-bottom: 32px;
}

.summary-section h2 {
  font-size: 18px;
  color: #1a1a2e;
  margin-bottom: 16px;
}

.summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.summary-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.summary-card .card-icon {
  font-size: 32px;
}

.summary-card .card-info {
  display: flex;
  flex-direction: column;
}

.summary-card .card-value {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a2e;
}

.summary-card .card-label {
  font-size: 12px;
  color: #6b7280;
  text-transform: uppercase;
}

.summary-card.products { border-left: 4px solid #4f46e5; }
.summary-card.stock { border-left: 4px solid #059669; }
.summary-card.value { border-left: 4px solid #f59e0b; }
.summary-card.low-stock { border-left: 4px solid #f97316; }
.summary-card.out-stock { border-left: 4px solid #dc2626; }
.summary-card.transactions { border-left: 4px solid #8b5cf6; }

.section {
  background: white;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.section h2 {
  font-size: 18px;
  color: #1a1a2e;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
}

.transaction-summary {
  display: flex;
  gap: 16px;
}

.trans-card {
  flex: 1;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.trans-card.stock-in { background: #d1fae5; }
.trans-card.stock-out { background: #fee2e2; }
.trans-card.adjustments { background: #fef3c7; }

.trans-card .trans-icon { font-size: 24px; }
.trans-card .trans-value { font-size: 28px; font-weight: 700; color: #1a1a2e; }
.trans-card .trans-label { font-size: 12px; color: #6b7280; }

.data-table {
  overflow-x: auto;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th, .data-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.data-table th {
  background: #f9fafb;
  font-size: 12px;
  text-transform: uppercase;
  color: #6b7280;
  font-weight: 600;
}

.data-table td {
  font-size: 14px;
  color: #1a1a2e;
}

.data-table .highlight {
  font-weight: 600;
  color: #4f46e5;
}

.data-table .stock-cell.low { color: #f97316; }
.data-table .stock-cell.out { color: #dc2626; font-weight: 600; }

.empty-message {
  text-align: center;
  padding: 32px;
  color: #6b7280;
  font-size: 14px;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 12px;
}

.category-card {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
}

.category-card .cat-name {
  font-weight: 600;
  color: #1a1a2e;
  display: block;
  margin-bottom: 8px;
}

.category-card .cat-stats {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
  color: #6b7280;
}

.trends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
}

.trend-card {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  text-align: center;
}

.trend-month {
  font-weight: 600;
  color: #1a1a2e;
  display: block;
  margin-bottom: 8px;
}

.trend-stats {
  display: flex;
  justify-content: center;
  gap: 16px;
  font-size: 13px;
}

.trend-in { color: #059669; }
.trend-out { color: #dc2626; }

.role-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: capitalize;
}

.role-badge.admin { background: #eef2ff; color: #4f46e5; }
.role-badge.manager { background: #fce7f3; color: #db2777; }
.role-badge.staff { background: #e0f2fe; color: #0284c7; }
</style>
