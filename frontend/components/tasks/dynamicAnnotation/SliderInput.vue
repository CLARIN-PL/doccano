<template>
  <div class="slider-input" :class="{ '--preview': preview, '--readonly': readOnly }">
    <div class="questions-item">
      <div class="questions-item__text">
        <h4 v-if="name">
          {{ capitalize(name) }}
          <span v-if="required" class="red--text">*</span>
        </h4>
        <div class="questions-item__slider">
          <div class="slider__slider">
            <span class="slider-text --start">
              {{ config.minValDescription }}
            </span>
            <v-slider
              v-model="formData.value"
              class="slider"
              :required="required"
              :rules="rules"
              :color="!formData.isCheckboxChecked && formData.isClicked ? 'primary' : 'grey'"
              :thumb-size="!formData.isCheckboxChecked && formData.isClicked ? 12 : 0"
              :thumb-color="
                !formData.isCheckboxChecked && formData.isClicked ? 'primary' : 'transparent'
              "
              :track-color="!formData.isCheckboxChecked && formData.isClicked ? '' : 'grey'"
              ticks="always"
              :disabled="disabled || !!formData.isCheckboxChecked"
              :readonly="!!formData.isCheckboxChecked || preview || readOnly"
              :min="sliderMin"
              :max="sliderMax"
              :tick-labels="tickLabels"
              :step="sliderStep"
              @input="onSliderInput"
              @change="onSliderChange"
            />

            <span class="slider-text --end">
              {{ config.maxValDescription }}
            </span>
          </div>
          <div class="slider__checkbox">
            <checkbox-input
              v-if="config.withCheckbox && checkbox.metadata.length"
              v-model="formData.isCheckboxChecked"
              :use-value="true"
              :name="checkbox.name"
              :item="checkbox"
              :config="checkbox.metadata[0].value"
              :required="false"
              :read-only="readOnly || preview || checkbox.metadata[0].readOnly"
              @input="onCheckboxInput"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import CheckboxInput from './CheckboxInput.vue'
import { capitalize } from '~/utils/stringHelpers'
import { roundWithMaxPrecision } from '~/utils/numberHelpers'

