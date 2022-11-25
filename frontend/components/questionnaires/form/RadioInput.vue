<template>
  <div>
    <p>
      {{ header }}
      {{ question }}
      <span v-if="required">*</span>
    </p>
    <v-radio-group v-model="input">
      <v-radio
        v-for="(option, idx) in options"
        :key="idx"
        :disabled="readOnly || isSubmitting"
        :label="option.text"
        :value="option.value"
      >
      </v-radio>

      <text-input
        v-if="selectedOption.showTextbox"
        v-model="inputText"
        :question="selectedOption.question || selectedOption.text"
        :full-question="selectedOption.question || selectedOption.text"
        :required="required"
        @submit="onInputSubmit"
      />
    </v-radio-group>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import TextInput from '~/components/questionnaires/form/TextInput.vue'

export default Vue.extend({
  name: 'RadioInput',
  components: {
    TextInput
  },
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
    isClicked: {
      type: Boolean,
      default: false
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
    },
    errorMessage: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    selectedOption() {
      const base: any = this
      const value = base.value.includes(' - ') ? base.value.split(' - ')[0] : base.value
      return base.options.find((option: any) => option.value === value) || {}
    },
    isCustom() {
      const base: any = this
      const value = base.value.includes(' - ') ? base.value.split(' - ')[0] : ''
      return base.value && !base.options.find((option: any) => option.value === value)
    },
    inputText: {
      get() {
        const base: any = this
        const value = base.value.includes(' - ') ? base.value.split(' - ')[1] : ''
        return value
      },
      set(val) {
        const value = val ? `${this.input} - ${val}` : this.input
        this.$emit('input', value)
        this.$emit('change', value)
      }
    },
    input: {
      get() {
        const base: any = this
        const value = base.value.includes(' - ') ? base.value.split(' - ')[0] : base.value
        return value
      },
      set(val) {
        if (val) {
          const base: any = this
          const value =
            this.inputText && this.selectedOption.showTextbox ? `${val} - ${this.inputText}` : val
          base.$emit('input', value)
          base.$emit('change', value)
        }
      }
    }
  },
  methods: {
    onInputSubmit(val) {
      const base: any = this
      base.$emit('change', `${this.input} - ${val}`)
    }
  }
})
</script>