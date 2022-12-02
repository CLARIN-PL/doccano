import moment from 'moment'
import _ from "lodash"
import { 
  hasStore, 
  getQuestionnairesToShow } 
from "@/utils/questionnaires"

export const state = () => ({
  id: null,
  currentlyAllowedProjectId: -1,
  restingUserId: null,
  restingEndTime: null,
  histories: []
})

export const history = 
{
  id: null,
  login: {
    firstLoginTime: "",
    lastLoginTime: "",
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
}

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
  setHistories(state, histories) {
    state.histories = _.cloneDeep(histories)
  },
  addHistory(state, history) {
    state.histories = state.histories.concat(history)
  },
  replaceHistory(state, history) {
    const userHistory = state.histories.find((hist)=> hist.id === history.id)
    if(userHistory) {
      const index = state.histories.indexOf(userHistory)
      state.histories.splice(index, 1, history)
    }
  },
  removeHistory(state, history) {
    state.histories = state.histories.filter((hist)=> hist.id !== history.id )
  },
  setQuestionnaire(state, questionnaire) {
    const userHistory = state.histories.find((hist)=> hist.id === state.id)
    if(userHistory) {
      const index = state.histories.indexOf(userHistory)
      state.histories.splice(index, 1, { ...userHistory, questionnaire: {...userHistory.questionnaire, ...questionnaire} })
    }
  },
  setLogin(state, login) {
    const userHistory = state.histories.find((hist)=> hist.id === state.id)
    if(userHistory) {
      const index = state.histories.indexOf(userHistory)
      state.histories.splice(index, 1, { ...userHistory, login: {...userHistory.login, ...login} })
    }
  },
  setAnnotation(state, annotation) {
    const userHistory = state.histories.find((hist)=> hist.id === state.id)
    if(userHistory) {
      const index = state.histories.indexOf(userHistory)
      state.histories.splice(index, 1, { ...userHistory, annotation: {...userHistory.annotation, ...annotation} })
    }
  },
  setProject(state, project) {
    const userHistory = state.histories.find((hist)=> hist.id === state.id)
    if(userHistory) {
      const index = state.histories.indexOf(userHistory)
      state.histories.splice(index, 1, { ...userHistory, project: {...userHistory.project, ...project} })
    }
  },
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
  getHistories(state) {
    return state.histories
  },
  getQuestionnaire(state) {
    const { questionnaire } = state.histories.find((hist)=> hist.id === state.id ) || history
    return questionnaire  
  },
  getLogin(state) {
    const { login } = state.histories.find((hist)=> hist.id === state.id ) || history
    return login 
  },
  getAnnotation(state) {
    const { annotation } = state.histories.find((hist)=> hist.id === state.id ) || history
    return annotation 
  },
  getProject(state) {
    const { project } = state.histories.find((hist)=> hist.id === state.id ) || history
    return project 
  },
}

export const actions = {
  setUserId({commit}, userId) {
    commit('setUserId', userId)
  },
  setCurrentlyAllowedProjectId({ commit }, projectId) {
    commit('setCurrentlyAllowedProjectId', projectId)
  },
  setAnnotation({ commit }, annotation) {
    commit('setAnnotation', annotation)
  },
  setLogin({ commit }, login) {
    commit('setLogin', login)
  },
  addHistory({ commit }, history) {
    commit('addHistory', history)
  },
  replaceHistory({ commit }, history) {
    commit('replaceHistory', history)
  },
  removeHistory({ commit }, history) {
    commit('removeHistory', history)
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
