import api from '../../services/api'

const state = {
  suppliers: [],
  currentSupplier: null,
  loading: false,
  error: null
}

const getters = {
  allSuppliers: state => state.suppliers,
  currentSupplier: state => state.currentSupplier,
  suppliersLoading: state => state.loading
}

const mutations = {
  SET_SUPPLIERS(state, suppliers) {
    state.suppliers = suppliers
  },
  SET_CURRENT_SUPPLIER(state, supplier) {
    state.currentSupplier = supplier
  },
  ADD_SUPPLIER(state, supplier) {
    state.suppliers.unshift(supplier)
  },
  UPDATE_SUPPLIER(state, updatedSupplier) {
    const index = state.suppliers.findIndex(s => s.id === updatedSupplier.id)
    if (index !== -1) {
      state.suppliers.splice(index, 1, updatedSupplier)
    }
  },
  DELETE_SUPPLIER(state, supplierId) {
    state.suppliers = state.suppliers.filter(s => s.id !== supplierId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchSuppliers({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await api.get('/suppliers', { params })
      commit('SET_SUPPLIERS', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.detail || 'Failed to fetch suppliers')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchSupplier({ commit }, supplierId) {
    try {
      const response = await api.get(`/suppliers/${supplierId}`)
      commit('SET_CURRENT_SUPPLIER', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async createSupplier({ commit }, supplierData) {
    try {
      const response = await api.post('/suppliers', supplierData)
      commit('ADD_SUPPLIER', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async updateSupplier({ commit }, { id, data }) {
    try {
      const response = await api.put(`/suppliers/${id}`, data)
      commit('UPDATE_SUPPLIER', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async deleteSupplier({ commit }, supplierId) {
    try {
      await api.delete(`/suppliers/${supplierId}`)
      commit('DELETE_SUPPLIER', supplierId)
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
