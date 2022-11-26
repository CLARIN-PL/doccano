<template>
  <div class="summary-input" :class="{'--has-error': showErrors, '--bordered': showBorders}">
    <textfield-with-seq-2-seq
      :read-only="readOnly"
      :text="text"
      :question="$t('annotation.affectiveSummary.tagsQuestion')"
      :answers="tags"
      :rules-textfield="rules"
      :text-validation="textValidation"
      @remove="removeTag"
      @update="updateTag"
      @add="addTag"
    />
    <textfield-with-seq-2-seq
      :read-only="readOnly"
      :text="text"
      :question="$t('annotation.affectiveSummary.impressionsQuestion')"
      :answers="impressions"
      :rules-textfield="rules"
      :text-validation="textValidation"
      @remove="removeImpression"
      @update="updateImpression"
      @add="addImpression"
    />
  </div>
</template>

<script>
import TextfieldWithSeq2Seq from '~/components/tasks/affectiveAnnotation/inputs/TextfieldWithSeq2Seq.vue'

export default {
  components: {
    TextfieldWithSeq2Seq
  },

  props: {
    text: {
      type: String,
      default: ""
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    showErrors: {
      type: Boolean,
      default: false
    },
    showBorders: {
      type: Boolean,
      default: false
    },
    tags: {
      type: Array,
      default: () => []
    },
    impressions: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      rules: [
        (value) => {
          if (value) {
            const words_array = value.split(",")
            const count_ok = words_array.length >= 2 && words_array.length <= 10
            return count_ok || this.$i18n.t('annotation.warningFrom2To10Words')
          }
          return this.$i18n.t('annotation.warningRequired')
        },
        (value) => {
          const pattern = /^[A-Za-z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż, -]+$/
          return pattern.test(value) || this.$i18n.t('annotation.warningInvalidChar')
        }
      ]
    }
  },

  methods: {
    textValidation(value, arrayToCheck) {
      let errorMessage = ""
      const pattern = /^[A-Za-z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż -]+$/
      if (!pattern.test(value)) {
        errorMessage = this.$i18n.t('annotation.warningInvalidChar')
      }
      if (arrayToCheck.length >= 10) {
        errorMessage = this.$i18n.t('annotation.warningMaxCount')
      }
      const isWordEntered = arrayToCheck.findIndex((item) => item.text === value)
      if (isWordEntered > -1) {
        errorMessage = this.$i18n.t('annotation.warningAlreadyWritten')
      }
      return errorMessage
    },
    removeTag(annotationId) {
      this.$emit('remove:tag', annotationId)
    },
    updateTag(annotationId, text) {
      if (text.length > 0) {
        this.$emit('update:tag', annotationId, text)
      } else {
        this.removeTag(annotationId)
      }
    },
    addTag(text) {
      this.$emit('add:tag', text)
    },
    removeImpression(annotationId) {
      this.$emit('remove:impression', annotationId)
    },
    updateImpression(annotationId, text) {
      if (text.length > 0) {
        this.$emit('update:impression', annotationId, text)
      } else {
        this.removeImpression(annotationId)
      }
    },
    addImpression(text) {
      this.$emit('add:impression', text)
    }
  }
}
</script>

<style lang="scss">
.summary-input {
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;

  &.--bordered {
    border: 2px solid #ddd;
    border-radius: 2px;  

    &.--has-error {
      border: 2px solid red;
    }
  }
}
</style>
