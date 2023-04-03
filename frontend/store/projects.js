export const state = () => ({
  current: {},
  currentDimensions: {},
  allDimensions: []
})

export const getters = {
  currentProject(state) {
    return state.current
  },
  getCurrentUserRole(state) {
    return state.current.current_users_role || {}
  },
  canViewApproveButton(state) {
    const role = state.current.current_users_role
    return role && !role.is_annotator
  },
  getLink(state) {
    return state.current.pageLink
  },
  currentDimensions(state) {
    return state.currentDimensions
  },
  allDimensions(state) {
    return state.allDimensions
  }
}

export const mutations = {
  setCurrent(state, payload) {
    state.current = payload
  },
  setCurrentDimensions(state, payload) {
    state.currentDimensions = payload
  },
  setAllDimensions(state, payload) {
    state.allDimensions = payload
  }
}

export const actions = {
  async setCurrentProject({ commit }, projectId) {
    try {
      const response = await this.$services.project.findById(projectId)
      commit('setCurrent', response)
    } catch (error) {
      throw new Error(error)
    }
  },
  async setCurrentDimensions({ commit }, projectId) {
    try {
      const response = await this.$services.dimension.list(projectId)
      commit('setCurrentDimensions', response)
    } catch (error) {
      throw new Error(error)
    }
  },
  async setAllDimensions({ commit }) {
    try {
      const response = await this.$services.dimension.listAllDimensions()
      commit('setAllDimensions', response.items)
    } catch (error) {
      throw new Error(error)
    }
  }
}
