<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
  >
    <v-card>
      <v-card-title>
        <p>{{ $t('generic.restingMessage.title') }}</p>
      </v-card-title>
      <v-card-text>
        <p>{{ $t('generic.restingMessage.message1') }}</p>
        <p>{{ $t('generic.restingMessage.message2') }} {{ endTime }}</p>
        <p>{{ $t('generic.restingMessage.message3') }}</p>

        <v-row justify="end">
          <button class="mr-5" @click="signout">
            <v-icon class="button-logout-icon" :style="{ display: 'inline' }">{{ mdiLogout }}</v-icon>
            <div class="button-logout-text" :style="{ display: 'inline' }">{{ $t('user.signOut') }}</div>
          </button>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { mdiLogout } from '@mdi/js'
import { mapActions } from 'vuex'
import Vue from 'vue'

export default Vue.extend({
  props: {
    endTime: {
      type: String,
      required: true
    }
  },

  data() {
    return {
      mdiLogout,
      dialog: true
    }
  },

  methods: {
    ...mapActions('auth', ['logout']),
    signout() {
      this.logout()
      this.$router.push(this.localePath('/'))
    }
  }
})
</script>

<style>
.button-logout-icon {
  display: 'inline';
}

.button-logout-text:hover {
  text-decoration: underline;
  display: 'inline';
}
</style>
