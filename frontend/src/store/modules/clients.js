import { clientsAPI } from '../../services/api'

const state = {
  clients: [],
  currentClient: null,
  stats: null,
  loading: false,
  error: null
}

const getters = {
  allClients: state => state.clients,
  currentClient: state => state.currentClient,
  clientStats: state => state.stats,
  clientsLoading: state => state.loading
}

const mutations = {
  SET_CLIENTS(state, clients) {
    state.clients = clients
  },
  SET_CURRENT_CLIENT(state, client) {
    state.currentClient = client
  },
  SET_STATS(state, stats) {
    state.stats = stats
  },
  ADD_CLIENT(state, client) {
    state.clients.unshift(client)
  },
  UPDATE_CLIENT(state, updatedClient) {
    const index = state.clients.findIndex(c => c.id === updatedClient.id)
    if (index !== -1) {
      state.clients.splice(index, 1, updatedClient)
    }
  },
  DELETE_CLIENT(state, clientId) {
    state.clients = state.clients.filter(c => c.id !== clientId)
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

const actions = {
  async fetchClients({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await clientsAPI.getAll(params)
      commit('SET_CLIENTS', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.detail || 'Failed to fetch clients')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchClient({ commit }, clientId) {
    commit('SET_LOADING', true)
    try {
      const response = await clientsAPI.getById(clientId)
      commit('SET_CURRENT_CLIENT', response.data)
      return response.data
    } catch (error) {
      commit('SET_ERROR', error.response?.data?.detail || 'Failed to fetch client')
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchClientStats({ commit }) {
    try {
      const response = await clientsAPI.getStats()
      commit('SET_STATS', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async createClient({ commit }, clientData) {
    try {
      const response = await clientsAPI.create(clientData)
      commit('ADD_CLIENT', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async updateClient({ commit }, { id, data }) {
    try {
      const response = await clientsAPI.update(id, data)
      commit('UPDATE_CLIENT', response.data)
      return response.data
    } catch (error) {
      throw error
    }
  },

  async deleteClient({ commit }, clientId) {
    try {
      await clientsAPI.delete(clientId)
      commit('DELETE_CLIENT', clientId)
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
