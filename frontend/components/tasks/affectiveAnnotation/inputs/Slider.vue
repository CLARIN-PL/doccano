<template>
  <v-container class="widget">
    <v-row class="widget-row" justify="center" align="center">
      <v-col :cols="(withCheckbox) ? 3 : 4" class="widget-row__category">
        {{ categoryLabel }}
        <span v-if="required" class="red--text"> * </span>
        <span class="red--text" :class="(error) ? 'd-block' : 'd-none'">{{ $t('annotation.warningRequired') }}</span>
      </v-col>
      <v-col :cols="(withCheckbox) ? 6 : 8" class="widget-row__slider">
        <v-slider
          :value="value"
          :error="error"
          :readonly="readOnly"
          :disabled="!enableSlider"
          :min="sliderMinVal"
          :max="sliderMaxVal"
          step='1'
          ticks='always'
          tick-size='3'
          dense
          :color="(enableSlider) ? color : 'grey'"
          track-color='grey'
          :hint="hint"
          persistent-hint
          thumb-label="always"
          thumb-size="18"
          :thumb-color="sliderThumbColor"
          @click="markClicked"
          @change="valueChangeHandler"
        >
          <template #prepend>{{ sliderMinVal }}</template>
          <template #append>{{ sliderMaxVal }}</template>
        </v-slider>
      </v-col>
      <v-col v-if="withCheckbox" cols="3" class="widget-row__checkbox">
        <v-checkbox
          v-model="checkboxValue"
          :error="error"
          :readonly="readOnly"
          :label="checkboxLabel"
          @click="markClicked"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiCheck } from '@mdi/js'

export default {
  props: {
    required: {
      type: Boolean,
      default: true
    },
    error: {
      type: Boolean,
      default: true
    },
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
      default: -99
    },
    mustClick: {
      type: Boolean,
      default: false
    },
    readOnly: {
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
      sliderMinVal: 0,
      sliderMaxVal: 10,
      sliderThumbSize: 12,
      isClicked: false,
      enableSlider: true,
      checkboxValue: false,
      nullFlag: -1,
      unclickedFlag: -99
    }
  },

  computed: {
    sliderThumbColor() {
      if (this.mustClick && this.value < 0) {
        return "transparent"
      }
      return this.color
    }
  },

  watch: {
    value() {
      this.checkboxValue = this.hideSliderOnChecked && this.value === this.nullFlag
      if (this.value === this.unclickedFlag) {
        this.isClicked = false
      }
    },
    checkboxValue(isChecked) {
      if (this.hideSliderOnChecked && isChecked) {
        if (this.isClicked) {
          this.$emit('markCheckbox', this.categoryLabel)
        }
        this.enableSlider = false
      }
      if (this.hideSliderOnChecked && !isChecked) {
        if (this.isClicked) {
          this.$emit('unmarkCheckbox', this.categoryLabel)
        }
        this.enableSlider = true
      }
    }
  },

  methods: {
    markClicked() {
      this.isClicked = true
    },
    valueChangeHandler(newValue) {
      this.$emit('change', newValue, this.categoryLabel)
    }
  }
}
</script>

<style lang="scss">
.widget-row {
  word-wrap: normal;
  word-break: normal;
  padding-bottom: 30px;

  &__category {
    font-size: 0.8rem;
    line-height: 0.95;
    padding: 0 !important;
    padding-right: 5px !important;
  }

  &__slider {
    font-size: 0.7rem;
    line-height: 0.85;
    padding: 0 !important;

    .v-input {
      &__slot {
        margin-bottom: 0 !important;
      }

      &__prepend-outer, &__append-outer {
        font-size: 0.65rem;
        line-height: 0.8;
        margin: 0 !important;
        padding: 0 !important;
        white-space: nowrap;
        overflow-x: visible;
      }
    }

    .v-input.error--text .v-messages {
      color: red !important;
    }
  }

  &__checkbox {
    font-size: 0.7rem;
    line-height: 0.85;
    padding: 0 !important;
    padding-left: 10px !important;

    label.v-label {
      font-size: 0.8rem;
      line-height: 0.95;
    }
  }
}
</style>
