<template>
  <AppLayout>
    <div class="audit-page">
      <div class="page-header">
        <div class="page-title-area">
          <h1 class="page-title">Audit Logs</h1>
          <nav class="breadcrumb">
            <router-link to="/">Dashboard</router-link>
            <span class="separator">/</span>
            <span class="current">Audit Logs</span>
          </nav>
        </div>
        <select v-model="entityFilter" class="form-control" style="width: 180px;" @change="fetchLogs">
          <option value="">All Actions</option>
          <option value="CREATE">Create</option>
          <option value="UPDATE">Update</option>
          <option value="DELETE">Delete</option>
          <option value="LOGIN">Login</option>
          <option value="LOGOUT">Logout</option>
          <option value="INVENTORY_IN">Stock In</option>
          <option value="INVENTORY_OUT">Stock Out</option>
          <option value="INVENTORY_ADJUST">Stock Adjust</option>
        </select>
      </div>
      
      <div v-if="loading" class="card-body text-center py-5">
        <div class="spinner-border text-primary"></div>
      </div>
      
      <div v-else>
        <div class="row mb-4">
          <div class="col-4">
            <div class="stat-card">
              <div class="stat-icon primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"/>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                </svg>
              </div>
              <div class="stat-info">
                <h3>{{ stats?.total_actions || 0 }}</h3>
                <p>Total Actions</p>
              </div>
            </div>
          </div>
          <div class="col-4">
            <div class="stat-card">
              <div class="stat-icon success">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
              <div class="stat-info">
                <h3>{{ stats?.creates || 0 }}</h3>
                <p>Creates</p>
              </div>
            </div>
          </div>
          <div class="col-4">
            <div class="stat-card">
              <div class="stat-icon warning">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </div>
              <div class="stat-info">
                <h3>{{ stats?.updates || 0 }}</h3>
                <p>Updates</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="card">
          <div class="card-body p-0">
            <div v-if="logs.length" class="logs-list">
              <div v-for="log in logs" :key="log.id" class="log-item">
                <div class="log-icon" :class="getActionClass(log.action)">
                  <svg v-if="log.action.includes('CREATE')" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <svg v-else-if="log.action.includes('UPDATE') || log.action.includes('ADJUST')" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                  </svg>
                  <svg v-else-if="log.action.includes('DELETE')" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="3 6 5 6 21 6"/>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                  </svg>
                  <svg v-else-if="log.action.includes('IN')" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="7 10 12 15 17 10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  <svg v-else-if="log.action.includes('OUT')" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="7 14 12 9 17 14"/>
                    <line x1="12" y1="9" x2="12" y2="21"/>
                  </svg>
                  <svg v-else-if="log.action.includes('LOGIN')" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                <div class="log-content">
                  <div class="log-header">
                    <span class="badge" :class="getActionBadgeClass(log.action)">{{ formatAction(log.action) }}</span>
                    <span class="log-entity text-muted">{{ formatEntity(log.entity_type) }}</span>
                    <span v-if="log.entity_id" class="log-entity-id">#{{ log.entity_id }}</span>
                  </div>
                  <div class="log-details">
                    <span class="log-user">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      {{ log.user_name || 'System' }}
                    </span>
                    <span class="log-time">
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {{ formatDateTime(log.created_at) }}
                    </span>
                  </div>
                  <div v-if="log.new_data" class="log-data">
                    <details>
                      <summary>View Changes</summary>
                      <pre>{{ formatJson(log.new_data) }}</pre>
                    </details>
                  </div>
                </div>
              </div>
            </div>
            
            <div v-else class="card-body text-center py-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="text-muted mb-3">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
              </svg>
              <h4>No audit logs found</h4>
              <p class="text-muted">Activity will appear here as actions are performed</p>
            </div>
          </div>
          
          <div v-if="logs.length >= 50" class="card-footer text-center">
            <button class="btn btn-outline" @click="loadMore">Load More</button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import { ref, onMounted } from 'vue'
import AppLayout from '@/shared/components/AppLayout.vue'
import api from '@/shared/services/api'

