<template>
  <AppLayout>
    <div class="audit-page">
      <div class="page-header">
        <h1 class="page-title">Audit Logs</h1>
        <div class="header-actions">
          <select v-model="entityFilter" class="filter-select" @change="fetchLogs">
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
      </div>
      
      <div v-if="loading" class="loading">Loading...</div>
      
      <div v-else class="logs-container">
        <div class="stats-row">
          <div class="stat-card">
            <span class="stat-number">{{ stats?.total_actions || 0 }}</span>
            <span class="stat-label">Total Actions</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ stats?.creates || 0 }}</span>
            <span class="stat-label">Creates</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ stats?.updates || 0 }}</span>
            <span class="stat-label">Updates</span>
          </div>
          <div class="stat-card">
            <span class="stat-number">{{ stats?.deletes || 0 }}</span>
            <span class="stat-label">Deletes</span>
          </div>
        </div>
        
        <div class="logs-list">
          <div v-for="log in logs" :key="log.id" class="log-item">
            <div class="log-icon" :class="getActionClass(log.action)">
              {{ getActionIcon(log.action) }}
            </div>
            <div class="log-content">
              <div class="log-header">
                <span class="log-action">{{ formatAction(log.action) }}</span>
                <span class="log-entity">{{ formatEntity(log.entity_type) }}</span>
                <span v-if="log.entity_id" class="log-entity-id">#{{ log.entity_id }}</span>
              </div>
              <div class="log-details">
                <span class="log-user">by {{ log.user_name || 'System' }}</span>
                <span class="log-time">{{ formatDateTime(log.created_at) }}</span>
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
        
        <div v-if="!loading && !logs.length" class="empty-state">
          No audit logs found
        </div>
        
        <div v-if="logs.length >= 50" class="load-more">
          <button class="btn-secondary" @click="loadMore">Load More</button>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { auditAPI } from '../services/api'
import AppLayout from '../components/common/AppLayout.vue'

export default {
  name: 'AuditLogs',
  components: { AppLayout },
  setup() {
    const store = useStore()
    
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
        const response = await auditAPI.getLogs(params)
        logs.value = response.data
      } catch (error) {
        console.error('Failed to fetch audit logs:', error)
      } finally {
        loading.value = false
      }
    }
    
    const fetchStats = async () => {
      try {
        const response = await auditAPI.getStats({ days: 30 })
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
        const response = await auditAPI.getLogs(params)
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
      if (action.includes('CREATE') || action.includes('IN')) return 'create'
      if (action.includes('UPDATE') || action.includes('ADJUST')) return 'update'
      if (action.includes('DELETE') || action.includes('OUT')) return 'delete'
      if (action.includes('LOGIN')) return 'login'
      return 'default'
    }
    
    const getActionIcon = (action) => {
      if (action.includes('CREATE')) return '➕'
      if (action.includes('UPDATE') || action.includes('ADJUST')) return '✏️'
      if (action.includes('DELETE')) return '🗑️'
      if (action.includes('IN')) return '📥'
      if (action.includes('OUT')) return '📤'
      if (action.includes('LOGIN')) return '🔓'
      if (action.includes('LOGOUT')) return '🔒'
      return '📋'
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
      getActionIcon
    }
  }
}
</script>

<style scoped>
.audit-page {
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

.filter-select {
  padding: 10px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
}

.stats-row {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 20px 28px;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #4f46e5;
}

.stat-label {
  font-size: 13px;
  color: #6b7280;
  margin-top: 4px;
}

.logs-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.log-item {
  display: flex;
  gap: 16px;
  background: white;
  padding: 16px 20px;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.log-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
}

.log-icon.create { background: #d1fae5; }
.log-icon.update { background: #fef3c7; }
.log-icon.delete { background: #fee2e2; }
.log-icon.login { background: #e0e7ff; }
.log-icon.default { background: #f3f4f6; }

.log-content {
  flex: 1;
}

.log-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.log-action {
  font-weight: 600;
  color: #1a1a2e;
}

.log-entity {
  color: #6b7280;
}

.log-entity-id {
  color: #9ca3af;
  font-size: 13px;
}

.log-details {
  display: flex;
  gap: 16px;
  font-size: 13px;
  color: #6b7280;
}

.log-data {
  margin-top: 10px;
}

.log-data details {
  background: #f9fafb;
  border-radius: 6px;
  padding: 8px 12px;
}

.log-data summary {
  cursor: pointer;
  font-size: 13px;
  color: #4f46e5;
}

.log-data pre {
  margin: 8px 0 0 0;
  font-size: 12px;
  white-space: pre-wrap;
  word-break: break-all;
  color: #374151;
}

.loading, .empty-state {
  text-align: center;
  padding: 48px;
  color: #6b7280;
}

.load-more {
  text-align: center;
  margin-top: 20px;
}

.btn-secondary {
  padding: 10px 24px;
  background: #f3f4f6;
  color: #374151;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #e5e7eb;
}
</style>
