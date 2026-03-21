<template>
  <AppLayout>
    <div class="reports-page">
      <div class="page-header">
        <div class="page-title-area">
          <h1 class="page-title">Reports & Records</h1>
          <nav class="breadcrumb">
            <router-link to="/">Dashboard</router-link>
            <span class="separator">/</span>
            <span class="current">Reports</span>
          </nav>
        </div>
        <div class="d-flex gap-3 align-center">
          <input type="date" v-model="selectedDate" class="form-control" style="width: 180px;" @change="fetchAllReports" />
          <button class="btn btn-primary" @click="exportReport">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Export Report
          </button>
        </div>
      </div>

      <div v-if="loading" class="card-body text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>

      <div v-else class="reports-content">
        <section class="mb-4">
          <h2 class="section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            Daily Summary - {{ formatDate(selectedDate) }}
          </h2>
          <div class="row">
            <div class="col-4">
              <div class="stat-card">
                <div class="stat-icon primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                  </svg>
                </div>
                <div class="stat-info">
                  <h3>{{ daily?.products?.total_active_products || 0 }}</h3>
                  <p>Total Products</p>
                </div>
              </div>
            </div>
            <div class="col-4">
              <div class="stat-card">
                <div class="stat-icon success">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                    <line x1="12" y1="22.08" x2="12" y2="12"/>
                  </svg>
                </div>
                <div class="stat-info">
                  <h3>{{ daily?.products?.total_stock || 0 }}</h3>
                  <p>Total Stock</p>
                </div>
              </div>
            </div>
            <div class="col-4">
              <div class="stat-card">
                <div class="stat-icon warning">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <div class="stat-info">
                  <h3>${{ formatNumber(daily?.products?.total_value || 0) }}</h3>
                  <p>Total Value</p>
                </div>
              </div>
            </div>
            <div class="col-4">
              <div class="stat-card">
                <div class="stat-icon" style="background: rgba(255,159,67,0.1); color: #ff9f43;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/>
                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                </div>
                <div class="stat-info">
                  <h3>{{ daily?.products?.low_stock_count || 0 }}</h3>
                  <p>Low Stock</p>
                </div>
              </div>
            </div>
            <div class="col-4">
              <div class="stat-card">
                <div class="stat-icon danger">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
                  </svg>
                </div>
                <div class="stat-info">
                  <h3>{{ daily?.products?.out_of_stock_count || 0 }}</h3>
                  <p>Out of Stock</p>
                </div>
              </div>
            </div>
            <div class="col-4">
              <div class="stat-card">
                <div class="stat-icon" style="background: rgba(139,92,246,0.1); color: #8b5cf6;">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="23 4 23 10 17 10"/>
                    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                  </svg>
                </div>
                <div class="stat-info">
                  <h3>{{ daily?.transactions?.total_transactions || 0 }}</h3>
                  <p>Transactions Today</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="card mb-4">
          <div class="card-body">
            <h2 class="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
              Today's Transactions
            </h2>
            <div class="d-flex gap-3">
              <div class="trans-card stock-in">
                <div class="trans-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </div>
                <span class="trans-value">{{ daily?.transactions?.stock_in_count || 0 }}</span>
                <span class="trans-label">Stock In ({{ daily?.transactions?.total_quantity_in || 0 }} units)</span>
              </div>
              <div class="trans-card stock-out">
                <div class="trans-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="7 14 12 9 17 14"/>
                    <line x1="12" y1="9" x2="12" y2="21"/>
                  </svg>
                </div>
                <span class="trans-value">{{ daily?.transactions?.stock_out_count || 0 }}</span>
                <span class="trans-label">Stock Out ({{ daily?.transactions?.total_quantity_out || 0 }} units)</span>
              </div>
              <div class="trans-card adjustments">
                <div class="trans-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3"/>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                </div>
                <span class="trans-value">{{ daily?.transactions?.adjustments_count || 0 }}</span>
                <span class="trans-label">Adjustments</span>
              </div>
            </div>
          </div>
        </section>

        <section class="card mb-4">
          <div class="card-body p-0">
            <div class="card-header">
              <h2 class="section-title mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                Low Stock Products
              </h2>
            </div>
            <div v-if="products?.low_stock?.length" class="table-responsive">
              <table class="table">
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
                    <td><code class="sku-code">{{ item.sku }}</code></td>
                    <td class="fw-600">{{ item.name }}</td>
                    <td>
                      <span class="badge" :class="item.quantity === 0 ? 'badge-danger' : 'badge-warning'">
                        {{ item.quantity }}
                      </span>
                    </td>
                    <td>{{ item.low_stock_threshold }}</td>
                    <td class="text-danger fw-600">{{ item.shortage }}</td>
                    <td>{{ item.supplier_name || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="card-body text-center text-muted py-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="mb-2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <p>No low stock products</p>
            </div>
          </div>
        </section>

        <section class="card mb-4">
          <div class="card-body">
            <h2 class="section-title">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
              </svg>
              Inventory by Category
            </h2>
            <div class="row">
              <div v-for="cat in products?.by_category" :key="cat.category" class="col-4">
                <div class="category-stat-card">
                  <h4>{{ cat.category || 'Uncategorized' }}</h4>
                  <div class="cat-stats">
                    <span class="stat-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                      </svg>
                      {{ cat.product_count }} products
                    </span>
                    <span class="stat-item">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      </svg>
                      {{ cat.total_stock }} units
                    </span>
                    <span class="stat-item text-primary fw-600">
                      ${{ formatNumber(cat.total_value) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="card mb-4">
          <div class="card-body p-0">
            <div class="card-header">
              <h2 class="section-title mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
                Monthly Trends
              </h2>
            </div>
            <div v-if="trends?.length" class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Stock In</th>
                    <th>Stock Out</th>
                    <th>Net Change</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="trend in trends" :key="trend.month">
                    <td class="fw-600">{{ formatMonth(trend.month) }}</td>
                    <td><span class="badge badge-success">+{{ trend.quantity_in }}</span></td>
                    <td><span class="badge badge-danger">-{{ trend.quantity_out }}</span></td>
                    <td class="fw-600" :class="trend.quantity_in - trend.quantity_out >= 0 ? 'text-success' : 'text-danger'">
                      {{ trend.quantity_in - trend.quantity_out >= 0 ? '+' : '' }}{{ trend.quantity_in - trend.quantity_out }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="card-body text-center text-muted py-4">
              <p>No trend data available</p>
            </div>
          </div>
        </section>

        <section class="card mb-4">
          <div class="card-body p-0">
            <div class="card-header">
              <h2 class="section-title mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
                Inventory Valuation
              </h2>
            </div>
            <div v-if="inventory?.length" class="table-responsive">
              <table class="table">
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
                    <td class="fw-600">{{ item.category || 'Uncategorized' }}</td>
                    <td>{{ item.product_count }}</td>
                    <td>{{ item.total_quantity }}</td>
                    <td>${{ formatNumber(item.avg_price) }}</td>
                    <td class="text-primary fw-600">${{ formatNumber(item.total_value) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="card-body text-center text-muted py-4">
              <p>No inventory data</p>
            </div>
          </div>
        </section>

        <section class="card">
          <div class="card-body p-0">
            <div class="card-header">
              <h2 class="section-title mb-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                User Activity (Last 30 Days)
              </h2>
            </div>
            <div v-if="users?.length" class="table-responsive">
              <table class="table">
                <thead>
                  <tr>
                    <th>User</th>
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
                    <td>
                      <div class="d-flex align-center gap-2">
                        <div class="avatar-sm" :class="user.role">{{ user.name?.charAt(0).toUpperCase() }}</div>
                        <div>
                          <div class="fw-600">{{ user.name }}</div>
                          <div class="text-muted small">{{ user.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td><span class="badge" :class="getRoleBadgeClass(user.role)">{{ user.role }}</span></td>
                    <td class="fw-600">{{ user.action_count || 0 }}</td>
                    <td>{{ user.creates || 0 }}</td>
                    <td>{{ user.updates || 0 }}</td>
                    <td>{{ user.deletes || 0 }}</td>
                    <td class="text-muted">{{ user.last_action ? formatDateTime(user.last_action) : 'N/A' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="card-body text-center text-muted py-4">
              <p>No user activity data</p>
            </div>
          </div>
        </section>
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
        showError('Failed to load reports')
      }
    }

    const exportReport = async () => {
      try {
        await store.dispatch('reports/exportReport', { date: selectedDate.value })
        showSuccess('Report exported successfully')
      } catch (error) {
        showError('Failed to export report')
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

    const getRoleBadgeClass = (role) => {
      switch (role) {
        case 'admin': return 'badge-primary'
        case 'manager': return 'badge-warning'
        case 'staff': return 'badge-info'
        default: return 'badge-secondary'
      }
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
      formatNumber,
      getRoleBadgeClass
    }
  }
}
</script>

<style scoped>
.reports-page {
  padding: 24px;
  max-width: 1400px;
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
  font-size: 18px;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 16px;
}

.section-title svg {
  color: var(--primary-color);
}

.avatar-sm {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: white;
}

.avatar-sm.admin { background: linear-gradient(135deg, #7367f0, #5b52d9); }
.avatar-sm.manager { background: linear-gradient(135deg, #ff9f43, #f77e4a); }
.avatar-sm.staff { background: linear-gradient(135deg, #00cfe8, #00a7c4); }

.sku-code {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  background: var(--gray-100);
  padding: 4px 8px;
  border-radius: 4px;
}

.fw-600 {
  font-weight: 600;
}

.trans-card {
  flex: 1;
  padding: 24px;
  border-radius: var(--border-radius-lg);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.trans-card.stock-in {
  background: rgba(40, 199, 111, 0.1);
  border: 1px solid rgba(40, 199, 111, 0.2);
}

.trans-card.stock-in .trans-icon {
  color: var(--success-color);
}

.trans-card.stock-out {
  background: rgba(234, 84, 85, 0.1);
  border: 1px solid rgba(234, 84, 85, 0.2);
}

.trans-card.stock-out .trans-icon {
  color: var(--danger-color);
}

.trans-card.adjustments {
  background: rgba(255, 159, 67, 0.1);
  border: 1px solid rgba(255, 159, 67, 0.2);
}

.trans-card.adjustments .trans-icon {
  color: var(--warning-color);
}

.trans-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trans-value {
  font-size: 32px;
  font-weight: 700;
  color: var(--gray-900);
}

.trans-label {
  font-size: 13px;
  color: var(--gray-500);
}

.category-stat-card {
  background: var(--gray-50);
  border-radius: var(--border-radius);
  padding: 20px;
  margin-bottom: 16px;
}

.category-stat-card h4 {
  font-size: 15px;
  font-weight: 600;
  color: var(--gray-900);
  margin-bottom: 12px;
}

.cat-stats {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--gray-600);
}

.text-success {
  color: var(--success-color);
}

.text-danger {
  color: var(--danger-color);
}

.text-primary {
  color: var(--primary-color);
}

.text-muted {
  color: var(--gray-500);
}

.small {
  font-size: 12px;
}

.card-body {
  padding: 24px;
}

.card-header {
  padding: 20px 24px;
  border-bottom: 1px solid var(--gray-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.p-0 {
  padding: 0 !important;
}

.py-4 {
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.mb-0 {
  margin-bottom: 0 !important;
}

.mb-2 {
  margin-bottom: 0.5rem;
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

@media (max-width: 992px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .trans-card {
    padding: 16px;
  }
  
  .trans-value {
    font-size: 24px;
  }
}
</style>
