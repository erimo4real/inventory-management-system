import api from '../../services/api'

const state = {
  users: [],
  currentUser: null,
  loading: false,
  error: null
}

const getters = {
  allUsers: state => state.users,
  currentUserData: state => state.currentUser,
  usersLoading: state => state.loading
}

const mutations = {
  SET_USERS(state, users) {
    state.users = users
  },
  SET_CURRENT_USER(state, user) {
    state.currentUser = user
  },
  ADD_USER(state, user) {
    state.users.unshift(user)
  },
  UPDATE_USER(state, updatedUser) {
    const index = state.users.findIndex(u => u.id === updatedUser.id)
    if (index !== -1) {
      state.users.splice(index, 1, updatedUser)
    }
  },
  DELETE_USER(state, userId) {
    state.users = state.users.filter(u => u.id !== userId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchUsers({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await api.get('/users')
      commit('SET_USERS', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch users')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchUser({ commit }, userId) {
    try {
      const response = await api.get(`/users/${userId}`)
      commit('SET_CURRENT_USER', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async createUser({ commit }, userData) {
    try {
      const response = await api.post('/users', userData)
      commit('ADD_USER', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async updateUser({ commit }, { id, data }) {
    try {
      const response = await api.put(`/users/${id}`, data)
      commit('UPDATE_USER', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async deleteUser({ commit }, userId) {
    try {
      await api.delete(`/users/${userId}`)
      commit('DELETE_USER', userId)
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
