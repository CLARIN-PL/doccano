<template>
  <v-container class="widget">
    <v-row v-if="question" class="widget__question">
      {{ question }}
    </v-row>
    <v-row class="widget__answer"  justify="center" align="center">
      <v-col v-if="categoryLabel" :cols="(withCheckbox)?3:4" class="widget__category">
        {{ categoryLabel }}
      </v-col>
      <v-col
        :cols="colsTextfield"
        class="widget__textfield"
        @click="textfieldClickHandler"
      >
        <v-text-field
          :disabled="!enableTextfield"
          small
          dense
          readonly
          :value="stringifiedAnswers === nullFlag ? '' : stringifiedAnswers"
          :rules="readOnly ? [] : rulesTextfield"
          hide-details="auto"
        />
      </v-col>
      <v-col v-if="withCheckbox" cols="3" class="widget__checkbox">
        <v-checkbox
          v-model="checkboxValue"
          :readonly="readOnly"
          :label="checkboxLabel"
        />
      </v-col>
    </v-row>

    <v-dialog
      v-model="showDialog"
      scrollable
      width="600"
      class="widget-dialog"
    >
      <v-card>
        <v-card-title class="widget-dialog__title">
          {{ question }}
        </v-card-title>
        <v-card-text  class="widget-dialog__text">
          <p class="widget-dialog__hint">{{ $t('annotation.affectiveTextlabelHint') }}</p>
          <p class="widget-dialog__warning">{{ dialogErrorMessage }}</p>
          <seq2seq-box
            :text="text"
            :annotations="answers"
            @delete:annotation="removeAnswer"
            @update:annotation="updateAnswer"
            @create:annotation="addAnswer"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Seq2seqBox from '~/components/tasks/seq2seq/Seq2seqBox'

export default {
  components: {
    Seq2seqBox
  },

  props: {
    text: {
      type: String,
      default: ""
    },
    question: {
      type: String,
      default: ""
    },
    categoryLabel: {
      type: String,
      default: ""
    },
    answers: {
      type: Array,
      default: () => []
    },
    rulesTextfield: {
      type: Array,
      default: () => []
    },
    textValidation: {
      type: Function,
      default: () => ""
    },
    withCheckbox: {
      type: Boolean,
      default: false
    },
    checkboxLabel: {
      type: String,
      default: ""
    },
    hideTextfieldOnChecked: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      checkboxValue: false,
      enableTextfield: true,
      showDialog: false,
      dialogErrorMessage: "",
      stringifiedAnswers: "",
      nullFlag: "-1"
    }
  },

  computed: {
    colsTextfield() {
      if (this.withCheckbox && this.categoryLabel) {
        return 6
      }
      if (!this.withCheckbox && this.categoryLabel) {
        return 8
      }
      if (this.withCheckbox && !this.categoryLabel) {
        return 9
      }
      return 12
    }
  },

  watch: {
    answers() {
      const res = this.answers.map((value) => value.text)
      this.stringifiedAnswers = res.join(", ")

      this.checkboxValue = this.hideTextfieldOnChecked && this.stringifiedAnswers === this.nullFlag
    },
    checkboxValue(isChecked) {
      if (this.hideTextfieldOnChecked && isChecked) {
        this.$emit('markCheckbox', this.categoryLabel)
        this.enableTextfield = false
      }
      if (this.hideTextfieldOnChecked && !isChecked) {
        this.$emit('unmarkCheckbox', this.categoryLabel)
        this.enableTextfield = true
      }
    }
  },

  methods: {
    removeAnswer(annotationId) {
      this.dialogErrorMessage = ""
      this.$emit('remove', annotationId)
    },
    updateAnswer(annotationId, text) {
      if (text.length > 0) {
        const errorMessage = this.textValidation(text, this.answers)
        if (errorMessage.length === 0) {
          this.dialogErrorMessage = ""
          this.$emit('update', annotationId, text)
        } else {
          this.dialogErrorMessage = errorMessage
        }
      } else {
        this.removeAnswer(annotationId)
      }
    },
    addAnswer(text) {
      const errorMessage = this.textValidation(text, this.answers)
      if (errorMessage.length === 0) {
        this.dialogErrorMessage = ""
        this.$emit('add', text)
      } else {
        this.dialogErrorMessage = errorMessage
      }
    },
    textfieldClickHandler() {
      if (this.enableTextfield) {
        this.showDialog = !this.readOnly
      } else {
        this.showDialog = false
      }
    }
  }
}
</script>

<style lang="scss">
  .widget {
    word-wrap: normal;
    word-break: break-word;
  
    &__question, &__category {
      font-size: .8rem;
      line-height: 0.95;
    }

    &__category {
      padding: 0 !important;
    }
  
    &__answer {
      font-size: .6rem;
      line-height: 0.75;
      margin-bottom: 10px;
    }

    &__checkbox {
      padding: 0 0 0 10px !important;

      label.v-label {
        font-size: 0.8rem;
        line-height: 0.95;
      }
    }
  }
  
  .widget-dialog {
    &__title {
      font-size: .8rem;
      line-height: 0.95;
      word-break: break-word !important;
    }
  
    &__text {
      font-size: .7rem;
      line-height: 0.85;
    }

    &__warning {
      color: red;
    }
  }
</style>
