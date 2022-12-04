<template>
  <div>
    <small>
      {{ header }}
    </small>
    <p>
      {{ question }}
      <span v-if="required" class="red--text">*</span>
    </p>
    <v-radio-group v-model="input">
      <v-radio
        v-for="(option, idx) in options"
        :key="idx"
        :disabled="readOnly || isSubmitting"
        :label="option.text"
        :value="option.value"
      ></v-radio>
    </v-radio-group>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  name: 'ScaleInput',
  props: {
    question: {
      type: String,
      default: ''
    },
    header: {
      type: String,
      default: ''
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    isSubmitting: {
      type: Boolean,
      default: false
    },
    passedData: {
      type: Object,
      default: () => {}
    },
    required: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    input: {
      get() {
        // @ts-ignore
        return this.value
      },
      set(val) {
        const base: any = this
        base.$emit('input', val)
        base.$emit('change', { ...base.passedData, value: val })
      }
    }
  }
})
</script>