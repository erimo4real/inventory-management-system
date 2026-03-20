import api from '../../services/api'

const state = {
  transactions: [],
  productHistory: [],
  loading: false,
  error: null
}

const getters = {
  allTransactions: state => state.transactions,
  productHistory: state => state.productHistory,
  inventoryLoading: state => state.loading
}

const mutations = {
  SET_TRANSACTIONS(state, transactions) {
    state.transactions = transactions
  },
  SET_PRODUCT_HISTORY(state, history) {
    state.productHistory = history
  },
  ADD_TRANSACTION(state, transaction) {
    state.transactions.unshift(transaction)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchTransactions({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await api.get('/inventory/history', { params })
      commit('SET_TRANSACTIONS', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.detail || 'Failed to fetch transactions')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchProductHistory({ commit }, productId) {
    try {
      const response = await api.get(`/inventory/history/${productId}`)
      commit('SET_PRODUCT_HISTORY', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async stockIn({ commit }, data) {
    try {
      const response = await api.post('/inventory/in', data)
      commit('ADD_TRANSACTION', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async stockOut({ commit }, data) {
    try {
      const response = await api.post('/inventory/out', data)
      commit('ADD_TRANSACTION', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async adjustStock({ commit }, { productId, data }) {
    try {
      const response = await api.post(`/inventory/adjust/${productId}`, data)
      commit('ADD_TRANSACTION', response.data)
      return response.data
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
