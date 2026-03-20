import api from '@/shared/services/api'

const state = {
  products: [],
  categories: [],
  lowStockProducts: [],
  currentProduct: null,
  loading: false,
  error: null
}

const getters = {
  allProducts: state => state.products,
  allCategories: state => state.categories,
  lowStockItems: state => state.lowStockProducts,
  currentProduct: state => state.currentProduct,
  productsLoading: state => state.loading
}

const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products
  },
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  SET_LOW_STOCK(state, products) {
    state.lowStockProducts = products
  },
  SET_CURRENT_PRODUCT(state, product) {
    state.currentProduct = product
  },
  ADD_PRODUCT(state, product) {
    state.products.unshift(product)
  },
  UPDATE_PRODUCT(state, updatedProduct) {
    const index = state.products.findIndex(p => p.id === updatedProduct.id)
    if (index !== -1) {
      state.products.splice(index, 1, updatedProduct)
    }
  },
  DELETE_PRODUCT(state, productId) {
    state.products = state.products.filter(p => p.id !== productId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchProducts({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await api.get('/products', { params })
      commit('SET_PRODUCTS', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.detail || 'Failed to fetch products')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchCategories({ commit }) {
    try {
      const response = await api.get('/products/categories')
      commit('SET_CATEGORIES', response.data.categories)
      return response.data.categories
    } catch (error) {
      throw error
    }
  },

  async fetchLowStock({ commit }) {
    try {
      const response = await api.get('/products/low-stock')
      commit('SET_LOW_STOCK', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async fetchProduct({ commit }, productId) {
    try {
      const response = await api.get(`/products/${productId}`)
      commit('SET_CURRENT_PRODUCT', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async createProduct({ commit }, productData) {
    try {
      const response = await api.post('/products', productData)
      commit('ADD_PRODUCT', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async updateProduct({ commit }, { id, data }) {
    try {
      const response = await api.put(`/products/${id}`, data)
      commit('UPDATE_PRODUCT', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async deleteProduct({ commit }, productId) {
    try {
      await api.delete(`/products/${productId}`)
      commit('DELETE_PRODUCT', productId)
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
