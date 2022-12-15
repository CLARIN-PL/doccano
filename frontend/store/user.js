import moment from 'moment'
import _ from "lodash"
import { 
  hasStore, 
  getQuestionnairesToShow } 
from "@/utils/questionnaires"
import {
  DATETIME_FORMAT_DDMMYYHHMMSS,
} from '~/settings/'


export const state = () => ({
  id: null,
  histories: []
})

export const history = 
{
  id: null,
  rest: {
    userId: null,
    startTime: "",
    endTime: ""
  },
  login: {
    firstLoginTime: "",
    lastLoginTime: "",
    isFirstLogin: false,
  },
  project: {
    currentlyAllowedProjectId: -1,
    hasFinishedAll: false
  },
  annotation: {
    textCountToday: 0,
    hasAnnotatedToday: false,
    firstAnnotationTime: "",
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
  setRest(state, rest) {
    const userHistory = state.histories.find((hist)=> hist.id === state.id)
    if(userHistory) {
      const index = state.histories.indexOf(userHistory)
      state.histories.splice(index, 1, { ...userHistory, login: {...userHistory.rest, ...rest} })
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
  getHistories(state) {
    return state.histories
  },
  getRest() {
    const { rest } = state.histories.find((hist)=> hist.id === state.id ) || history
    return rest 
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
  setAnnotation({ commit }, annotation) {
    commit('setAnnotation', annotation)
  },
  setLogin({ commit }, login) {
    commit('setLogin', login)
  },
  setRest({ commit }, rest) {
    commit('setRest', rest)
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
  initQuestionnaire({commit}) {
    if(hasStore()) {
      const toShow = getQuestionnairesToShow()
      commit('setQuestionnaire', { toShow, inProgress: [], isWorkingNow: false })
    }
  },
  canClearRestingPeriod({ getters }) {
    const { endTime, userId } = getters.getRest
    const hasSameUserId = getters.getUserId === userId
    const hasPassedTime = currentTime >= endTime
    return hasSameUserId && hasPassedTime
  },
  getRestEndTime({  getters }) {
    const { endTime } = getters.getRest
    return moment(endTime).format(DATETIME_FORMAT_DDMMYYHHMMSS)
  },
  initUser({ commit }, userId) {
    commit('setUserId', userId)
  },
  clear({ commit }) {
    commit('setUserId', null)
    commit('setHistories', [])
  }
}
