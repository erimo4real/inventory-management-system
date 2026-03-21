import Cookies from 'js-cookie'
import api from '@/shared/services/api'

const state = {
  sites: [],
  currentSite: null,
  loading: false,
  error: null
}

const getters = {
  allSites: state => state.sites,
  currentSite: state => state.currentSite,
  sitesLoading: state => state.loading,
  isSuperAdmin: state => state.currentSite?.role === 'super_admin'
}

const mutations = {
  SET_SITES(state, sites) { state.sites = sites },
  SET_CURRENT_SITE(state, site) { state.currentSite = site },
  ADD_SITE(state, site) { state.sites.unshift(site) },
  UPDATE_SITE(state, updatedSite) {
    const index = state.sites.findIndex(s => s.id === updatedSite.id)
    if (index !== -1) state.sites.splice(index, 1, updatedSite)
  },
  DELETE_SITE(state, siteId) {
    state.sites = state.sites.filter(s => s.id !== siteId)
  },
  SET_LOADING(state, loading) { state.loading = loading },
  SET_ERROR(state, error) { state.error = error }
}

const actions = {
  async fetchSites({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await api.get('/sites')
      commit('SET_SITES', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch sites')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchMySites({ commit }) {
    commit('SET_LOADING', true)
    try {
      const response = await api.get('/sites/my')
      commit('SET_SITES', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch sites')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async setCurrentSite({ commit }, site) {
    commit('SET_CURRENT_SITE', site)
    if (site) {
      Cookies.set('site_id', site.id.toString(), { expires: 7 })
    } else {
      Cookies.remove('site_id')
    }
  },

  async initializeSite({ dispatch }) {
    try {
      const savedSiteId = Cookies.get('site_id')
      let sites = await dispatch('fetchMySites')
      
      if (!sites || sites.length === 0) {
        console.error('No sites found for user')
        return
      }
      
      let site
      if (savedSiteId) {
        site = sites.find(s => s.id.toString() === savedSiteId)
      }
      
      if (!site) {
        site = sites[0]
      }
      
      await dispatch('setCurrentSite', site)
    } catch (error) {
      console.error('Failed to initialize site:', error)
    }
  },

  async createSite({ commit }, siteData) {
    try {
      const response = await api.post('/sites', siteData)
      commit('ADD_SITE', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async updateSite({ commit }, { id, data }) {
    try {
      const response = await api.put(`/sites/${id}`, data)
      commit('UPDATE_SITE', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async deleteSite({ commit }, siteId) {
    try {
      await api.delete(`/sites/${siteId}`)
      commit('DELETE_SITE', siteId)
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
