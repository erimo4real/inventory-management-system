import api from '@/shared/services/api'
import Cookies from 'js-cookie'

function hasAuthCookie() {
  return !!Cookies.get('auth_status')
}

const state = {
  user: null,
  loading: false,
  error: null
}

const getters = {
  currentUser: state => state.user,
  isAuthenticated: state => !!state.user,
  isAdmin: state => state.user?.role === 'admin',
  isManager: state => state.user?.role === 'manager',
  isStaff: state => state.user?.role === 'staff',
  authLoading: state => state.loading,
  authError: state => state.error,
  currentSiteId: state => state.user?.site_id,
  hasAuthCookie: () => hasAuthCookie()
}

const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  },
  CLEAR_ERROR(state) {
    state.error = null
  },
  CLEAR_AUTH(state) {
    state.user = null
    state.error = null
  }
}

const actions = {
  async login({ commit, dispatch }, { email, password, remember = false }) {
    commit('CLEAR_ERROR')
    commit('SET_LOADING', true)
    try {
      const response = await api.post('/auth/login', { email, password, remember })
      const { user } = response.data
      commit('SET_USER', user)
      await dispatch('sites/initializeSite', null, { root: true })
      return user
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed. Please check your credentials.'
      commit('SET_ERROR', errorMessage)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async register({ commit }, userData) {
    commit('CLEAR_ERROR')
    commit('SET_LOADING', true)
    try {
      const response = await api.post('/auth/register', userData)
      const { user } = response.data
      commit('SET_USER', user)
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed. Please try again.'
      commit('SET_ERROR', errorMessage)
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

  async logout({ commit }) {
    try {
      await api.post('/auth/logout')
    } catch (err) {
      console.warn('[AuthStore] Logout API call failed, clearing local state anyway:', err.message)
    }
    commit('CLEAR_AUTH')
  },

  clearError({ commit }) {
    commit('CLEAR_ERROR')
  },

  async initAuth({ commit, dispatch }) {
    const authStatus = Cookies.get('auth_status')
    if (authStatus) {
      try {
        const response = await api.get('/auth/me')
        commit('SET_USER', response.data)
        await dispatch('sites/initializeSite', null, { root: true })
      } catch {
        const isProduction = window.location.protocol === 'https:'
        const opts = { sameSite: 'strict', secure: isProduction, path: '/' }
        Cookies.remove('auth_status', opts)
        Cookies.remove('user_role', opts)
        Cookies.remove('site_id', opts)
        commit('CLEAR_AUTH')
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
