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
      username: '',
      password: '',
      userNameRules,
      passwordRules,
      showError: false,
      questionnaires: [],
      questionnaireStates: [],
      mdiAccount,
      mdiLock
    }
  },
  computed: {
    ...mapGetters('user', ['getLogin', 'getQuestionnaire', 'getHistories'])
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
      const ids = [1, 2, 3, 4, 5, 6]
      const limit = 100
      const dailyQuestionnaireId = '4'
      const questionnairePromises = ids.map((id) => {
        return this.$services.questionnaire.listQuestionnairesByTypeId({
          questionnaireTypeId: id,
          limit
        })
      })
      const states = await this.$services.questionnaire.listFinishedQuestionnaires({
        limit
      })

      const questionnaireResponses = await Promise.all(questionnairePromises)

      this.questionnaires = _.cloneDeep(_.flatMap(questionnaireResponses, 'items'))
      this.questionnaireStates = _.cloneDeep(states.items)

      const stateTypes = [...new Set(_.flatMap(this.questionnaireStates, 'questionnaire'))]
      console.log(stateTypes)
      const finishedCategories = _.flatMap(qCategories, 'types')
        .map((qType) => {
          qType.intersections = _.intersection(qType.questionnaires, stateTypes)
          const state = this.questionnaireStates.find((state) =>
            qType.questionnaires.includes(state.questionnaire)
          )
          qType.finishedAt = state ? state.finishedAt : ''
          qType.hasFinishedAll = qType.intersections.length === qType.questionnaires.length

          return qType
        })
        .filter((qType) => {
          const isInside = qType.intersections.length > 0
          const todayDay = moment().format('DD-MM-YYYY')
          const finishedAt = qType.finishedAt
            ? moment(qType.finishedAt, 'YYYY-MM-DDThh:mm:ss').format('DD-MM-YYYY')
            : ''

          return qType.id.startsWith(dailyQuestionnaireId)
            ? todayDay === finishedAt && isInside && qType.hasFinishedAll
            : isInside && qType.hasFinishedAll
        })

      this.setQuestionnaire({
        filled: _.flatMap(finishedCategories, 'id')
      })
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
        this.setUserData()
        this.$router.push(this.localePath('/projects'))
      } catch {
        this.showError = true
      }
    }
  }
})
</script>
