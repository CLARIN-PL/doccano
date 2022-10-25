<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    persistent
  >
    <v-card>
      <v-card-title>
        <p>Time to rest!</p>
      </v-card-title>
      <v-card-text>
        <p>Thank you for your work! Please have some coffee before continuing!</p>
        <p>You can continue annotating at: {{ endTime }}</p>
        <p>Please refresh this page when the time to rest has ended.</p>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    endTime: {
      type: Date,
      required: true
    }
  },

  data() {
    return {
      dialog: true
    }
  }
})
</script>
