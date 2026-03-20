import { reportsAPI } from '../../services/api'

const state = {
  daily: null,
  products: null,
  inventory: null,
  transactions: null,
  clients: null,
  vendors: null,
  users: null,
  trends: null,
  complete: null,
  loading: false,
  error: null
}

const getters = {
  dailyReport: state => state.daily,
  productReport: state => state.products,
  inventoryReport: state => state.inventory,
  transactionReport: state => state.transactions,
  completeReport: state => state.complete,
  reportsLoading: state => state.loading
}

const mutations = {
  SET_DAILY(state, data) { state.daily = data },
  SET_PRODUCTS(state, data) { state.products = data },
  SET_INVENTORY(state, data) { state.inventory = data },
  SET_TRANSACTIONS(state, data) { state.transactions = data },
  SET_CLIENTS(state, data) { state.clients = data },
  SET_VENDORS(state, data) { state.vendors = data },
  SET_USERS(state, data) { state.users = data },
  SET_TRENDS(state, data) { state.trends = data },
  SET_COMPLETE(state, data) { state.complete = data },
  SET_LOADING(state, loading) { state.loading = loading },
  SET_ERROR(state, error) { state.error = error },
  CLEAR_REPORTS(state) {
    state.daily = null
    state.products = null
    state.inventory = null
    state.transactions = null
    state.clients = null
    state.vendors = null
    state.users = null
    state.trends = null
    state.complete = null
  }
}

const actions = {
  async fetchDailyReport({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await reportsAPI.getDaily(params)
      commit('SET_DAILY', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch daily report')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchProductReport({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await reportsAPI.getProducts(params)
      commit('SET_PRODUCTS', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch product report')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchInventoryReport({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await reportsAPI.getInventory()
      commit('SET_INVENTORY', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch inventory report')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchTransactionReport({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await reportsAPI.getTransactions(params)
      commit('SET_TRANSACTIONS', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch transaction report')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchClientReport({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await reportsAPI.getClients()
      commit('SET_CLIENTS', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch client report')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchVendorReport({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await reportsAPI.getVendors()
      commit('SET_VENDORS', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch vendor report')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchUserReport({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await reportsAPI.getUsers(params)
      commit('SET_USERS', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch user report')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchTrends({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await reportsAPI.getTrends(params)
      commit('SET_TRENDS', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch trends')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchCompleteReport({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await reportsAPI.getComplete(params)
      commit('SET_COMPLETE', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch complete report')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async exportReport({ commit }, params = {}) {
    try {
      const response = await reportsAPI.exportReport(params)
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      const date = new Date().toISOString().split('T')[0]
      link.href = url
      link.setAttribute('download', `inventory-report-${date}.txt`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      throw error
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
}
