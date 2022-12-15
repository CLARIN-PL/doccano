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
import {
  DATETIME_FORMAT_DDMMYYYYHHMMSS,
  DATE_FORMAT_DDMMYYYY,
  DATETIME_FORMAT_YYYYMMDDTHHMMSS
} from '~/settings/'

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
    async setQuestionnaireData() {
      const ids = _.flatMap(qCategories, 'id')
      const limit = 1000
      const serverDateFormat = 'YYYY-MM-DDThh:mm:ss'
      const dateFormat = 'DD-MM-YYYY'
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
      const questionnaireStates: any[] = _.sortBy(states.items, 'finishedAt').map((state: any) => {
        state.finishedAtDate = state.finishedAt
          ? moment(String(state.finishedAt), DATETIME_FORMAT_YYYYMMDDTHHMMSS).format(
              DATE_FORMAT_DDMMYYYY
            )
          : ''
        return state
      })
      this.questionnaireStates = _.cloneDeep(questionnaireStates)
    },
    async loadQuestionnaires() {
      this.isLoaded = false
      try {
        const atRestQuestionnaireId = '4.3'
        const textBatchCount = 20
        let todayAtRestQuestionnairesIds: any[] = []
        const todayDate = moment().format(DATE_FORMAT_DDMMYYYY)
        const qTypes = _.flatMap(qCategories, 'types')

        await this.setQuestionnaireData()

        const groupedStatesByFinishedAtDate = _.groupBy(this.questionnaireStates, 'finishedAtDate')
        const todayFilledQuestionnaires = groupedStatesByFinishedAtDate[todayDate]
        const atRestQType = qTypes.find((qType) => qType.id === atRestQuestionnaireId)
        if (todayFilledQuestionnaires && todayFilledQuestionnaires.length) {
          const atRestQuestionnaires = todayFilledQuestionnaires.filter((q) =>
            atRestQType.questionnaires.includes(q.questionnaire)
          )
          todayAtRestQuestionnairesIds = atRestQuestionnaires.map((q: any, index) => {
            q.restId = `${atRestQuestionnaireId}_${(index + 1) * textBatchCount}`
            return q
          })
          todayAtRestQuestionnairesIds = _.sortBy(
            todayAtRestQuestionnairesIds,
            'finishedAt'
          ).reverse()
        }
        const stateTypes: any[] = _.flatMap(this.questionnaireStates, 'questionnaire')
        const uniqueStateTypes: any[] = [
          ...new Set(_.flatMap(this.questionnaireStates, 'questionnaire'))
        ]
        const finishedQTypes: any[] = qTypes
          .map((qType) => {
            qType.filledTypes = stateTypes.filter((stateType) =>
              qType.questionnaires.includes(stateType)
            )
            qType.filledTypesUnique = [
              ...new Set(_.intersection(qType.questionnaires, uniqueStateTypes))
            ]
            qType.filledTypesOnlyDouble = qType.filledTypesUnique.filter((fType: String) => {
              return qType.filledTypes.filter((fType2: String) => fType === fType2).length > 1
            })
            qType.filledTypesOnlyOnce = _.difference(
              qType.filledTypesUnique,
              qType.filledTypesOnlyDouble
            )
            qType.filledTypesToday = _.intersection(
              qType.questionnaires,
              _.flatMap(todayFilledQuestionnaires, 'questionnaire')
            )
            qType.filledId = [qType.id]

            const qStates = this.questionnaireStates
              .filter((state) => qType.questionnaires.includes(state.questionnaire))
              .reverse()
            const todayQStates = this.questionnaireStates.filter(
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
                qType.filledTypesOnlyDouble.length * 2 >= qType.questionnaires.length * 2
            } else if (qType.id === '3.2') {
              qType.hasFinishedAllTypes =
                qType.hasFinishedAllTypes &&
                qType.filledTypesOnlyDouble.length * 2 >= qType.questionnaires.length * 2
            } else if (qType.id === '4.1') {
              qType.hasFinishedAllTypes = qType.hasFinishedAllTypesToday
            } else if (qType.id === '4.2') {
              qType.hasFinishedAllTypes = qType.hasFinishedAllTypesToday
            } else if (qType.id === '4.3') {
              qType.filledId = todayAtRestQuestionnairesIds.length
                ? _.flatMap(todayAtRestQuestionnairesIds, 'restId')
                : [qType.id]
              qType.hasFinishedAllTypes = qType.hasFinishedAllTypesToday
            }

            return qType
          })
          .filter((qType) => {
            return qType.hasFinishedAllTypes
          })

        await this.setQuestionnaire({
          filled: [..._.flatMap(finishedQTypes, 'filledId')],
          toShow: []
        })
        this.$nextTick(() => {
          this.isLoaded = true
        })
      } catch (error) {
        console.error(error)
      }
    },
    setUserData() {
      try {
        const loginTime = moment().format(DATETIME_FORMAT_DDMMYYYYHHMMSS)
        const lastLoginTime = this.getLogin.lastLoginTime
        const lastLoginDay = parseInt(
          moment(lastLoginTime, DATETIME_FORMAT_DDMMYYYYHHMMSS).format('DD')
        )
        const todayDay = parseInt(moment().format('DD'))
        let currentDiffDay = this.getLogin.lastLoginTime
          ? Math.abs(
              moment(new Date()).diff(moment(lastLoginTime, DATETIME_FORMAT_DDMMYYYYHHMMSS), 'days')
            )
          : 0
        currentDiffDay = currentDiffDay === 0 ? todayDay - lastLoginDay : currentDiffDay

        this.checkLoginDataValidity(lastLoginTime)
        this.setLoginData(loginTime)
        this.filterDailyQuestionnaireEveryday(currentDiffDay)
      } catch (error) {
        console.error(error)
      }
    },
    checkLoginDataValidity(lastLoginTime: String) {
      if (lastLoginTime && !hasValidLoginTime(new Date())) {
        this.setAnnotation({
          hasAnnotatedToday: false
        })
        this.setQuestionnaire({
          toShow: [],
          inProgress: [],
          filled: []
        })
      }
    },
    setLoginData(loginTime: String) {
      if (!this.getLogin.firstLoginTime) {
        this.setLogin({
          firstLoginTime: loginTime,
          isFirstLogin: true,
          lastLoginTime: loginTime
        })
      } else {
        this.setLogin({ isFirstLogin: false, lastLoginTime: loginTime })
      }
    },
    filterDailyQuestionnaireEveryday(currentDiffDay: number) {
      if (currentDiffDay > 0) {
        const { filled } = this.getQuestionnaire
        const dailyQuestionnaireId = '4'
        this.setAnnotation({
          hasAnnotatedToday: false
        })
        this.setQuestionnaire({
          filled: filled.filter((fill: any) => !fill.startsWith(dailyQuestionnaireId))
        })
      }
    },
    async initUserData() {
      const user = await this.$services.user.getMyProfile()
      const userHistory = this.getHistories.find((hist: any) => hist.id === user.id)
      if (user.id && !userHistory) {
        this.setUserId(user.id)
        this.addHistory({ ...history, id: user.id })
      }
      this.isLoaded = true
    },
    async tryLogin() {
      try {
        await this.login({
          username: this.username,
          password: this.password
        })
        await this.initUserData()
        setTimeout(() => {
          this.$nextTick(async () => {
            this.isLoaded && (await this.loadQuestionnaires())
            this.$forceUpdate()
            setTimeout(async () => {
              if (this.isLoaded) {
                await this.setUserData()
                this.$nextTick(async () => {
                  const questionnaireStates =
                    await this.$services.questionnaire.listFinishedQuestionnaires({
                      questionnaireTypeId: 1,
                      limit: 1
                    })
                  let firstQuestionnaireEverDate = null
                  if (questionnaireStates && questionnaireStates.items.length > 0) {
                    const firstQuestionnaireEver = questionnaireStates.items[0].finishedAt
                    firstQuestionnaireEverDate = moment(String(firstQuestionnaireEver)).format(
                      DATE_FORMAT_DDMMYYYY
                    )
                  }
                  await this.initQuestionnaire(firstQuestionnaireEverDate)
                })
                this.$router.push(this.localePath('/projects'))
              }
            }, 100)
          })
        }, 100)
      } catch {
        this.showError = true
      }
    }
  }
})
</script>
