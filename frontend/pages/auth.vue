<template>
  <v-app id="inspire">
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <form-login :login="authenticateUser" />
            <v-btn outlined block class="mt-4" :href="ssoLoginUrl"> Login with SSO </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'
import FormLogin from '@/components/auth/FormLogin.vue'

export default Vue.extend({
  components: {
    FormLogin
  },

  computed: {
    ssoLoginUrl() {
      const baseUrl = window.location.origin
      const apiUrl = process.env.API_URL || 'http://localhost:8000'

      return `${apiUrl}/keycloak/login?next=${baseUrl}/projects?limit=10&offset=0`
    }
  },

  methods: {
    ...mapActions('auth', ['authenticateUser'])
  }
})
</script>
