import api from '@/shared/services/api'

const state = {
  categories: [],
  loading: false,
  error: null
}

const getters = {
  allCategories: state => state.categories,
  categoriesLoading: state => state.loading,
  productCategories: state => state.categories.filter(c => c.type === 'product'),
  vendorCategories: state => state.categories.filter(c => c.type === 'vendor'),
  supplierCategories: state => state.categories.filter(c => c.type === 'supplier'),
  clientCategories: state => state.categories.filter(c => c.type === 'client')
}

const mutations = {
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  ADD_CATEGORY(state, category) {
    state.categories.unshift(category)
  },
  UPDATE_CATEGORY(state, updatedCategory) {
    const index = state.categories.findIndex(c => c.id === updatedCategory.id)
    if (index !== -1) {
      state.categories.splice(index, 1, updatedCategory)
    }
  },
  DELETE_CATEGORY(state, categoryId) {
    state.categories = state.categories.filter(c => c.id !== categoryId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchCategories({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await api.get('/categories', { params })
      commit('SET_CATEGORIES', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch categories')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchCategory({ commit }, id) {
    try {
      const response = await api.get(`/categories/${id}`)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async createCategory({ commit }, categoryData) {
    try {
      const response = await api.post('/categories', categoryData)
      commit('ADD_CATEGORY', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async updateCategory({ commit }, { id, data }) {
    try {
      const response = await api.put(`/categories/${id}`, data)
      commit('UPDATE_CATEGORY', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async deleteCategory({ commit }, categoryId) {
    try {
      await api.delete(`/categories/${categoryId}`)
      commit('DELETE_CATEGORY', categoryId)
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
