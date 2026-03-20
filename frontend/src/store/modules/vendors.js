import { vendorsAPI } from '../../services/api'

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
  currentVendor: state => state.currentVendor,
  vendorStats: state => state.stats,
  vendorCategories: state => state.categories,
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
      const response = await vendorsAPI.getAll(params)
      commit('SET_VENDORS', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.detail || 'Failed to fetch vendors')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchVendor({ commit }, vendorId) {
    commit('SET_LOADING', true)
    try {
      const response = await vendorsAPI.getById(vendorId)
      commit('SET_CURRENT_VENDOR', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.detail || 'Failed to fetch vendor')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchVendorStats({ commit }) {
    try {
      const response = await vendorsAPI.getStats()
      commit('SET_STATS', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async fetchVendorCategories({ commit }) {
    try {
      const response = await vendorsAPI.getCategories()
      commit('SET_CATEGORIES', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async createVendor({ commit }, vendorData) {
    try {
      const response = await vendorsAPI.create(vendorData)
      commit('ADD_VENDOR', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async updateVendor({ commit }, { id, data }) {
    try {
      const response = await vendorsAPI.update(id, data)
      commit('UPDATE_VENDOR', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async deleteVendor({ commit }, vendorId) {
    try {
      await vendorsAPI.delete(vendorId)
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
