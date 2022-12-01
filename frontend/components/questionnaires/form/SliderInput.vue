<template>
  <div>
    {{ question }}
    <span v-if="required">*</span>
    <v-row align="center">
      <v-col>
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
          :disabled="readOnly"
          :tick-labels="config.showTickLabels ? tickLabels : []"
          step="1"
          @change="valueChangeHandler"
        >
          <template v-if="!config.showTickLabels" #prepend>{{ config.minLabel }}</template>
          <template v-if="!config.showTickLabels" #append>{{ config.maxLabel }}</template>
        </v-slider>
      </v-col>
      <v-spacer v-if="config.showTickLabels"/>
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
    question: {
      type: String,
      default: ''
    },
    value: {
      type: Number,
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
      return Array(end - start + 1).fill(undefined).map((_, idx) => (start + idx).toString())
    }
  },
  mounted() {
    // @ts-ignore
    this.isLoaded = true
  },
  methods: {
    valueChangeHandler(val: any) {
      const base: any = this
      if (base.isLoaded) {
        base.$emit('input', val)
        base.$emit('change', { ...base.passedData, value: val })
      }
    }
  }
})
</script>
<style lang="scss">
.v-input__prepend-outer {
  width: 150px !important;
}
.v-input__append-outer {
  width: 300px !important;
}
</style>
