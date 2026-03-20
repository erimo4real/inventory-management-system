import api from '../../services/api'

const state = {
  stats: null,
  recentTransactions: [],
  loading: false,
  error: null
}

const getters = {
  dashboardStats: state => state.stats,
  recentTransactions: state => state.recentTransactions,
  dashboardLoading: state => state.loading,
  totalProducts: state => state.stats?.total_products || 0,
  totalStock: state => state.stats?.total_stock || 0,
  lowStockCount: state => state.stats?.low_stock_count || 0,
  totalValue: state => state.stats?.total_value || 0
}

const mutations = {
  SET_STATS(state, stats) {
    state.stats = stats
  },
  SET_RECENT_TRANSACTIONS(state, transactions) {
    state.recentTransactions = transactions
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchDashboardStats({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await api.get('/inventory/stats')
      commit('SET_STATS', response.data)
      commit('SET_RECENT_TRANSACTIONS', response.data.recent_transactions || [])
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch stats')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async refreshDashboard({ dispatch }) {
    await dispatch('fetchDashboardStats')
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
