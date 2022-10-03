<template>
  <v-container class="widget">
    <v-row class="widget-row" justify="center" align="center">
      <v-col cols="4" class="widget-row__category">{{ category }}</v-col>
      <v-col cols="8" class="widget-row__slider">
        <v-slider
          min="0"
          max="10"
          step="1"
          ticks
          dense
          :color="color"
          track-color="grey"
          :hint="hint"
          persistent-hint
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
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
