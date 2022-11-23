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
  login: {
    firstLoginTime: "",
    isFirstLogin: false,
  },
  project: {
    hasFinishedAll: false
  },
  annotation: {
    textCountToday: 0,
    hasAnnotatedToday: false,
    lastAnnotationTime: "",
  },
  questionnaire: {
    isWorkingNow: false,
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
  setQuestionnaire(state, questionnaire) {
    state.questionnaire = {...state.questionnaire, ...questionnaire}
  },
  setLogin(state, login) {
    state.login = {...state.login, ...login}
  },
  setAnnotation(state, annotation) {
    state.annotation = {...state.annotation, ...annotation}
  },
  setProject(state, project) {
    state.project = {...state.project, ...project}
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
  getQuestionnaire(state) {
    return state.questionnaire
  },
  getLogin(state) {
    return state.login
  },
  getAnnotation(state) {
    return state.annotation
  },
  getProject(state) {
    return state.project
  },
}

export const actions = {
  setCurrentlyAllowedProjectId({ commit }, projectId) {
    commit('setCurrentlyAllowedProjectId', projectId)
  },
  setAnnotation({ commit }, annotation) {
    commit('setAnnotation', annotation)
  },
  setLogin({ commit }, login) {
    commit('setLogin', login)
  },
  setQuestionnaire({ commit }, questionnaire) {
    commit('setQuestionnaire', questionnaire)
  },
  setProject({ commit }, project) {
    commit('setProject', project)
  },
  setRestingPeriod({ commit }) {
    const startTime = new Date()
    const endTime = moment(startTime).add(5, 'm').format('DD-MM-YYYY HH:mm:ss')
    commit('setRestingPeriod', endTime)
  },
  initQuestionnaire({commit}) {
    if(hasStore()) {
      const toShow = getQuestionnairesToShow()
      commit('setQuestionnaire', { toShow, inProgress: [], isWorkingNow: false })
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
