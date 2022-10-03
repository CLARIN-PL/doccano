<template>
  <v-container class="widget">
    <v-row class="widget-row" justify="center" align="center">
      <v-col cols="4" class="widget-row__category">{{ category }}</v-col>
      <v-col cols="8" class="widget-row__slider" @click="markClicked">
        <v-slider
          :value="value"
          min="0"
          max="10"
          step="1"
          ticks
          dense
          :color="color"
          track-color="grey"
          :hint="hint"
          persistent-hint
          @click="markClicked"
          @change="valueChangeHandler"
        >
          <template v-if="mustClick" #append>
            <v-icon :color="isMarkedClicked">
              {{ mdiCheck }}
            </v-icon>
          </template>
        </v-slider>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mdiCheck } from '@mdi/js'

export default {
  props: {
    category: {
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
    }
  },

  data() {
    return {
      mdiCheck,
      isClicked: false
    }
  },

  computed: {
    isMarkedClicked() {
      return (this.isClicked)? "lime accent-4" : "grey"
    }
  },

  methods: {
    markClicked() {
      this.isClicked = true
    },
    valueChangeHandler(newValue) {
      this.markClicked()
      this.$emit('change', newValue, this.category)
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
    padding-top: 2 !important;
    padding-bottom: 2 !important;
  }

  &__slider {
    font-size: 0.7rem;
    line-height: 0.85;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
}
</style>