export default {
  name: 'AuditLogs',
  components: { AppLayout },
  setup() {
    const logs = ref([])
    const stats = ref(null)
    const loading = ref(false)
    const entityFilter = ref('')
    const skip = ref(0)
    
    const fetchLogs = async () => {
      loading.value = true
      skip.value = 0
      try {
        const params = { limit: 50, skip: 0 }
        if (entityFilter.value) {
          params.action = entityFilter.value
        }
        const response = await api.get('/audit/logs', { params })
        logs.value = response.data
      } catch (error) {
        console.error('Failed to fetch audit logs:', error)
      } finally {
        loading.value = false
      }
    }
    
    const fetchStats = async () => {
      try {
        const response = await api.get('/audit/logs/stats', { params: { days: 30 } })
        stats.value = response.data
      } catch (error) {
        console.error('Failed to fetch stats:', error)
      }
    }
    
    const loadMore = async () => {
      skip.value += 50
      try {
        const params = { limit: 50, skip: skip.value }
        if (entityFilter.value) {
          params.action = entityFilter.value
        }
        const response = await api.get('/audit/logs', { params })
        logs.value = [...logs.value, ...response.data]
      } catch (error) {
        console.error('Failed to load more logs:', error)
      }
    }
    
    const formatAction = (action) => {
      return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    }
    
    const formatEntity = (entity) => {
      return entity.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    }
    
    const formatDateTime = (date) => {
      return new Date(date).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
    
    const formatJson = (data) => {
      try {
        return JSON.stringify(data, null, 2)
      } catch {
        return String(data)
      }
    }
    
    const getActionClass = (action) => {
      if (action.includes('CREATE')) return 'create'
      if (action.includes('UPDATE') || action.includes('ADJUST')) return 'update'
      if (action.includes('DELETE')) return 'delete'
      if (action.includes('IN')) return 'in'
      if (action.includes('OUT')) return 'out'
      if (action.includes('LOGIN')) return 'login'
      return 'default'
    }
    
    const getActionBadgeClass = (action) => {
      if (action.includes('CREATE')) return 'badge-success'
      if (action.includes('UPDATE') || action.includes('ADJUST')) return 'badge-warning'
      if (action.includes('DELETE')) return 'badge-danger'
      if (action.includes('IN')) return 'badge-success'
      if (action.includes('OUT')) return 'badge-danger'
      if (action.includes('LOGIN') || action.includes('LOGOUT')) return 'badge-info'
      return 'badge-secondary'
    }
    
    onMounted(() => {
      fetchLogs()
      fetchStats()
    })
    
    return {
      logs,
      stats,
      loading,
      entityFilter,
      fetchLogs,
      loadMore,
      formatAction,
      formatEntity,
      formatDateTime,
      formatJson,
      getActionClass,
      getActionBadgeClass
    }
  }
}
</script>

<style scoped>
.audit-page {
  padding: 24px;
  max-width: 1200px;
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

.logs-list {
  display: flex;
  flex-direction: column;
}

.log-item {
  display: flex;
  gap: 16px;
  padding: 16px 24px;
  border-bottom: 1px solid var(--gray-100);
  transition: background 0.2s;
}

.log-item:hover {
  background: var(--gray-50);
}

.log-item:last-child {
  border-bottom: none;
}

.log-icon {
  width: 44px;
  height: 44px;
  border-radius: var(--border-radius);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.log-icon.create { background: rgba(40, 199, 111, 0.1); color: var(--success-color); }
.log-icon.update { background: rgba(255, 159, 67, 0.1); color: var(--warning-color); }
.log-icon.delete { background: rgba(234, 84, 85, 0.1); color: var(--danger-color); }
.log-icon.in { background: rgba(40, 199, 111, 0.1); color: var(--success-color); }
.log-icon.out { background: rgba(234, 84, 85, 0.1); color: var(--danger-color); }
.log-icon.login { background: rgba(0, 207, 232, 0.1); color: var(--info-color); }
.log-icon.default { background: var(--gray-100); color: var(--gray-600); }

.log-content {
  flex: 1;
  min-width: 0;
}

.log-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}

.log-entity {
  font-size: 14px;
}

.log-entity-id {
  color: var(--gray-400);
  font-size: 12px;
}

.log-details {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 13px;
  color: var(--gray-500);
}

.log-user, .log-time {
  display: flex;
  align-items: center;
  gap: 4px;
}

.log-data {
  margin-top: 10px;
}

.log-data details {
  background: var(--gray-50);
  border-radius: var(--border-radius);
  padding: 8px 12px;
}

.log-data summary {
  cursor: pointer;
  font-size: 13px;
  color: var(--primary-color);
}

.log-data pre {
  margin: 8px 0 0 0;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--gray-700);
}

.card-body {
  padding: 24px;
}

.card-footer {
  padding: 16px 24px;
  border-top: 1px solid var(--gray-200);
  background: var(--gray-50);
}

.py-5 {
  padding-top: 3rem;
  padding-bottom: 3rem;
}

.mb-3 {
  margin-bottom: 1rem;
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

.text-center {
  text-align: center;
}

.text-muted {
  color: var(--gray-500);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: 16px;
  }
  
  .page-header .form-control {
    width: 100% !important;
  }
  
  .log-item {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
