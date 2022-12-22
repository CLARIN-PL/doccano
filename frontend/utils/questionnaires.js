import moment from 'moment'
import _ from 'lodash'
import { 
    RESEARCH_TIME_IN_MONTHS, 
    DATETIME_FORMAT_DDMMYYYYHHMMSS, 
    DATETIME_FORMAT_YYYYMMDDTHHMMSS, 
    DATE_FORMAT_DDMMYYYY, 
} from "~/settings/"
import {
    requiredRules,
    numericOnlyRules, 
} from "~/rules"


/*
    Questionnaire types: 
    1. Przed badaniem:
        one time, before annotating any texts, after first sign in, 
        user can’t annotate texts until they fill those questionnaires
    2. Przed i po badaniu:
        first time before annotating any texts and then second time after 2-3 months, 
        when the annotation procedure will ultimately end
    3. Po pierwszym tygodniu i na końcu badań:
        first time one week after the beginning of the annotation procedure 
        and second time after 2-3 months, 
        when the annotation procedure will ultimately end
    4. Codziennie w trakcie badania: 
        every day and depending on the additional clarification word
            xiii) Sen (rano) (before annotating any texts during the current day)
            xiv) Stres (rano) (before annotating any texts during the current day)
            xv) Stres (wieczorem) (after annotating all of the texts for the current day)
            xvi) Zdrowie (wieczorem) (after annotating all of the texts for the current day)
            xvii) Emocje (w przerwie) (between annotating batches (packs) of 20 texts, multiple times during the day)
    5. Ankieta na koniec badania
    6. Ankieta po 2 tygodniach badania
*/ 

export const qCategories = [
    {
        id: "1",
        name: "Przed badaniem",
        key: "przed_badaniem",
        types: [
            {
                id: "1.1",
                name: "Przed badaniem",
                count: 3,
                questionnaires: [1, 2, 3]
            }
        ]
    },
    {
        id: "2",
        name: "Przed i po badaniu",
        key: "przed_i_po_badaniu",
        types: [
            {
                id: "2.1",
                name: "Przed i po badaniu (przed badaniem)",
                count: 8,
                questionnaires: [4, 5, 6, 7, 8, 9, 10, 11]
            },
            {
                id: "2.2",
                name: "Przed i po badaniu (po badaniu)",
                count: 8,
                questionnaires: [4, 5, 6, 7, 8, 9, 10, 11]
            }
        ]
    },
    {
        id: "3",
        name: "Po pierwszym tygodniu i na końcu badań",
        key: "po_1_tygodniu_i_na_koncu",
        types: [
            {
                id: "3.1",
                name: "Po pierwszym tygodniu",
                count: 1, 
                questionnaires: [12]
            },
            {
                id: "3.2",
                name: "Na końcu badań",
                count: 1,
                questionnaires: [12]
            }
        ]
    }, 
    {
        id: "4",
        name: "Codziennie w trakcie badania",
        key: "codziennie_w_trakcie",
        types: [
            {
                id: "4.1",
                name: "Sen (rano)",
                description: "Rano (sen, stres)",
                count: 2,
                questionnaires: [13, 14]
            },
            {
                id: "4.2",
                name: "Wieczorem (stres, zdrowie)",
                count: 2, 
                questionnaires: [15, 16]
            },
            {
                id: "4.3",
                name: "W przerwie (emocje)",
                questionnaires: [17],
                count: 1,
            },
        ]
    },
    {
        id: "5",
        name: "Ankieta na koniec badania",
        key: "na_koniec",
        types: [
            {
                id: "5.1",
                name: "Ankieta na koniec badania",
                count: 1,
                questionnaires: [18]
            }
        ]
    },
    {
        id: "6",
        name: "Ankieta po 2 tygodniach badania",
        key: "po_2_tygodniach",
        types: [
            {
                id: "6.1",
                name: "Ankieta po 2 tygodniach badania",
                count: 1,
                questionnaires: [19]
            }
        ]
    }
]

