<template>
  <base-card
    :disabled="!valid"
    :title="$t('user.login')"
    :agree-text="$t('user.login')"
    @agree="tryLogin"
  >
    <template #content>
      <v-form v-model="valid">
        <v-alert v-show="showError" v-model="showError" type="error" dismissible>
          {{ $t('errors.invalidUserOrPass') }}
        </v-alert>
        <v-text-field
          v-model="username"
          :rules="userNameRules($t('rules.userNameRules'))"
          :label="$t('user.username')"
          name="username"
          :prepend-icon="mdiAccount"
          type="text"
          autofocus
          @keyup.enter="tryLogin"
        />
        <v-text-field
          id="password"
          v-model="password"
          :rules="passwordRules($t('rules.passwordRules'))"
          :label="$t('user.password')"
          name="password"
          :prepend-icon="mdiLock"
          type="password"
          @keyup.enter="tryLogin"
        />
      </v-form>
    </template>
  </base-card>
</template>

<script lang="ts">
import { QuestionnaireTimeItem } from 'domain/models/questionnaire/questionnaire'
import Vue from 'vue'
import _ from 'lodash'
import moment from 'moment'
import { mdiAccount, mdiLock } from '@mdi/js'
import { mapGetters, mapActions } from 'vuex'
import { userNameRules, passwordRules } from '@/rules/index'
import BaseCard from '@/components/utils/BaseCard.vue'
import { history } from '~/store/user'
import { qCategories, hasValidLoginTime } from '~/utils/questionnaires'

