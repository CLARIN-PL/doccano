<template>
  <v-card class="greeting-card">
    <v-card-text>
      <h2 class="title mb-5">{{ $t('questionnaires_main.greetings') }},</h2>
      <p class="text-md-body-1">
        {{ $t('questionnaires_main.greetingsDetail') }}
      </p>
    </v-card-text>
    <v-divider />
    <v-card-actions class="pt-5">
      <v-spacer />
      <v-btn color="primary" @click="onStartButtonClick">
        {{ $i18n.t('home.getStarted') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  methods: {
    onStartButtonClick() {
      this.$emit('click')
    }
  }
})
</script>

<style lang="scss">
.greeting-card {
  padding: 20px;
}
</style>