export function hasStore() {
    return !!window.$nuxt && !!window.$nuxt.$store
}

function setQuestionnaireFinishedData(questionnaire, questionnaireStates=[]) {
    const getters = window.$nuxt.$store.getters
    const { completedProjectsCount } =  getters ? getters['user/getProject'] : 0
    const que = questionnaire
    const states = questionnaireStates.filter((qs)=> qs.questionnaire === que.id)
    const state = states.length ? states[0]: null
    que.isFinished = !!state
    if(state) {
        que.isFinished = true
        que.finishedAt = state.finishedAt
        que.finishedAtDate = moment(state.finishedAt, DATETIME_FORMAT_YYYYMMDDTHHMMSS).format(DATE_FORMAT_DDMMYYYY)
    }
    if(state && que.typeId === "2.2") {
        que.isFinished = states.length > 1
    }
    if(state && que.typeId === "3.2") {
        que.isFinished = states.length > 1
    }
    if(state && String(que.typeId).startsWith("4")) {
        const todayStates = states.filter((state)=> moment(new Date()).format(DATE_FORMAT_DDMMYYYY) 
        === moment(state.finishedAt, DATETIME_FORMAT_YYYYMMDDTHHMMSS).format(DATE_FORMAT_DDMMYYYY))
        const isFinishedToday = !!todayStates.length
        que.isFinishedToday = isFinishedToday
        que.isFinished = !!state && isFinishedToday
    }
    if(String(que.typeId) === "4.3") {
        que.isFinished = states.length === completedProjectsCount
        que.isFinishedToday = que.isFinished
    }
    return que
}

function setQuestionnaireSegmentsData(questionnaire, questions=[]) {
    const que = questionnaire
    que.segments = que.segments.map((segment)=> {
        segment.questions = segment.questions.map((question)=> {
            let qItem = questions.find((quest)=> question.text === quest.questionText)
            if(question.header) {
                qItem = questions.find((quest)=> question.header === quest.questionText)
            }
            if(question.alternateText) {
                qItem = questions.find((quest)=> question.alternateText === quest.questionText)
            }
            if(qItem) {
                question.id = qItem.id
                question.questionnaireId = qItem.questionnaire
                question.isValid = true
            } else {
                question.isClicked = true
                question.isValid = false
            }
            return question
        })
        return segment
    })
    return que 
}

export function setQuestionnaireData(qTypes, questionnaires=[], questions=[], questionnaireStates=[]) {
    questionnaireStates = _.sortBy(questionnaireStates, 'finishedAt')
    return qTypes.map((qType)=> {
        if(qType && qType.questionnaires) {
            qType.questionnaires = qType.questionnaires.map((que, queIdx)=> {
                let questionnaire = questionnaires.find((q)=> q.name === que.name)
                // hacky, should be removed later
                if(!questionnaire) {
                    questionnaire = questionnaires.find((q, qIdx)=> q && queIdx === qIdx)
                }
                if(questionnaire) {
                    que.questionnaire = questionnaire
                    que.id = questionnaire.id
                    que.type = questionnaire.questionnaireType
                    que = setQuestionnaireFinishedData(que, questionnaireStates)
                }

                que = setQuestionnaireSegmentsData(que, questions)
                return que
            })
        }
        return qType
    })
}

function getMappedQuestionOptions(question, i18nRules={}) {
    const options = question.options.map((option)=> {
        option.value = option.value === undefined ? option.text : option.value
        
        if(option.dynamicSelectInput) {
            option.dynamicSelectInput.options = option.dynamicSelectInput.options.map((opt)=> {
                opt.value = opt.value === undefined ? opt.text : opt.value
                opt.rules = getQuestionRules(opt, i18nRules)
                return opt
            })
        }

        if(option.showTextbox) {
            option.config = { numericOnly: !!option.numericOnly }
            option.rules = getQuestionRules(option, i18nRules)
        }

        if(option.showSlider) {
            option.config = getQuestionSliderConfig(option)
        }

        return option
    })
    return options
}

