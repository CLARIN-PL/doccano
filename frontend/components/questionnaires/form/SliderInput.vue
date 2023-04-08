<template>
  <div class="slider-input">
    <span>
      {{ question }}
    </span>
    <span v-if="required && question" class="red--text">*</span>
    <v-row align="start" justify="center">
      <v-col cols="12" align="start">
        <v-slider
          v-model="sliderValue"
          class="slider"
          :color="isClicked ? 'primary' : 'grey'"
          :thumb-size="isClicked ? 12 : 0"
          :thumb-color="isClicked ? 'primary' : 'transparent'"
          :track-color="isClicked ? '' : 'grey'"
          :ticks="config.showTickLabels"
          :min="config.min"
          :max="config.max"
          :readonly="readOnly || isSubmitting"
          :disabled="disabled"
          :tick-labels="config.showTickLabels ? tickLabels : []"
          step="1"
          @change="onSliderValueChange"
        >
          <template v-if="!config.showTickLabels" #prepend>{{ config.minLabel }}</template>
          <template v-if="!config.showTickLabels" #append>{{ config.maxLabel }}</template>
        </v-slider>
      </v-col>
      <v-spacer v-if="config.showTickLabels" />
    </v-row>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: {
    config: {
      type: Object,
      default() {
        return {
          min: 0,
          max: 0,
          minLabel: '',
          maxLabel: '',
          showTickLabels: true
        }
      }
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    question: {
      type: String,
      default: ''
    },
    value: {
      type: [String, Number],
      default: -1
    },
    passedData: {
      type: Object,
      default: () => {}
    },
    required: {
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
    }
  },
  data() {
    return {
      sliderValue: this.value,
      isLoaded: false
    }
  },
  computed: {
    tickLabels() {
      const start = this.config.min
      const end = this.config.max
      return Array(end - start + 1)
        .fill(undefined)
        .map((_, idx) => (start + idx).toString())
    }
  },
  created() {
    // @ts-ignore
    this.parseValue()
  },
  mounted() {
    // @ts-ignore
    this.isLoaded = true
  },
  methods: {
    parseValue() {
      const base: any = this
      const pattern = /^[0-9]+$/
      const isNumber = pattern.test(base.value)
      base.sliderValue = isNumber ? base.value : base.config.min
    },
    onSliderValueChange(val: any) {
      const base: any = this
      if (base.isLoaded) {
        base.$emit('input', val)
        base.$emit('change', { ...base.passedData })
      }
    }
  }
})
</script>
<style lang="scss">
.slider-input {
  .v-slider__tick-label {
    font-size: 0.875rem;
  }
}
</style>
