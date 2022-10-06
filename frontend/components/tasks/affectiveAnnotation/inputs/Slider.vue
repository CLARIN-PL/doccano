<template>
  <v-container class="widget">
    <v-row class="widget-row" justify="center" align="center">
      <v-col :cols="(withCheckbox) ? 3 : 4" class="widget-row__category">
        {{ categoryLabel }}
      </v-col>
      <v-col :cols="(withCheckbox) ? 6 : 8" class="widget-row__slider">
        <v-slider
          :value="value"
          :disabled="!enableSlider"
          min="0"
          max="10"
          step="1"
          ticks="always"
          tick-size="4"
          dense
          :color="(enableSlider) ? color : 'grey'"
          track-color="grey"
          :hint="hint"
          persistent-hint
          :thumb-size="sliderThumbSize"
          :thumb-color="sliderThumbColor"
          @click="markClicked"
          @change="valueChangeHandler"
        />
      </v-col>
      <v-col v-if="withCheckbox" cols="3" class="widget-row__checkbox">
        <v-checkbox
          :label="checkboxLabel"
          @change="checkboxChangeHandler"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiCheck } from '@mdi/js'

export default {
  props: {
    categoryLabel: {
      type: String,
      default: ""
    },
    color: {
      type: String,
      default: "blue"
    },
    hint: {
      type: String,
      default: ""
    },
    value: {
      type: Number,
      default: 0
    },
    mustClick: {
      type: Boolean,
      default: false
    },
    withCheckbox: {
      type: Boolean,
      default: false
    },
    checkboxLabel: {
      type: String,
      default: ""
    },
    hideSliderOnChecked: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      mdiCheck,
      isClicked: false,
      enableSlider: true
    }
  },

  computed: {
    sliderThumbSize() {
      if (this.mustClick && this.value === 0) {
        return (this.isClicked)? 12 : 0
      }
      return 12
    },
    sliderThumbColor() {
      if (this.mustClick) {
        if (!this.isClicked) {
          return "transparent"
        }
        if (this.isClicked && this.enableSlider) {
          return this.color
        }
        if (this.isClicked && !this.enableSlider) {
          return "grey"
        }
      }
      return this.color
    }
  },

  methods: {
    markClicked() {
      this.isClicked = true
    },
    valueChangeHandler(newValue) {
      this.markClicked()
      this.$emit('change', newValue, this.categoryLabel)
    },
    checkboxChangeHandler(checkboxValue) {
      if (this.hideSliderOnChecked && checkboxValue) {
        this.$emit('markCheckbox', this.categoryLabel)
        this.enableSlider = false
      }
      if (this.hideSliderOnChecked && !checkboxValue) {
        this.$emit('unmarkCheckbox', this.categoryLabel)
        this.enableSlider = true
      }
    }
  }
}
</script>

<style lang="scss">
.widget-row {
  word-wrap: normal;
  word-break: break-word;

  &__category {
    font-size: 0.8rem;
    line-height: 0.95;
    padding: 0 !important;
  }

  &__slider, &__checkbox {
    font-size: 0.7rem;
    line-height: 0.85;
    padding: 0 !important;
  }

  &__checkbox {
    padding-left: 10px !important;

    label.v-label {
      font-size: 0.8rem;
      line-height: 0.95;
    }
  }
}
</style>
