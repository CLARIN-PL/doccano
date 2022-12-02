import moment from 'moment'
import _ from 'lodash'

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

const RESEARCH_TIME_IN_MONTHS = 3
const TEXT_BATCH_COUNT = 20
const DATE_FORMAT = "DD-MM-YYYY HH:mm:ss"

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
            },
            {
                id: "2.2",
                name: "Przed i po badaniu (po badaniu)",
                count: 8,
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
                count: 1
            },
            {
                id: "3.2",
                name: "Na końcu badań",
                count: 1
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
                name: "Rano (sen, stres)",
                count: 2,
            },
            {
                id: "4.2",
                name: "Wieczorem (stres, zdrowie)",
                count: 2
            },
            {
                id: "4.3",
                name: "W przerwie (emocje)",
                count: 1
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
            }
        ]
    }
]

export function hasStore() {
    return !!window.$nuxt && !!window.$nuxt.$store
}

export function setQuestionnaireIds(qTypes, questionnaires, questions=[]) {
    return qTypes.map((qType)=> {
        if(qType && qType.questionnaires) {
            qType.questionnaires = qType.questionnaires.map((que)=> {
                const queId = questionnaires.find((q)=> q.name === que.name)
                if(queId) {
                    que.id = queId
                }
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
                        }
                        return question
                    })
                    return segment
                })
                return que
            })
        }
        return qType
    })
}

export function mapQuestionnaireTypes(qTypes) {
    const numberInputs = ['slider', 'scale']
    return qTypes.map((qType)=> {
        qType.questionnaires = qType.questionnaires.map((questionnaire)=> {
            questionnaire.segments = questionnaire.segments.map((segment)=> {
                segment.questions = segment.questions.map((question)=> {
                    question.key = 0
                    question.required = question.required === undefined ? true : question.required
                    question.readOnly = question.readOnly === undefined ? false : question.readOnly
                    question.errorMessage = ""
                    question.isSubmitting = false
                    question.isClicked = false
                    question.value = numberInputs.includes(question.type) ? 0 : ""
                    question.config = {}


                    if(question.options) {
                        question.options = question.options.map((option)=> {
                            option.value = option.value === undefined ? option.text : option.value
                            
                            if(option.dynamicSelectInput) {
                                option.dynamicSelectInput.options = option.dynamicSelectInput.options.map((opt)=> {
                                    opt.value = opt.value === undefined ? opt.text : opt.value
                                    return opt
                                })
                            }
                            return option
                        })
                    }


                    if(question.type === 'scale') {
                        let min = question.min
                        question.options = []
                        while(min <= question.max) {
                            question.options.push({
                                text: min.toString(),
                                value: min.toString()
                            })
                            min++
                        }
                    } else if(question.type === "slider") {
                        question.config = {
                            min: question.min,
                            max: question.max,
                            minLabel: question.minLabel,
                            maxLabel: question.maxLabel,
                            showTickLabels: question.showTickLabels ?? true
                        }
                    } else if(question.type === "text" || question.type === "radio") {
                        question.config = {
                            numericOnly: question.numericOnly ?? false
                        }
                    }
                    
                    question.rules = []
                    if(question.required) {
                        const requiredCheck = (item) => !!item
                        question.rules.push(requiredCheck)
                    }

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
                const isFilled = filled.includes(questionnaireType.id)
                const { firstLoginTime } = getters['user/getLogin']
                const { hasAnnotatedToday, textCountToday } = getters['user/getAnnotation']
                const { hasFinishedAll } = getters['user/getProject'] 
                const monthDiff = moment(firstLoginTime, DATE_FORMAT)
                                    .diff(moment(todayTime), 'months')
                const hasPassedResearchTime = monthDiff >= RESEARCH_TIME_IN_MONTHS
                let isShowing = false
                if(questionnaireType.id === '1.1') {
                    const hourDiff = moment(firstLoginTime, DATE_FORMAT)
                                        .diff(moment(todayTime), 'hours')
                    const isFirstSignIn = hourDiff < .5
                    isShowing = !isFilled && isFirstSignIn
                } else if(questionnaireType.id === "2.1") {
                    isShowing = !isFilled
                } else if(questionnaireType.id === "2.2") {
                    isShowing = !isFilled 
                                && hasFinishedAll 
                                && hasPassedResearchTime
                } else if(questionnaireType.id === "3.1") {
                    const weekDiff = moment(firstLoginTime, DATE_FORMAT)
                                    .diff(moment(todayTime), 'weeks')
                    const hasPassedOneWeek = weekDiff >= 1
                    isShowing = !isFilled && hasPassedOneWeek
                } else if(questionnaireType.id === "3.2") {
                    isShowing = !isFilled && hasPassedResearchTime
                } else if(questionnaireType.id === "4.1") {
                    isShowing = !isFilled && !hasAnnotatedToday
                }  else if(questionnaireType.id === "4.2") {
                    const currentTimeHour = todayTime.getHours()
                    const isEvening = currentTimeHour >= 17 && currentTimeHour <= 23
                    isShowing = !isFilled && isEvening
                } else if(questionnaireType.id === "4.3") {
                    const hasAnnotatedBatch = hasAnnotatedToday 
                                            && textCountToday > 0 
                                            && textCountToday%TEXT_BATCH_COUNT === 0
                    isShowing = hasAnnotatedBatch
                } else if(questionnaireType.id === "5.1") {
                    isShowing = !isFilled 
                                && hasFinishedAll
                                && hasPassedResearchTime
                } else if(questionnaireType.id === "6.1") {
                    const weekDiff = moment(firstLoginTime, DATE_FORMAT)
                                    .diff(moment(todayTime), 'weeks')
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

