import Cookies from 'js-cookie'
import { authAPI } from '../../services/api'

const state = {
  user: JSON.parse(Cookies.get('user') || 'null'),
  token: Cookies.get('token') || null,
  loading: false,
  error: null
}

const getters = {
  isAuthenticated: state => !!state.token,
  currentUser: state => state.user,
  isAdmin: state => state.user?.role === 'admin',
  isManager: state => state.user?.role === 'manager' || state.user?.role === 'admin',
  canEdit: state => state.user?.role === 'admin' || state.user?.role === 'manager',
  authLoading: state => state.loading,
  authError: state => state.error
}

const mutations = {
  SET_AUTH(state, { user, token }) {
    state.user = user
    state.token = token
    Cookies.set('user', JSON.stringify(user), { expires: 7 })
    Cookies.set('token', token, { expires: 7 })
  },
  CLEAR_AUTH(state) {
    state.user = null
    state.token = null
    Cookies.remove('user')
    Cookies.remove('token')
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async login({ commit }, { email, password }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await authAPI.login(email, password)
      commit('SET_AUTH', {
        user: response.data.user,
        token: response.data.token
      })
      return response.data
    } catch (error) {
      const message = error.response?.data?.error || 'Login failed'
      commit('SET_ERROR', message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async register({ commit }, userData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await authAPI.register(userData)
      commit('SET_AUTH', {
        user: response.data.user,
        token: response.data.token
      })
      return response.data
    } catch (error) {
      const message = error.response?.data?.error || 'Registration failed'
      commit('SET_ERROR', message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  logout({ commit }) {
    commit('CLEAR_AUTH')
  },

  async fetchCurrentUser({ commit, state }) {
    if (!state.token) return null
    try {
      const response = await authAPI.getCurrentUser()
      commit('SET_AUTH', { user: response.data, token: state.token })
      return response.data
    } catch (error) {
      commit('CLEAR_AUTH')
      throw error
    }
  },

  async changePassword({ commit }, { oldPassword, newPassword }) {
    commit('SET_LOADING', true)
    try {
      await authAPI.changePassword(oldPassword, newPassword)
    } catch (error) {
      throw error
    } finally {
      commit('SET_LOADING', false)
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
