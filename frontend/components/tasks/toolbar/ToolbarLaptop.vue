<template>
  <v-toolbar class="toolbar-control" dense flat>
    <v-row no-gutters>
      <v-btn-toggle>
        <button-review 
          v-if="buttonOptions.review.visible" 
          :disabled="buttonOptions.review.disabled"
          :show-text="buttonOptions.review.hasText"
          :text="buttonOptions.review.text"
          :is-reviewd="isReviewd" 
          @click:review="$emit('click:review')" />

        <button-filter 
          v-if="buttonOptions.filter.visible" 
          :value="filterOption" 
          @click:filter="changeFilter" />

        <button-guideline 
          v-if="buttonOptions.guideline.visible" 
          @click:guideline="dialogGuideline = true" />
        <v-dialog v-model="dialogGuideline">
          <form-guideline :guideline-text="guidelineText" @click:close="dialogGuideline = false" />
        </v-dialog>

        <button-comment 
          v-if="buttonOptions.comment.visible" 
          @click:comment="dialogComment = true" />
        <v-dialog v-model="dialogComment">
          <form-comment :example-id="docId" @click:cancel="dialogComment = false" />
        </v-dialog>

        <button-auto-labeling 
          v-if="buttonOptions.autoLabeling.visible" 
          @click:auto="dialogAutoLabeling = true" />
        <v-dialog v-model="dialogAutoLabeling">
          <form-auto-labeling
            :is-enabled="enableAutoLabeling"
            :error-message="errorMessage"
            @click:cancel="dialogAutoLabeling = false"
            @input="updateAutoLabeling"
          />
        </v-dialog>

        <button-clear 
          v-if="buttonOptions.clear.visible" 
          @click:clear="dialogClear = true" />
        <v-dialog v-model="dialogClear">
          <form-clear-label
            @click:ok="
              $emit('click:clear-label')
              dialogClear = false
            "
            @click:cancel="dialogClear = false"
          />
        </v-dialog>
      </v-btn-toggle>
      <slot />
      <v-spacer />
      <button-pagination
        v-if="buttonOptions.pagination.visible" 
        :disabled="buttonOptions.pagination.disabled"
        :value="page"
        :total="total"
        :tooltip="buttonOptions.pagination.tooltip"
        :is-article-project="isArticleProject"
        :article-index="articleIndex"
        :article-total="articleTotal"
        @click:prev="updatePage"
        @click:next="updatePage"
        @click:first="updatePage"
        @click:last="updatePage"
        @click:jump="updatePage"
      />
    </v-row>
  </v-toolbar>
</template>

<script lang="ts">
import Vue from 'vue'
import ButtonAutoLabeling from './buttons/ButtonAutoLabeling.vue'
import ButtonClear from './buttons/ButtonClear.vue'
import ButtonComment from './buttons/ButtonComment.vue'
import ButtonFilter from './buttons/ButtonFilter.vue'
import ButtonGuideline from './buttons/ButtonGuideline.vue'
import ButtonPagination from './buttons/ButtonPagination.vue'
import ButtonReview from './buttons/ButtonReview.vue'
import FormAutoLabeling from './forms/FormAutoLabeling.vue'
import FormClearLabel from './forms/FormClearLabel.vue'
import FormComment from './forms/FormComment.vue'
import FormGuideline from './forms/FormGuideline.vue'

export default Vue.extend({
  components: {
    ButtonAutoLabeling,
    ButtonClear,
    ButtonComment,
    ButtonFilter,
    ButtonGuideline,
    ButtonPagination,
    ButtonReview,
    FormAutoLabeling,
    FormClearLabel,
    FormComment,
    FormGuideline
  },

  props: {
    docId: {
      type: Number,
      required: true
    },
    enableAutoLabeling: {
      type: Boolean,
      default: false,
      required: true
    },
    buttonOptions: {
      type: Object,
      default: () => {
        return {
          review: { visible: true },
          filter: { visible: true },
          guideline:  { visible: true },
          comment: { visible: true },
          autoLabeling: { visible: true },
          clear: { visible: true },
          pagination: { visible: true },
        }
      },
    },
    guidelineText: {
      type: String,
      default: '',
      required: true
    },
    isReviewd: {
      type: Boolean,
      default: false
    },
    total: {
      type: Number,
      default: 1
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
      dialogAutoLabeling: false,
      dialogClear: false,
      dialogComment: false,
      dialogGuideline: false,
      errorMessage: ''
    }
  },

  computed: {
    page(): number {
      // @ts-ignore
      return parseInt(this.$route.query.page, 10)
    },
    filterOption(): string {
      // @ts-ignore
      return this.$route.query.isChecked || ''
    }
  },

  methods: {
    // @ts-ignore
    updatePage({name, destination}) {
      // @ts-ignore
      const base = this as any
      const page : any = {
        prev: base.page - 1,
        next: base.page + 1,
        first: 1,
        last: base.total, 
        jump: destination
      }
      base.$router.push({
        query: {
          page: page[name].toString(),
          isChecked: base.filterOption,
          q: base.$route.query.q || ''
        }
      })
      setTimeout(()=> {
        if(base.buttonOptions.pagination.callback) {
          if(name === 'prev' && base.buttonOptions.pagination.callback.prev) {
            base.buttonOptions.pagination.callback.prev()
          }
          if(name === 'next' && base.buttonOptions.pagination.callback.next) {
            base.buttonOptions.pagination.callback.next()
          }
          if(name === 'first' && base.buttonOptions.pagination.callback.first) {
            base.buttonOptions.pagination.callback.first()
          }
          if(name === 'last' && base.buttonOptions.pagination.callback.last) {
            base.buttonOptions.pagination.callback.last()
          }
        }
      }, 300)
    },

    changeFilter(isChecked: string) {
      this.$router.push({
        query: {
          page: '1',
          isChecked,
          q: this.$route.query.q || ''
        }
      })
    },

    updateAutoLabeling(isEnable: boolean) {
      if (isEnable) {
        this.$emit('update:enable-auto-labeling', true)
      } else {
        this.$emit('update:enable-auto-labeling', false)
      }
    }
  }
})
</script>

<style scoped>
.toolbar-control >>> .v-toolbar__content {
  padding: 0px !important;
}

::v-deep .v-dialog {
  width: 800px;
}
</style>