function getQuestionScaleOptions(question) {
    let min = question.min || 0
    const max = question.max || 0
    const options = Array.isArray(question.options) ? question.options : []
    while(min <= max) {
        options.push({
            text: min.toString(),
            value: min.toString()
        })
        min++
    }
    return options
}

function getQuestionSliderConfig(question) {
    const config = {
        min: question.min,
        max: question.max,
        minLabel: question.minLabel,
        maxLabel: question.maxLabel,
        showTickLabels: question.showTickLabels ?? true
    }
    return config  
}

function getQuestionRules(question={}, i18nRules=null) {
    if(!i18nRules && window.$nuxt && window.$nuxt.$i18n) {
        i18nRules = window.$nuxt.$i18n.t('rules')
    }
    let rules = []
    if(question.required) {
        rules = rules.concat(...requiredRules(i18nRules))
    }
    if(question.numericOnly) {
        rules = rules.concat(...numericOnlyRules(i18nRules))
    }
    return rules
}

export function getMappedQuestionnaireTypes(qTypes=[], i18nRules=null) {
    if(!i18nRules && window.$nuxt && window.$nuxt.$i18n) {
        i18nRules = window.$nuxt.$i18n.t('rules')
    }
    const numberInputs = ['slider', 'scale']
    return qTypes.map((qType)=> {
        qType.questionnaires = qType.questionnaires.map((questionnaire, queIdx)=> {
            questionnaire.segments = questionnaire.segments.map((segment, segIdx)=> {
                segment.questions = segment.questions.map((question, questionIdx)=> {
                    question.key = 0
                    question.idx = questionIdx
                    question.seqIdx = segIdx
                    question.queIdx = queIdx
                    question.required = question.required ?? true
                    question.readOnly = question.readOnly ?? false
                    question.isSubmitting = false
                    question.isClicked = false
                    question.value = numberInputs.includes(question.type) ? 0 : ""
                    question.config = {}

                    if(question.options) {
                        question.options = getMappedQuestionOptions(question, i18nRules)
                    }

                    if(question.type === 'scale') {
                        question.options = getQuestionScaleOptions(question)
                    } else if(question.type === "slider") {
                        question.config = getQuestionSliderConfig(question)
                    } else if(question.type === "text") {
                        question.config = {
                            numericOnly: question.numericOnly ?? false
                        }
                    } else if(question.type === "radio") {
                        question.config = {
                            numericOnly: question.numericOnly ?? false
                        }
                    }

                    question.rules = getQuestionRules(question, i18nRules)
                    
                    return question
                })
                return segment
            })
            return questionnaire
        })
        return qType
    })
}

export function getQuestionnaireTypes() {
    const qTypes =  _.flatMap(qCategories, 'types')
    return qTypes
}

export function hasValidLoginTime(givenTime) {
    let getters = null
    let hasValidLoginTime = false
    if(hasStore()) {
        getters = window.$nuxt.$store.getters
    }
    if(getters) {
        const { lastLoginTime } = getters['user/getLogin']
        const diffTime = Math.abs(moment(givenTime).diff(
            moment(lastLoginTime, DATETIME_FORMAT_DDMMYYYYHHMMSS), 'days'
        ))
        hasValidLoginTime = diffTime >= 0
    }
    return hasValidLoginTime
}

