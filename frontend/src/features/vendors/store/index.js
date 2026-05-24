import api from '@/shared/services/api'

const state = {
  vendors: [],
  currentVendor: null,
  stats: null,
  categories: [],
  loading: false,
  error: null
}

const getters = {
  allVendors: state => state.vendors,
  vendorsLoading: state => state.loading
}

const mutations = {
  SET_VENDORS(state, vendors) {
    state.vendors = vendors
  },
  SET_CURRENT_VENDOR(state, vendor) {
    state.currentVendor = vendor
  },
  SET_STATS(state, stats) {
    state.stats = stats
  },
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  ADD_VENDOR(state, vendor) {
    state.vendors.unshift(vendor)
  },
  UPDATE_VENDOR(state, updatedVendor) {
    const index = state.vendors.findIndex(v => v.id === updatedVendor.id)
    if (index !== -1) {
      state.vendors.splice(index, 1, updatedVendor)
    }
  },
  DELETE_VENDOR(state, vendorId) {
    state.vendors = state.vendors.filter(v => v.id !== vendorId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchVendors({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await api.get('/vendors', { params })
      commit('SET_VENDORS', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch vendors')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchVendor({ commit }, vendorId) {
    try {
      const response = await api.get(`/vendors/${vendorId}`)
      commit('SET_CURRENT_VENDOR', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async fetchVendorStats({ commit }) {
    try {
      const response = await api.get('/vendors/stats')
      commit('SET_STATS', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async fetchVendorCategories({ commit }) {
    try {
      const response = await api.get('/vendors/categories')
      commit('SET_CATEGORIES', response.data.categories || [])
      return response.data.categories || []
    } catch (error) {
      throw error
    }
  },

  async createVendor({ commit }, vendorData) {
    try {
      const response = await api.post('/vendors', vendorData)
      commit('ADD_VENDOR', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async updateVendor({ commit }, { id, data }) {
    try {
      const response = await api.put(`/vendors/${id}`, data)
      commit('UPDATE_VENDOR', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async deleteVendor({ commit }, vendorId) {
    try {
      await api.delete(`/vendors/${vendorId}`)
      commit('DELETE_VENDOR', vendorId)
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
