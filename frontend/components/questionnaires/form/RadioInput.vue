<template>
  <div class="radio-input">
    <p>
      <span>
        {{ header }}
      </span>
      <span>
        {{ question }}
      </span>
      <span v-if="required && question" class="red--text">*</span>
    </p>
    <v-radio-group v-model="input">
      <v-radio
        v-for="(option, idx) in options"
        :key="idx"
        :disabled="readOnly || isSubmitting"
        :value="option.value"
      >
        <template slot="label">
          <span class="radio-input__label">
            {{ option.text }}
          </span>
          <div class="radio-input__slot">
            <text-input
              v-if="
                selectedOption.value && selectedOption.value == option.value && option.showTextbox
              "
              v-model="inputText"
              :is-clicked="isClicked"
              :rules="selectedOption.rules"
              :is-submitting="isSubmitting"
              :config="option.config"
              :full-question="option.question || option.text"
              :required="required"
              @submit="onTextInputSubmit"
            />

            <slider-input
              v-if="
                selectedOption.value && selectedOption.value == option.value && option.showSlider
              "
              v-model="inputSlider"
              :config="option.config"
              :is-clicked="isClicked"
              :is-submitting="isSubmitting"
              :full-question="option.question || option.text"
              :required="required"
              @change="onSliderInputChange"
            />

            <dynamic-select-input
              v-if="
                selectedOption.value &&
                selectedOption.value == option.value &&
                option.showDynamicSelectInput
              "
              v-model="inputDynamicSelect"
              :is-clicked="isClicked"
              :is-submitting="isSubmitting"
              :options="option.dynamicSelectInput.options"
              :show-add-button="option.dynamicSelectInput.showAddButton"
              @change="onDynamicSelectInputChange"
            />
          </div>
        </template>
      </v-radio>
    </v-radio-group>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import TextInput from '~/components/questionnaires/form/TextInput.vue'
import SliderInput from '~/components/questionnaires/form/SliderInput.vue'
import DynamicSelectInput from '~/components/questionnaires/form/DynamicSelectInput.vue'

export default Vue.extend({
  name: 'RadioInput',
  components: {
    TextInput,
    SliderInput,
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
    isClicked: {
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
      inputSlider: 0,
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
      const value = String(base.value).includes(key) ? base.value.split(key)[0] : base.value
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
      } else if (option.showSlider) {
        hasFilledEverything = true
      }
      if (!hasAdditionalValue) {
        const hasToFillAdditionalQuestions =
          option.showSlider || option.showTextbox || option.showDynamicSelectInput
        base.$emit('input', val)
        base.$emit('change', {
          ...base.passedData,
          isClicked: !hasToFillAdditionalQuestions,
          hasFilledEverything
        })
      }
    },
    value() {
      const base: any = this
      const key = base.hasMultipleValues ? '_multiple-values_' : '_single-value_'
      const input = String(base.value).includes(key) ? base.value.split(key)[0] : base.value
      const adtInput = String(base.value).includes(key) ? base.value.split(key)[1] : ''

      base.input = input
      if (base.hasMultipleValues) {
        base.inputDynamicSelect = adtInput ? JSON.parse(adtInput) : []
      } else if (base.hasSingleValue && base.selectedOption.showTextbox) {
        base.inputText = adtInput
      } else if (base.hasSingleValue && base.selectedOption.showSlider) {
        base.inputSlider = adtInput
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
      base.$emit('change', { ...base.passedData, hasFilledEverything })
    },
    onSliderInputChange() {
      const base: any = this
      const sliderValue = `${base.input}_single-value_${base.inputSlider}`
      base.$emit('input', sliderValue)
      base.$emit('change', { ...base.passedData, hasFilledEverything: true })
    },
    onTextInputSubmit(val: String) {
      const base: any = this
      base.inputText = val
      const value = base.inputText ? `${base.input}_single-value_${base.inputText}` : base.input
      base.$emit('input', value)
      base.$emit('change', { ...base.passedData, hasFilledEverything: true })
    }
  }
})
</script>
<style lang="scss">
.radio-input {
  .v-input {
    font-size: 0.875rem !important;

    label {
      font-size: inherit !important;
    }
  }

  .v-label {
    flex-flow: column;

    .radio-input__label {
      align-self: flex-start;
    }

    .radio-input__slot {
      width: 100%;
    }
  }
}
</style>