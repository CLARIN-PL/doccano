<template>
  <v-bottom-navigation app absolute hide-on-scroll>
    <v-btn :disabled="isFirstPage" @click="updatePage(page - 1)">
      <span>Prev</span>
      <v-icon>{{ mdiChevronLeft }}</v-icon>
    </v-btn>

    <v-btn :disabled="isLastPage" @click="updatePage(page + 1)">
      <span>Next</span>
      <v-icon>{{ mdiChevronRight }}</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import Vue from 'vue'
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js'

export default Vue.extend({
  props: {
    total: {
      type: Number,
      default: 1,
      required: true
    },
    disablePrev: {
      type: Boolean,
      default: false
    },
    disableNext: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      mdiChevronLeft,
      mdiChevronRight
    }
  },

  computed: {
    page(): number {
      // @ts-ignore
      return parseInt(this.$route.query.page, 10)
    },
    isFirstPage(): boolean {
      return this.page === 1 || this.disablePrev
    },
    isLastPage(): boolean {
      return this.page === this.total || this.total === 0 || this.disableNext
    }
  },

  methods: {
    updatePage(page: number) {
      this.$router.push({ query: { page: page.toString() } })
    }
  }
})
</script>
