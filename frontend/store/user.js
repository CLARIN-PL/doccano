import moment from 'moment'

export const state = () => ({
  id: null,
  currentlyAllowedProjectId: -1,
  restingUserId: null,
  restingEndTime: null
})

export const mutations = {
  setUserId(state, userId) {
    state.id = userId
  },
  setCurrentlyAllowedProjectId(state, projectId) {
    state.currentlyAllowedProjectId = projectId
  },
  setRestingPeriod(state, endTime) {
    state.restingUserId = state.id
    state.restingEndTime = endTime
  },
  clearRestingPeriod(state) {
    state.restingUserId = null
    state.restingEndTime = null
  }
}

export const getters = {
  getUserId(state) {
    return state.id
  },
  getCurrentlyAllowedProjectId(state) {
    return state.currentlyAllowedProjectId
  },
  getRestingUserId(state) {
    return state.restingUserId
  },
  getRestingEndTime(state) {
    if (state.restingEndTime !== null) {
      return moment(state.restingEndTime, 'ddd, DD-MM-YYYY HH:mm:ss').toDate()
    }
    return null
  }
}

export const actions = {
  setCurrentlyAllowedProjectId({ commit }, projectId) {
    commit('setCurrentlyAllowedProjectId', projectId)
  },
  setRestingPeriod({ commit }) {
    const startTime = new Date()
    const endTime = moment(startTime).add(5, 'm').format('ddd, DD-MM-YYYY HH:mm:ss')
    commit('setRestingPeriod', endTime)
  },
  calculateRestingPeriod({ commit, getters }) {
    const currentTime = new Date()
    const restingEndTime = getters.getRestingEndTime
    const currentUserId = getters.getUserId
    const restingUserId = getters.getRestingUserId
    let isRestingPeriodCleared = false

    if (currentTime >= restingEndTime) {
      commit('clearRestingPeriod')
      isRestingPeriodCleared = true
    }
    if (restingUserId !== null && currentUserId === restingUserId && !isRestingPeriodCleared) {
      return restingEndTime
    }
    return null
  },
  init({ commit }, userId) {
    commit('setUserId', userId)
  },
  clear({ commit }) {
    commit('setUserId', null)
    commit('currentlyAllowedProjectId', -1)
    commit('restingUserId', null)
    commit('restingEndTime', null)
  }
}