export function getQuestionnairesFilled(questionnaireStates=[]) {
    const atRestQuestionnaireId = '4.3'
    const todayDate = moment().format(DATE_FORMAT_DDMMYYYY)
    const qTypes = _.flatMap(qCategories, 'types')
    const groupedStatesByFinishedAtDate = _.groupBy(questionnaireStates, 'finishedAtDate')
    const todayFilledQuestionnaires = groupedStatesByFinishedAtDate[todayDate]
    const atRestQType = qTypes.find((qType) => qType.id === atRestQuestionnaireId)
    const atRestQuestionnaires = questionnaireStates.filter((q) =>
      atRestQType.questionnaires.includes(q.questionnaire)
    )
    let atRestQuestionnairesIds = atRestQuestionnaires.map((q, index) => {
      q.restId = `${atRestQuestionnaireId}_${index + 1}`
      return q
    })
    atRestQuestionnairesIds = _.sortBy(atRestQuestionnairesIds, 'finishedAt').reverse()
    const stateTypes = _.flatMap(questionnaireStates, 'questionnaire')
    const uniqueStateTypes = [
      ...new Set(_.flatMap(questionnaireStates, 'questionnaire'))
    ]

    const finishedQTypes = qTypes
      .map((qType) => {
        qType.filledTypes = stateTypes.filter((stateType) =>
          qType.questionnaires.includes(stateType)
        )
        qType.filledTypesUnique = [
          ...new Set(_.intersection(qType.questionnaires, uniqueStateTypes))
        ]
        qType.filledTypesOnlyDouble = qType.filledTypesUnique.filter((fType) => {
          return qType.filledTypes.filter((fType2) => fType === fType2).length > 1
        })
        qType.filledTypesToday = _.intersection(
          qType.questionnaires,
          _.flatMap(todayFilledQuestionnaires, 'questionnaire')
        )
        qType.filledId = [qType.id]

        const qStates = questionnaireStates
          .filter((state) => qType.questionnaires.includes(state.questionnaire))
          .reverse()
        const todayQStates = questionnaireStates.filter(
          (state) =>
            qType.questionnaires.includes(state.questionnaire) &&
            moment(String(state.finishedAt), DATETIME_FORMAT_YYYYMMDDTHHMMSS).format(
              DATE_FORMAT_DDMMYYYY
            ) === todayDate
        )

        if (qStates.length) {
          const state = qStates[0]
          qType.finishedAt = state ? state.finishedAt : ''
          qType.finishedAtDate = qType.finishedAt
            ? moment(qType.finishedAt, DATETIME_FORMAT_YYYYMMDDTHHMMSS).format(
                DATE_FORMAT_DDMMYYYY
              )
            : ''
        }

        qType.hasFinishedToday = !!todayQStates.length
        qType.hasFinishedAllTypes =
          qType.filledTypesUnique.length === qType.questionnaires.length
        qType.hasFinishedAllTypesToday =
          !!todayQStates.length && qType.filledTypesToday.length >= qType.questionnaires.length

        if (qType.id === '2.2') {
          qType.hasFinishedAllTypes =
            qType.hasFinishedAllTypes &&
            qType.filledTypesOnlyDouble.length >= qType.questionnaires.length
        } else if (qType.id === '3.2') {
          qType.hasFinishedAllTypes =
            qType.hasFinishedAllTypes &&
            qType.filledTypesOnlyDouble.length >= qType.questionnaires.length
        } else if (qType.id === '4.1') {
          qType.hasFinishedAllTypes = qType.hasFinishedAllTypesToday
        } else if (qType.id === '4.2') {
          qType.hasFinishedAllTypes = qType.hasFinishedAllTypesToday
        } else if (qType.id === '4.3') {
          qType.filledId = atRestQuestionnairesIds.length
            ? _.flatMap(atRestQuestionnairesIds, 'restId')
            : [qType.id]
          qType.hasFinishedAllTypes = qType.hasFinishedAllTypesToday
        }

        return qType
      })
      .filter((qType) => {
        return qType.hasFinishedAllTypes
    })

    return [..._.flatMap(finishedQTypes, 'filledId')]
}

