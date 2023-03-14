<template>
  <div class="slider-input" :class="{ '--preview': preview }">
    <div class="questions-item">
      <div class="questions-item__text">
        <h4 v-if="name">
          {{ name }}
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
              :color="!formData.isCheckboxChecked && formData.isClicked ? 'primary' : 'grey'"
              :thumb-size="!formData.isCheckboxChecked && formData.isClicked ? 12 : 0"
              :thumb-color="
                !formData.isCheckboxChecked && formData.isClicked ? 'primary' : 'transparent'
              "
              :track-color="!formData.isCheckboxChecked && formData.isClicked ? '' : 'grey'"
              ticks="always"
              ticks-size="3"
              :disabled="formData.isCheckboxChecked"
              :readonly="preview || readOnly || formData.isSubmitting"
              :min="sliderMin"
              :max="sliderMax"
              :tick-labels="tickLabels"
              :step="sliderStep"
              @change="onSliderChange"
            />

            <span class="slider-text --end">
              {{ config.maxValDescription }}
            </span>
          </div>

          <div class="slider__checkbox">
            <checkbox-input
              v-if="config.withCheckbox && checkbox.metadata.length"
              :name="checkbox.name"
              :config="checkbox.metadata[0].value"
              :required="checkbox.metadata[0].required"
              :read-only="readOnly || preview || checkbox.metadata[0].readOnly"
              @change="onCheckboxChange"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import CheckboxInput from './CheckboxInput.vue'
export default Vue.extend({
  components: {
    CheckboxInput
  },
  props: {
    name: {
      type: String,
      default: 'Name'
    },
    value: {
      type: [Number, String],
      default: 0
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
      maxValue: 20,
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
        name: '',
        type: '',
        group: '',
        metadata: []
      }
    }
  },
  computed: {
    sliderMin(): number {
      let sliderMin = 0
      if (
        !Number.isNaN(Number(this.config.sliderMin)) &&
        this.config.sliderMin > this.minValue &&
        this.config.sliderMin <= this.maxValue
      ) {
        sliderMin = this.config.sliderMin
      }
      return sliderMin
    },
    sliderMax(): number {
      let sliderMax = 1
      if (
        !Number.isNaN(Number(this.config.sliderMax)) &&
        this.config.sliderMax > this.minValue + 1 &&
        this.config.sliderMax <= this.maxValue + 1
      ) {
        sliderMax = this.config.sliderMax
      }
      return sliderMax
    },
    sliderStep(): number {
      let sliderStep = 1
      if (
        !Number.isNaN(Number(this.config.sliderStep)) &&
        this.config.sliderStep > this.minStepValue
      ) {
        sliderStep = this.config.sliderStep
      }
      return sliderStep
    },
    tickLabels(): number[] {
      let max: number = this.sliderMax || 0
      max = max > this.sliderMin ? max : this.sliderMin
      max = max + 1
      return Array.from(Array(max).keys())
    }
  },
  watch: {
    value(val) {
      this.formData.value = val
    },
    config: {
      deep: true,
      handler() {
        this.setCheckboxData()
      }
    }
  },
  created() {
    this.setCheckboxData()
  },
  methods: {
    setCheckboxData() {
      if (this.config.withCheckbox && this.items.length) {
        const checkbox =
          this.items.find(
            (item: any) => item.metadata[0].codename === this.config.checkboxCodename
          ) || {}
        this.checkbox = {
          ...this.checkbox,
          // @ts-ignore
          ...checkbox
        }
      }
    },
    onCheckboxChange(val: any) {
      if (val) {
        this.formData.tempValue = this.formData.value
        this.formData.value = 0
      } else {
        this.formData.value = this.formData.tempValue
      }
    },
    onSliderChange(val: number) {
      this.formData.isClicked = true
      this.$emit('input', val)
    }
  }
})
</script>
<style lang="scss" scoped>
.slider-input {
  &.--preview {
    zoom: 0.8;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 10px;
  }
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
        max-width: 20%;
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
</style>