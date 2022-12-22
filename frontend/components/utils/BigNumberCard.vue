<template>
  <v-card flat class="mb-2">
    <v-card-text class="d-flex justify-start align-end">
      <span class="card-label mr-3">
        {{ label }}
      </span>
      <span class="card-value">
        {{ valueString }}
      </span>
    </v-card-text>
  </v-card>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  props: {
    label: {
      type: String,
      default: ""
    },
    value: {
      type: Number,
      required: true
    }
  },

  computed: {
    valueString() {
      const currentLocale = this.$i18n.locale
      return this.value.toLocaleString(currentLocale)
    }
  }
})
</script>

<style>
.card-label {
  font-size: 0.8rem;
}

.card-value {
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
