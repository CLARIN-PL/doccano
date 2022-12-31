<template>
  <div ref="stickyContainer" class="sticky-container">
    <v-card ref="stickyItem" class="sticky">
      <v-card-text class="text-caption">
        <ul class="hide-list-style">
          <li
            v-for="(segmentScaleValue, segScalIdx) in questionnaireScalesValues"
            :key="`segmentScaleValue-${segScalIdx}`"
          >
            {{ segmentScaleValue.value }} - {{ segmentScaleValue.text }}
          </li>
        </ul>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'

export default Vue.extend({
  name: 'StickyLegend',
  props: {
    questionnaireScalesValues: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isLoaded: false
    }
  },
  mounted() {
    this.isLoaded = true
    window.addEventListener('scroll', this.onScrollListener)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.onScrollListener)
  },
  methods: {
    onScrollListener: _.debounce(function () {
      if (this.isLoaded) {
        const offsetY = window.pageYOffset
        const stickyContainer = this.$refs.stickyContainer
        if (stickyContainer) {
          const containerHeight = stickyContainer.offsetHeight
          const stickyItem =this.$refs.stickyItem
          const itemHeight = stickyItem.$el.offsetHeight
          const limitY = containerHeight - itemHeight
          const posY = (offsetY > limitY) ? limitY : offsetY
          this.$refs.stickyItem.$el.style.top = posY + "px"
        }
      }
    }, 15)
  }
})
</script>

<style lang="scss">
.sticky-container {
  position: relative;
  height: 100%;
}

.sticky {
  position: absolute;
}
</style>
