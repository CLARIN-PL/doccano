import moment from 'moment'

export const state = () => ({
  username: null,
  id: null,
  isAuthenticated: false,
  isStaff: false,
  restingUserId: null,
  restingEndTime: null
})

export const mutations = {
  setUsername(state, username) {
    state.username = username
  },
  setUserId(state, userId) {
    state.id = userId
  },
  clearUsername(state) {
    state.username = null
  },
  setAuthenticated(state, isAuthenticated) {
    state.isAuthenticated = isAuthenticated
  },
  setIsStaff(state, isStaff) {
    state.isStaff = isStaff
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
  isAuthenticated(state) {
    return state.isAuthenticated
  },
  getUsername(state) {
    return state.username
  },
  getUserId(state) {
    return state.id
  },
  isStaff(state) {
    return state.isStaff
  },
  getRestingUserId(state) {
    return state.restingUserId
  },
  getRestingEndTime(state) {
    return state.restingEndTime
  }
}

export const actions = {
  setRestingPeriod({ commit }) {
    const startTime = new Date()
    const endTime = moment(startTime).add(5, 'm').format('ddd, DD-MM-YYYY HH:mm:ss')
    commit('setRestingPeriod', endTime)
  },
  getRestingPeriod({ commit, getters }) {
    const currentTime = new Date()
    const restingEndTime = getters('getRestingEndTime')

    if (currentTime >= restingEndTime) {
      commit('clearRestingPeriod')
    }

    const currentUserId = getters('getUserId')
    const restingUserId = getters('getRestingUserId')

    if (restingUserId !== null && currentUserId === restingUserId) {
      return moment(restingEndTime, 'ddd, DD-MM-YYYY HH:mm:ss').toDate()
    }
    return null
  },
  async authenticateUser({ commit }, authData) {
    try {
      await this.$services.auth.login(authData.username, authData.password)
      commit('setAuthenticated', true)
    } catch (error) {
      throw new Error('The credential is invalid')
    }
  },
  async initAuth({ commit }) {
    try {
      const user = await this.$services.user.getMyProfile()
      commit('setAuthenticated', true)
      commit('setUsername', user.username)
      commit('setUserId', user.id)
      commit('setIsStaff', user.isStaff)
    } catch {
      commit('setAuthenticated', false)
      commit('setIsStaff', false)
    }
  },
  async logout({ commit }) {
    await this.$services.auth.logout()
    commit('setAuthenticated', false)
    commit('setIsStaff', false)
    commit('clearUsername')
  }
}
