<template>
  <div class="v-data-footer">
    <span v-if="disabled.jump">
      <span v-if="isArticleProject">
        {{ $t('annotation_toolbar.buttons.buttonPagination.textDescription', 
          { value, total }) }}
      </span>
      <span v-else>
        {{ $t('annotation_toolbar.buttons.buttonPagination.textDescription', 
          { value, total }) }},
        {{ $t('annotation_toolbar.buttons.buttonPagination.articleDescription', 
          { articleIndex, articleTotal }) }}
      </span>
    </span>
    <div v-else>
      <v-edit-dialog large persistent @save="changePageNumber">
        <span v-if="isArticleProject">
          {{ $t('annotation_toolbar.buttons.buttonPagination.textDescription', 
            { value, total }) }}
        </span>
        <span v-else>
          {{ $t('annotation_toolbar.buttons.buttonPagination.textDescription', 
            { value, total }) }},
          {{ $t('annotation_toolbar.buttons.buttonPagination.articleDescription', 
            { articleIndex, articleTotal }) }}
        </span>
        <template #input>
          <div class="mt-4 title">Move Page</div>
          <v-text-field
            v-model="editedPage"
            :rules="rules"
            :label="$t('generic.edit')"
            single-line
            counter
            autofocus
          />
        </template>
      </v-edit-dialog>
    </div>
    <div 
      class="button-wrapper"
      :title="isFirstPage ? '' : tooltip.first"
    >
    <v-btn
      v-shortkey.once="['shift', 'arrowleft']"
      :disabled="isFirstPage || disabled.first"
      :title="tooltip.first"
      text
      fab
      small
      @shortkey="firstPage"
      @click="firstPage"
    >
      <v-icon>{{ mdiPageFirst }}</v-icon>
    </v-btn>
    </div>
    <div 
      class="button-wrapper"
      :title="isFirstPage ? '' : tooltip.prev"
    >
    <v-btn
      v-shortkey.once="['arrowleft']"
      :disabled="isFirstPage || disabled.prev"
      :title="tooltip.prev"
      text
      fab
      small
      @shortkey="prevPage"
      @click="prevPage"
    >
      <v-icon>{{ mdiChevronLeft }}</v-icon>
    </v-btn>
    </div>
    <div 
      class="button-wrapper"
      :title="isLastPage ? '' : tooltip.next"
    >
    <v-btn
      v-shortkey.once="['arrowright']"
      :disabled="isLastPage || disabled.next"
      :title="tooltip.next"
      text
      fab
      small
      @shortkey="nextPage"
      @click="nextPage"
    >
      <v-icon>{{ mdiChevronRight }}</v-icon>
    </v-btn>
    </div>
    <div 
      class="button-wrapper"
      :title="isLastPage ? '' : tooltip.last"
    >
      <v-btn
        v-shortkey.once="['shift', 'arrowright']"
        :disabled="isLastPage || disabled.last "
        text
        fab
        small
        @shortkey="lastPage"
        @click="lastPage"
      >
        <v-icon>{{ mdiPageLast }}</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mdiPageFirst, mdiPageLast, mdiChevronLeft, mdiChevronRight } from '@mdi/js'

export default Vue.extend({
  props: {
    value: {
      type: Number,
      default: 1,
      required: true
    },
    total: {
      type: Number,
      default: 1,
      required: true
    },
    disabled: {
      type: Object,
      default: () => {
        return {
          first: false,
          prev: false,
          next: false,
          last: false,
          jump: false
        }
      }
    },
    tooltip: {
      type: Object,
      default: () => {
        return {
          first: '',
          prev: '',
          next: '',
          last: '',
        }
      }
    },
    isArticleProject: {
      type: Boolean,
      default: false,
      required: false
    },
    articleIndex: {
      type: Number,
      default: 1,
      required: false
    },
    articleTotal: {
      type: Number,
      default: 1,
      required: false
    }
  },

  data() {
    return {
      editedPage: '1',
      rules: [
        (v: string) =>
          (v && parseInt(v, 10) > 0 && parseInt(v, 10) <= this.total) || 'Invalid page number!'
      ],
      mdiPageFirst,
      mdiPageLast,
      mdiChevronLeft,
      mdiChevronRight
    }
  },

  computed: {
    isFirstPage(): boolean {
      return this.value === 1
    },
    isLastPage(): boolean {
      return this.value === this.total || this.total === 0
    }
  },

  methods: {
    changePageNumber() {
      if (!this.editedPage) {
        return
      }
      const page = parseInt(this.editedPage, 10)
      if (page < 0 || page > this.total) {
        return
      }
      this.$emit('click:jump', {name: 'jump', destination: page})
    },
    prevPage() {
      if (this.value === 1) {
        return
      }
      this.$emit('click:prev', {name: 'prev'})
    },
    nextPage() {
      if (this.value === this.total) {
        return
      }
      this.$emit('click:next', {name: 'next'})
    },
    firstPage() {
      this.$emit('click:first', {name: 'first'})
    },
    lastPage() {
      this.$emit('click:last', {name: 'last'})
    }
  }
})
</script>
<style lang="scss" scoped>
.button-wrapper {
  position: relative;
  height: 40px;
  width: 40px;
}
</style>