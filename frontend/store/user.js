import moment from 'moment'
import { 
  hasStore, 
  getQuestionnairesToShow } 
from "@/utils/questionnaires"

export const state = () => ({
  id: null,
  currentlyAllowedProjectId: -1,
  restingUserId: null,
  restingEndTime: null,
  firstLoginTime: "",
  lastAnnotationTime: "",
  isFirstLogin: false,
  isWorkingOnQuestionnaire: false,
  hasAnnotated: false,
  hasAnnotatedToday: false,
  hasFinishedAllProjects: false,
  annotatedTextCount: 0,
  questionnaire: {
    filled: [],
    inProgress: [],
    toShow: []
  }
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
  },
  setAnnotatedTextCount(state, annotatedTextCount) {
    state.annotatedTextCount = annotatedTextCount
  },
  setHasFinishedAllProjects(state, hasFinishedAllProjects) {
    state.hasFinishedAllProjects = hasFinishedAllProjects
  },
  setFirstLoginTime(state, firstLoginTime) {
    state.firstLoginTime = firstLoginTime
  },
  setLastAnnotationTime(state, lastAnnotationTime) {
    state.lastAnnotationTime = lastAnnotationTime
  },
  setHasAnnotated(state, hasAnnotated) {
    state.hasAnnotated = hasAnnotated
  },
  setIsWorkingOnQuestionnaire(state, isWorkingOnQuestionnaire) {
    state.isWorkingOnQuestionnaire = isWorkingOnQuestionnaire
  },
  setHasAnnotatedToday(state, hasAnnotatedToday) {
    state.hasAnnotatedToday = hasAnnotatedToday
  },
  setIsFirstLogin(state, isFirstLogin) {
    state.isFirstLogin = isFirstLogin
  },
  setQuestionnaire(state, questionnaire) {
    state.questionnaire = {...state.questionnaire, ...questionnaire}
  }
}

export const getters = {
  getUserId(state) {
    return state.id
  },
  getAnnotatedTextCount(state) {
    return state.annotatedTextCount
  },
  getCurrentlyAllowedProjectId(state) {
    return state.currentlyAllowedProjectId
  },
  getRestingUserId(state) {
    return state.restingUserId
  },
  getRestingEndTime(state) {
    if (state.restingEndTime !== null) {
      return moment(state.restingEndTime, 'DD-MM-YYYY HH:mm:ss').toDate()
    }
    return null
  },
  getHasFinishedAllProjects(state) {
    return state.hasFinishedAllProjects
  },
  getFirstLoginTime(state) {
    return state.firstLoginTime
  },
  getIsFirstLogin(state) {
    return state.isFirstLogin
  },
  getIsWorkingOnQuestionnaire(state) {
    return state.isWorkingOnQuestionnaire
  },
  getLastAnnotationTime(state) {
    return state.lastAnnotationTime
  },
  getQuestionnaire(state) {
    return state.questionnaire
  },
  getHasAnnotated(state) {
    return state.hasAnnotated
  },
  getHasAnnotatedToday(state) {
    return state.hasAnnotatedToday
  }
}

export const actions = {
  setCurrentlyAllowedProjectId({ commit }, projectId) {
    commit('setCurrentlyAllowedProjectId', projectId)
  },
  setHasFinishedAllProjects({ commit }, hasFinishedAllProjects) {
    commit('setHasFinishedAllProjects', hasFinishedAllProjects)
  },
  setFirstLoginTime({ commit }, firstLoginTime) {
    commit('setFirstLoginTime', firstLoginTime)
  },
  setIsWorkingOnQuestionnaire({ commit }, isWorkingOnQuestionnaire) {
    commit('setIsWorkingOnQuestionnaire', isWorkingOnQuestionnaire)
  },
  setAnnotatedTextCount({ commit }, annotatedTextCount) {
    commit('setAnnotatedTextCount', annotatedTextCount)
  },
  setIsFirstLogin({ commit }, isFirstLogin) {
    commit('setIsFirstLogin', isFirstLogin)
  },
  setHasAnnotated({commit}, hasAnnotated) {
    commit('setHasAnnotated', hasAnnotated)
  },
  setLastAnnotationTime({commit}, lastAnnotationTime) {
    commit('setLastAnnotationTime', lastAnnotationTime)
  },
  setHasAnnotatedToday({commit}, hasAnnotatedToday) {
    commit('setHasAnnotatedToday', hasAnnotatedToday)
  },
  setQuestionnaire({ commit }, questionnaire) {
    commit('setQuestionnaire', questionnaire)
  },
  setRestingPeriod({ commit }) {
    const startTime = new Date()
    const endTime = moment(startTime).add(5, 'm').format('DD-MM-YYYY HH:mm:ss')
    commit('setRestingPeriod', endTime)
  },
  initQuestionnaire({commit, getters}) {
    if(hasStore()) {
      const toShow = getQuestionnairesToShow()
      const filled = getters.getQuestionnaire.filled || []
      commit('setQuestionnaire', { toShow, filled, inProgress: [] })
    }
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
      return moment(restingEndTime).format('DD-MM-YYYY HH:mm:ss')
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