export default Vue.extend({
  components: {
    CheckboxInput
  },
  props: {
    name: {
      type: String,
      default: 'Name'
    },
    formDataKey: {
      type: String,
      default: ''
    },
    item: {
      type: Object,
      default: () => {
        return {
          isSubmitting: false,
          isClicked: false
        }
      }
    },
    config: {
      type: Object,
      default: () => {
        return {
          sliderMin: 0,
          sliderMax: 10,
          sliderStep: 1,
          minValDescription: '',
          maxValDescription: '',
          withCheckbox: false,
          checkboxCodename: ''
        }
      }
    },
    items: {
      type: Array,
      default: () => []
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    transparent: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    preview: {
      type: Boolean,
      default: false
    },
    playground: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      minValue: 0,
      minMaxValue: 1,
      maxMargin: 20,
      minStepValue: 0.1,
      formData: {
        value: 0,
        tempValue: 0,
        isCheckboxChecked: false,
        isDisabled: false,
        isClicked: false,
        isSubmitting: false
      },
      checkbox: {
        key: 0,
        tempValue: false,
        name: '',
        type: '',
        group: '',
        metadata: []
      }
    }
  },
  computed: {
    ...mapGetters('projects', ['allDimensions']),
    rules() {
      const base = this
      const rules = []
      if (base.required && !base.readOnly) {
        rules.push(() => base.formData.isClicked || this.$t('rules.required'))
      }
      return rules
    },
    sliderMin(): number {
      let sliderMin = 0
      if (
        !Number.isNaN(Number(this.config.sliderMin)) &&
        this.config.sliderMin >= this.minValue &&
        this.config.sliderMin <= this.config.sliderMax &&
        Number.isInteger(Number(this.config.sliderMin))
      ) {
        sliderMin = this.config.sliderMin
      }
      return sliderMin
    },
    sliderMax(): number {
      let sliderMax = 1
      if (
        !Number.isNaN(Number(this.config.sliderMax)) &&
        this.config.sliderMax > this.minMaxValue &&
        this.config.sliderMax / this.sliderStep <= this.maxMargin &&
        this.config.sliderMax >= this.config.sliderMin &&
        Number.isInteger(Number(this.config.sliderMax))
      ) {
        sliderMax = this.config.sliderMax
      }
      return sliderMax
    },
    sliderStep(): number {
      let sliderStep = 1
      if (
        !Number.isNaN(Number(this.config.sliderStep)) &&
        this.config.sliderStep >= this.minStepValue &&
        this.config.sliderStep <= this.config.sliderMax - this.config.sliderMin
      ) {
        sliderStep = this.config.sliderStep
      }
      return sliderStep
    },
    tickLabels(): number[] {
      let max: number = this.sliderMax || 0
      max = max > this.sliderMin ? max : this.sliderMin
      max = max + 1
      max = Math.round(max / this.sliderStep)
      const labels = Array.from(Array(max).keys()).map((key) => {
        const res = key * (this.sliderStep * 10)
        return roundWithMaxPrecision(res, 1) / 10
      })
      if (!labels.includes(this.sliderMin)) {
        labels.unshift(this.sliderMin)
      }
      if (!labels.includes(this.sliderMax)) {
        labels.push(this.sliderMax)
      }
      return labels
    }
  },
  watch: {
    formData: {
      deep: true,
      handler(val) {
        this.checkbox.tempValue = val.isCheckboxChecked
        this.checkbox.key += 1
      }
    },
    item(val) {
      if (!val.isSubmitting && !this.formData.isSubmitting) {
        this.setFormData()
      }
    },
    config: {
      deep: true,
      handler() {
        if (this.playground) {
          this.formData.value = 0
        }
        this.setCheckboxData()
      }
    }
  },
  created() {
    this.setFormData()
    this.setCheckboxData()
  },
  methods: {
    capitalize,
    setFormData() {
      this.formData = {
        ...this.formData,
        ...this.item
      }
      this.$nextTick(() => {
        if (this.formData.value === -1) {
          this.formData.isClicked = true
        }
        this.checkbox.tempValue = this.formData.isCheckboxChecked
      })
    },
    setCheckboxData() {
      if (this.config.withCheckbox && this.allDimensions.length) {
        const checkbox: any =
          this.allDimensions.find(
            (item: any) => item.metadata[0].codename === this.config.checkboxCodename
          ) || {}
        if (checkbox.metadata && checkbox.metadata[0]) {
          checkbox.metadata[0].isMultipleAnswers = false
        }
        this.checkbox = {
          ...this.checkbox,
          // @ts-ignore
          ...checkbox
        }
      }
    },
    onCheckboxInput() {
      const val = this.formData.isCheckboxChecked
      if (!this.readOnly && !this.formData.isSubmitting) {
        if (val) {
          this.formData.tempValue = this.formData.value
          this.formData.value = -1
          this.formData.isSubmitting = true
          this.formData.isClicked = true
          this.checkbox.tempValue = true
          this.$emit('update:scale', { formDataKey: this.formDataKey, value: -1 })
        } else {
          this.formData.value = this.formData.tempValue
          this.formData.isSubmitting = true
          this.formData.isClicked = true
          this.$emit('update:scale', { formDataKey: this.formDataKey, value: this.formData.value })
        }
      }
    },
    onSliderInput() {
      this.formData.isClicked = true
    },
    onSliderChange() {
      if (!this.formData.isSubmitting) {
        this.formData.isSubmitting = true
        this.$emit('update:scale', { formDataKey: this.formDataKey, value: this.formData.value })
      }
    }
  }
})
</script>
<style lang="scss" >
.slider-input {
  overflow: hidden;

  &.--preview {
    zoom: 0.8;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 10px;
  }

  &.--readonly {
    opacity: 0.85;
  }

  .questions-item {
    &__slider {
      display: flex;
      flex-wrap: wrap;

      > * {
        flex-basis: 100%;
      }

      .slider__slider {
        display: flex;
        padding-top: 10px;

        > .slider-text {
          max-width: 15%;
          font-size: 0.75rem;
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: break-word;
        }
      }
    }
  }

  .slider-text {
    color: gray;
    margin-top: 5px;

    &.--start {
      margin-right: 10px;
    }

    &.--end {
      margin-left: 10px;
    }
  }

  .v-slider__tick .v-slider__tick-label {
    font-size: 0.75rem !important;
  }
}
</style>