export default Vue.extend({
  components: {
    BaseCard
  },

  props: {
    login: {
      type: Function,
      default: () => Promise
    }
  },
  data() {
    return {
      valid: false,
      isLoaded: false,
      username: '',
      password: '',
      userNameRules,
      passwordRules,
      showError: false,
      questionnaires: [] as any[],
      questionnaireStates: [] as QuestionnaireTimeItem[],
      mdiAccount,
      mdiLock
    }
  },
  computed: {
    ...mapGetters('user', ['getLogin', 'getQuestionnaire', 'getHistories', 'getAnnotation'])
  },
  methods: {
    ...mapActions('user', [
      'setUserId',
      'setLogin',
      'initQuestionnaire',
      'setAnnotation',
      'setQuestionnaire',
      'addHistory'
    ]),
    async loadQuestionnaires() {
      try {
        const ids = _.flatMap(qCategories, 'id')
        const limit = 100
        const atRestQuestionnaireId = '4.3'
        const textBatchCount = 20
        const researchTimeInMonths = 3
        const serverDateFormat = 'YYYY-MM-DDThh:mm:ss'
        const dateFormat = 'DD-MM-YYYY'
        const savedDateFormat = 'DD-MM-YYYY hh:mm:ss'
        let todayAtRestQuestionnairesIds: any[] = []
        const todayDate = moment().format(dateFormat)
        const qTypes = _.flatMap(qCategories, 'types')
        const { hasAnnotatedToday } = this.getAnnotation
        const questionnairePromises = ids.map((id) => {
          return this.$services.questionnaire.listQuestionnairesByTypeId({
            qTypeId: id,
            limit
          })
        })
        const states = await this.$services.questionnaire.listFinishedQuestionnaires({
          limit
        })

        const questionnaireResponses: any[] = await Promise.all(questionnairePromises)
        this.questionnaires = _.cloneDeep(_.flatMap(questionnaireResponses, 'items'))
        const questionnaireStates: any[] = _.sortBy(states.items, 'finishedAt').map((state) => {
          state.finishedAtDate = state.finishedAt
            ? moment(state.finishedAt, serverDateFormat).format(dateFormat)
            : ''
          return state
        })
        this.questionnaireStates = _.cloneDeep(questionnaireStates)

        const groupedStatesByFinishedAtDate = _.groupBy(this.questionnaireStates, 'finishedAtDate')
        const todayFilledQuestionnaires = groupedStatesByFinishedAtDate[todayDate]
        const atRestQType = qTypes.find((qType) => qType.id === atRestQuestionnaireId)
        if (todayFilledQuestionnaires && todayFilledQuestionnaires.length) {
          const atRestQuestionnaires = todayFilledQuestionnaires.filter((q) =>
            atRestQType.questionnaires.includes(q.questionnaire)
          )
          todayAtRestQuestionnairesIds = atRestQuestionnaires.map((q, index) => {
            q.restId = `${atRestQuestionnaireId}_${(index + 1) * textBatchCount}`
            return q
          })
          todayAtRestQuestionnairesIds = _.sortBy(
            todayAtRestQuestionnairesIds,
            'finishedAt'
          ).reverse()
        }

        const stateTypes: any[] = [...new Set(_.flatMap(this.questionnaireStates, 'questionnaire'))]
        const finishedCategories: any[] = qTypes
          .map((qType) => {
            qType.filledTypes = _.intersection(qType.questionnaires, stateTypes)
            qType.filledTypesUnique = [...new Set(_.intersection(stateTypes, qType.questionnaires))]
            const hasFinishedAllTypes = qType.filledTypes.length === qType.questionnaires.length

            const qStates = this.questionnaireStates
              .filter((state) => qType.questionnaires.includes(state.questionnaire))
              .reverse()
            const todayQStates = this.questionnaireStates.filter(
              (state) =>
                qType.questionnaires.includes(state.questionnaire) &&
                moment(state.finishedAt, serverDateFormat).format(dateFormat) === todayDate
            )

            if (qStates.length) {
              const state = qStates[0]
              qType.finishedAt = state ? state.finishedAt : ''
              qType.finishedAtDate = qType.finishedAt
                ? moment(qType.finishedAt, serverDateFormat).format(dateFormat)
                : ''
            }

            qType.hasFinishedToday = !!todayQStates.length
            qType.hasFinishedAllTypesToday = !!todayQStates.length && hasFinishedAllTypes

            const monthDiff = moment(new Date()).diff(
              moment(qType.finishedAt, dateFormat),
              'months'
            )
            const hasPassedResearchTime = monthDiff >= researchTimeInMonths

            qType.filledId = [qType.id]
            if (qType.id === '1.1') {
              qType.hasFinishedAllTypes = hasFinishedAllTypes
            } else if (qType.id === '2.1') {
              qType.hasFinishedAllTypes = hasFinishedAllTypes
            } else if (qType.id === '2.2') {
              qType.hasFinishedAllTypes =
                hasFinishedAllTypes && qType.filledTypes.length === qType.questionnaires.length * 2
            } else if (qType.id === '3.1') {
              const weekDiff = moment(new Date()).diff(
                moment(qType.finishedAt, savedDateFormat),
                'weeks'
              )
              const hasPassedOneWeek = weekDiff >= 1
              qType.hasFinishedAllTypes = hasFinishedAllTypes && hasPassedOneWeek
            } else if (qType.id === '3.2') {
              qType.hasFinishedAllTypes =
                hasFinishedAllTypes &&
                hasPassedResearchTime &&
                qType.filledTypes.length === qType.questionnaires.length * 2
            } else if (qType.id === '4.1') {
              qType.hasFinishedAllTypes = hasFinishedAllTypes && todayQStates.length
            } else if (qType.id === '4.2') {
              const currentHour = new Date().getHours()
              const isEvening = currentHour >= 17 && currentHour < 23
              qType.hasFinishedAllTypes = hasFinishedAllTypes && isEvening && hasAnnotatedToday
            } else if (qType.id === '4.3') {
              const firstTodayAtRestQuestionnaire = todayAtRestQuestionnairesIds.length
                ? todayAtRestQuestionnairesIds[0]
                : {}
              qType.filledId = todayAtRestQuestionnairesIds.length
                ? _.flatMap(todayAtRestQuestionnairesIds, 'restId')
                : [qType.id]
              qType.hasFinishedAllTypes =
                hasFinishedAllTypes && firstTodayAtRestQuestionnaire.finishedAtDate
              todayAtRestQuestionnairesIds.splice(0, 1)
            } else if (qType.id === '5.1') {
              qType.hasFinishedAllTypes = hasFinishedAllTypes && hasPassedResearchTime
            } else if (qType.id === '6.1') {
              const weekDiff = moment(new Date()).diff(
                moment(qType.finishedAt, dateFormat),
                'weeks'
              )
              const hasPassedTwoWeeks = weekDiff >= 2
              qType.hasFinishedAllTypes = hasFinishedAllTypes && hasPassedTwoWeeks
            }

            return qType
          })
          .filter((qType) => {
            return qType.hasFinishedAllTypes
          })

        await this.setQuestionnaire({
          filled: [..._.flatMap(finishedCategories, 'filledId')],
          toShow: []
        })
        this.isLoaded = true
      } catch (error) {
        console.error(error)
      }
    },
    async setUserData() {
      const user = await this.$services.user.getMyProfile()
      const userHistory = this.getHistories.find((hist: any) => hist.id === user.id)

      if (user.id && !userHistory) {
        this.setUserId(user.id)
        this.addHistory({ ...history, id: user.id })
      }

      try {
        const dateFormat = 'DD-MM-YYYY HH:mm:ss'
        const loginTime = moment().format(dateFormat)
        const lastLoginTime = this.getLogin.lastLoginTime
        const lastLoginDay = parseInt(moment(lastLoginTime, dateFormat).format('DD'))
        const todayDay = parseInt(moment().format('DD'))
        let currentDiffDay = this.getLogin.lastLoginTime
          ? moment(new Date()).diff(moment(lastLoginTime, dateFormat), 'days')
          : 0
        currentDiffDay = currentDiffDay === 0 ? todayDay - lastLoginDay : currentDiffDay

        if (!hasValidLoginTime(new Date())) {
          this.setAnnotation({
            textCountToday: 0,
            hasAnnotatedToday: false
          })
          this.setQuestionnaire({
            toShow: [],
            inProgress: [],
            filled: []
          })
        }

        if (!this.getLogin.firstLoginTime) {
          this.setLogin({
            firstLoginTime: loginTime,
            isFirstLogin: true,
            lastLoginTime: loginTime
          })
        } else {
          this.setLogin({ isFirstLogin: false, lastLoginTime: loginTime })
        }

        if (currentDiffDay > 0) {
          const { filled } = this.getQuestionnaire
          const dailyQuestionnaireId = '4'
          this.setAnnotation({
            textCountToday: 0,
            hasAnnotatedToday: false
          })
          this.setQuestionnaire({
            filled: filled.filter((fill: any) => !fill.startsWith(dailyQuestionnaireId))
          })
        }
        this.initQuestionnaire()
      } catch (error) {
        console.error(error)
      }
    },
    async tryLogin() {
      try {
        await this.login({
          username: this.username,
          password: this.password
        })
        await this.loadQuestionnaires()
        this.$forceUpdate()
        this.$nextTick(async () => {
          if (this.isLoaded) {
            await this.setUserData()
            this.$router.push(this.localePath('/projects'))
          }
        })
      } catch {
        this.showError = true
      }
    }
  }
})
</script>
