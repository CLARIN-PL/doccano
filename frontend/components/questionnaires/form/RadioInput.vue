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
    </v-radio-group>

    <text-input
      v-if="selectedOption.showTextbox"
      v-model="inputText"
      :question="selectedOption.question || selectedOption.text"
      :full-question="selectedOption.question || selectedOption.text"
      :required="required"
      @submit="onTextInputSubmit"
    />

    <dynamic-select-input
      v-if="selectedOption.showDynamicSelectInput"
      @change="onDynamicSelectInputChange"
      v-model="inputDynamicSelect"
      :options="selectedOption.dynamicSelectInput.options"
      :show-add-button="selectedOption.dynamicSelectInput.showAddButton"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import TextInput from '~/components/questionnaires/form/TextInput.vue'
import DynamicSelectInput from '~/components/questionnaires/form/DynamicSelectInput.vue'

export default Vue.extend({
  name: 'RadioInput',
  components: {
    TextInput,
    DynamicSelectInput
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
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      input: '',
      inputText: '',
      inputDynamicSelect: []
    }
  },
  computed: {
    hasAdditionalValue() {
      const keys = ['_multiple-values_', '_single-value_']
      return keys.some((key) => String(this.value).includes(key))
    },
    hasSingleValue() {
      return this.value.includes('_single-value_')
    },
    hasMultipleValues() {
      return this.value.includes('_multiple-values_')
    },
    selectedOption() {
      const base: any = this
      const key = this.hasMultipleValues ? '_multiple-values_' : '_single-value_'
      const value = base.value.includes(key) ? base.value.split(key)[0] : base.value
      const option = base.options.find((option: any) => option.value === value) || {}
      return option
    }
  },
  watch: {
    input(val) {
      this.inputText = ''
      const keys = ['_multiple-values_', '_single-value_']
      const option = this.options.find((option: any) => option.value === val) || {}
      const hasAdditionalValue = keys.some((key) => String(this.input).includes(key))
      let hasFilledEverything = true
      if (option.showTextbox) {
        hasFilledEverything = this.inputText.length > 0
      } else if (option.showDynamicSelectInput) {
        hasFilledEverything = this.inputDynamicSelect.filter((v) => !!v).length > 0
      }
      if (!hasAdditionalValue) {
        this.$emit('input', val)
        this.$emit('change', { ...this.passedData, value: val, hasFilledEverything })
      }
    },
    value() {
      const base: any = this
      const key = this.hasMultipleValues ? '_multiple-values_' : '_single-value_'
      const input = base.value.includes(key) ? base.value.split(key)[0] : base.value
      const adtInput = base.value.includes(key) ? base.value.split(key)[1] : ''

      this.input = input
      if (this.hasMultipleValues) {
        this.inputDynamicSelect = adtInput ? JSON.parse(adtInput) : []
      } else {
        this.inputText = adtInput
      }
    }
  },
  methods: {
    onDynamicSelectInputChange({ hasFilledEverything }) {
      const filteredVal = this.inputDynamicSelect ? this.inputDynamicSelect.filter((v) => !!v) : []
      const value = filteredVal.length
        ? `${this.input}_multiple-values_${JSON.stringify(filteredVal)}`
        : this.input
      this.$emit('input', value)
      this.$emit('change', { ...this.passedData, value, hasFilledEverything })
    },
    onTextInputSubmit(val) {
      this.inputText = val
      const value = this.inputText ? `${this.input}_single-value_${this.inputText}` : this.input
      this.$emit('input', value)
      this.$emit('change', { ...this.passedData, value, hasFilledEverything: true })
    }
  }
})
</script>