export const state = () => ({
  current: {},
  currentDimensions: {}
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
  }
}

export const mutations = {
  setCurrent(state, payload) {
    state.current = payload
  },
  setCurrentDimensions(state, payload) {
    state.currentDimensions = payload
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
  }
}