export function getQuestionnairesToShow() {
    const qTypes = getQuestionnaireTypes()
    const todayTime = new Date()
    let getters = null
    let toShow = []
    let filled = []
    if(hasStore()) {
        getters = window.$nuxt.$store.getters
        toShow = getters['user/getQuestionnaire'].toShow || []
        filled = getters['user/getQuestionnaire'].filled || []
    }
    try {
        if(getters) {
            qTypes.forEach((questionnaireType) => {
                let isFilled = filled.includes(questionnaireType.id)
                const { firstLoginTime } = getters['user/getLogin']
                const { completedProjectsCount} = getters['user/getProject']
                const { firstAnnotationTime, hasAnnotatedToday } = getters['user/getAnnotation']
                let { firstQuestionnaireFilledTime } = getters['user/getQuestionnaire']
                firstQuestionnaireFilledTime = firstQuestionnaireFilledTime 
                                                ? moment(firstQuestionnaireFilledTime, 
                                                    DATETIME_FORMAT_DDMMYYYYHHMMSS).toDate() 
                                                : new Date() 
                const firstLoginTimeAtZero = moment(firstLoginTime, DATETIME_FORMAT_DDMMYYYYHHMMSS).format(DATE_FORMAT_DDMMYYYY)+" 00:00:00"
                const defaultTime = firstAnnotationTime || firstLoginTimeAtZero
                const firstLoginTimeMonthDiff = Math.abs(moment(todayTime).diff(
                    moment(firstLoginTimeAtZero, DATETIME_FORMAT_DDMMYYYYHHMMSS), 'months', true
                ))
                const firstQuestionnaireFilledMonthDiff = Math.abs(moment(todayTime).diff(
                    moment(firstQuestionnaireFilledTime), 'months', true
                ))
                const hasPassedResearchTime = firstQuestionnaireFilledMonthDiff >= RESEARCH_TIME_IN_MONTHS 
                    || firstLoginTimeMonthDiff >= RESEARCH_TIME_IN_MONTHS

                let isShowing = false
                if(questionnaireType.id === '1.1') {
                    const hourDiff = Math.abs(moment(firstLoginTime, DATETIME_FORMAT_DDMMYYYYHHMMSS)
                                        .diff(moment(todayTime), 'hours'))
                    const isFirstSignIn = hourDiff < .5
                    isShowing = !isFilled && isFirstSignIn
                } else if(questionnaireType.id === "2.1") {
                    isShowing = !isFilled
                } else if(questionnaireType.id === "2.2") {
                    isShowing = !isFilled && hasPassedResearchTime
                } else if(questionnaireType.id === "3.1") {
                    const weekDiff = Math.abs(moment(todayTime)
                                    .diff(moment(defaultTime, DATETIME_FORMAT_DDMMYYYYHHMMSS), 'weeks'))
                    const hasPassedOneWeek = weekDiff >= 1
                    isShowing = !isFilled && hasPassedOneWeek
                } else if(questionnaireType.id === "3.2") {
                    isShowing = !isFilled && hasPassedResearchTime
                } else if(questionnaireType.id === "4.1") {
                    isShowing = !isFilled && !hasAnnotatedToday
                }  else if(questionnaireType.id === "4.2") {
                    const currentHour = todayTime.getHours()
                    const isEvening = currentHour >= 17 && currentHour < 23
                    isShowing = !isFilled && isEvening && hasAnnotatedToday
                } else if(questionnaireType.id === "4.3") {
                    isFilled = !!filled.find((fill)=> fill === `4.3_${completedProjectsCount}`)
                    const hasAnnotatedBatch = hasAnnotatedToday 
                                            && completedProjectsCount > 0 
                    isShowing = !isFilled && hasAnnotatedBatch
                } else if(questionnaireType.id === "5.1") {
                    isShowing = !isFilled && hasPassedResearchTime
                } else if(questionnaireType.id === "6.1") {
                    const weekDiff = Math.abs(moment(todayTime)
                                    .diff(moment(defaultTime, DATETIME_FORMAT_DDMMYYYYHHMMSS), 'weeks'))
                    const hasPassedTwoWeeks = weekDiff >= 2
                    isShowing = !isFilled && hasPassedTwoWeeks
                }

                if(isShowing && !toShow.includes(questionnaireType.id)) {
                    toShow = toShow.concat(questionnaireType.id)
                }
            })
        }
    }
    catch(error) {
        console.error(error)
    }

    return toShow
}

