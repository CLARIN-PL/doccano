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
      v-model="inputDynamicSelect"
      :options="selectedOption.dynamicSelectInput.options"
      :show-add-button="selectedOption.dynamicSelectInput.showAddButton"
      @change="onDynamicSelectInputChange"
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
      return String(this.value).includes('_single-value_')
    },
    hasMultipleValues() {
      return String(this.value).includes('_multiple-values_')
    },
    selectedOption() {
      const base: any = this
      const key = base.hasMultipleValues ? '_multiple-values_' : '_single-value_'
      const value = base.value.includes(key) ? base.value.split(key)[0] : base.value
      const option = base.options.find((option: any) => option.value === value) || {}
      return option
    }
  },
  watch: {
    input(val) {
      const base: any = this
      base.inputText = ''
      const keys = ['_multiple-values_', '_single-value_']
      const option = base.options.find((option: any) => option.value === val) || {}
      const hasAdditionalValue = keys.some((key) => String(base.input).includes(key))
      let hasFilledEverything = true
      if (option.showTextbox) {
        hasFilledEverything = base.inputText.length > 0
      } else if (option.showDynamicSelectInput) {
        hasFilledEverything = base.inputDynamicSelect.filter((v: any) => !!v).length > 0
      }
      if (!hasAdditionalValue) {
        base.$emit('input', val)
        base.$emit('change', { ...base.passedData, value: val, hasFilledEverything })
      }
    },
    value() {
      const base: any = this
      const key = base.hasMultipleValues ? '_multiple-values_' : '_single-value_'
      const input = base.value.includes(key) ? base.value.split(key)[0] : base.value
      const adtInput = base.value.includes(key) ? base.value.split(key)[1] : ''

      base.input = input
      if (base.hasMultipleValues) {
        base.inputDynamicSelect = adtInput ? JSON.parse(adtInput) : []
      } else {
        base.inputText = adtInput
      }
    }
  },
  methods: {
    onDynamicSelectInputChange({ hasFilledEverything }: any) {
      const base: any = this
      const filteredVal = base.inputDynamicSelect
        ? base.inputDynamicSelect.filter((v: any) => !!v)
        : []
      const value = filteredVal.length
        ? `${base.input}_multiple-values_${JSON.stringify(filteredVal)}`
        : base.input
      base.$emit('input', value)
      base.$emit('change', { ...base.passedData, value, hasFilledEverything })
    },
    onTextInputSubmit(val: String) {
      const base: any = this
      base.inputText = val
      const value = base.inputText ? `${base.input}_single-value_${base.inputText}` : base.input
      base.$emit('input', value)
      base.$emit('change', { ...base.passedData, value, hasFilledEverything: true })
    }
  }
})
</script>