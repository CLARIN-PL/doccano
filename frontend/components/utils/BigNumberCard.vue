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
    },
    showDecimal: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    valueString() {
      return (this.showDecimal) ? this.value.toFixed(3).toString() : this.value.toFixed(0).toString()
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
