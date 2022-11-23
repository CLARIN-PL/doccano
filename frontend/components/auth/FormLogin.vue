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
import moment from 'moment'
import { mdiAccount, mdiLock } from '@mdi/js'
import { mapGetters, mapActions } from 'vuex'
import { userNameRules, passwordRules } from '@/rules/index'
import BaseCard from '@/components/utils/BaseCard.vue'

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
      mdiAccount,
      mdiLock
    }
  },

  methods: {
    ...mapGetters('user', ['getLogin', 'getQuestionnaire']),
    ...mapActions('user', ['setLogin', 'initQuestionnaire', 'setAnnotation', 'setQuestionnaire']),
    setUserData() {
      try {
        const firstLoginTime = moment().format('DD-MM-YYYY HH:mm:ss')
        if(!this.getLogin.firstLoginTime) {         
          this.setLogin({firstLoginTime, isFirstLogin: true})
        } else {
          this.setLogin({isFirstLogin: false})
        }
        this.setAnnotation({ hasAnnotatedToday: false})
        this.initQuestionnaire()
      }
      catch(error) {
        console.error(error)
      }
    },
    async tryLogin() {
      try {
        await this.login({
          username: this.username,
          password: this.password
        })
        this.setUserData()
        this.$router.push(this.localePath('/projects'))
      } catch {
        this.showError = true
      }
    }
  }
})
</script>
