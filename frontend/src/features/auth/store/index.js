import api from '@/shared/services/api'
import Cookies from 'js-cookie'

const state = {
  user: null,
  token: null,
  loading: false,
  error: null
}

const getters = {
  currentUser: state => state.user,
  isAuthenticated: state => !!state.token,
  isAdmin: state => state.user?.role === 'admin',
  isManager: state => state.user?.role === 'manager',
  isStaff: state => state.user?.role === 'staff',
  authLoading: state => state.loading
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
    state.token = Cookies.get('token')
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  CLEAR_AUTH(state) {
    state.user = null
    state.token = null
  }
}

const actions = {
  async login({ commit, dispatch }, { email, password }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await api.post('/auth/login', { email, password })
      const { token, user } = response.data
      Cookies.set('token', token, { expires: 7 })
      Cookies.set('user', JSON.stringify(user), { expires: 7 })
      commit('SET_USER', user)
      await dispatch('sites/initializeSite', null, { root: true })
      return user
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Login failed')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async register({ commit }, userData) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const response = await api.post('/auth/register', userData)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Registration failed')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchCurrentUser({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await api.get('/auth/me')
      commit('SET_USER', response.data)
      return response.data
    } catch (error) {
      Cookies.remove('token')
      Cookies.remove('user')
      commit('CLEAR_AUTH')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async changePassword({ commit }, { oldPassword, newPassword }) {
    commit('SET_LOADING', true)
    try {
      await api.post('/auth/change-password', { oldPassword, newPassword })
    } catch (error) {
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  logout({ commit }) {
    Cookies.remove('token')
    Cookies.remove('user')
    Cookies.remove('site_id')
    commit('CLEAR_AUTH')
  },

  initAuth({ commit }) {
    const token = Cookies.get('token')
    const userStr = Cookies.get('user')
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr)
        commit('SET_USER', user)
      } catch {
        Cookies.remove('token')
        Cookies.remove('user')
      }
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
