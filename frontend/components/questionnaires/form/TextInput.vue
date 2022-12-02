<template>
  <v-container class="widget">
    <v-row v-if="question" class="widget__question">
      {{ header }}
      {{ question }}
      <span v-if="required" class="red--text"> * </span>
    </v-row>
    <v-row class="widget__answer" justify="center" align="center">
      <v-col :cols="12" class="widget__textfield" @click="textfieldClickHandler">
        <v-text-field
          :disabled="!enableTextfield || disabled"
          small
          dense
          outlined
          readonly
          :value="showDialog ? '' : value"
          :rules="textFieldRules"
          hide-details="auto"
        />
        <span v-show="errorMessage" class="error-message">
          {{ errorMessage }}
        </span>
      </v-col>
    </v-row>

    <v-dialog v-model="showDialog" scrollable persistent width="600" class="widget-dialog">
      <v-card>
        <v-card-title class="widget-dialog__title">
          {{ fullQuestion || question }}
        </v-card-title>
        <v-card-text class="widget-dialog__text">
          <p class="widget-dialog__warning">{{ dialogErrorMessage }}</p>
          <v-row justify="center" align="top">
            <v-col cols="10">
              <v-text-field
                v-model.trim="text"
                outlined
                autofocus
                :hint="$t('labels.clickEnter')"
                :rules="textFieldRules"
                @blur="onBlurTextField"
                @keyup.enter="submitAnswer"
              />
            </v-col>
            <v-col cols="2">
              <v-btn
                large
                primary
                color="primary"
                height="55px"
                class="ma-0"
                :disabled="!value"
                @click="submitAnswer"
              >
                <v-icon>{{ mdiSend }}</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mdiSend } from '@mdi/js'

export default {
  name: 'TextInput',
  props: {
    config: {
      type: Object,
      default() {
        return {
          numericOnly: false
        }
      }
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    header: {
      type: String,
      default: ''
    },
    question: {
      type: String,
      default: ''
    },
    errorMessage: {
      type: String,
      default: ''
    },
    fullQuestion: {
      type: String,
      default: ''
    },
    passedData: {
      type: Object,
      default: () => {}
    },
    value: {
      type: String,
      default: ''
    },
    rules: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      mdiSend,
      enableTextfield: true,
      showDialog: false,
      dialogErrorMessage: ''
    }
  },

  computed: {
    text: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    textFieldRules() {
      const { numericOnly } = this.config
      const numericOnlyRules = [
        (value) => {
          const pattern = /^[0-9]+$/
          return pattern.test(value) || this.$i18n.t('rules.inputTextRules.numericOnly')
        }
      ]
      return numericOnly ? this.rules.concat(numericOnlyRules) : this.rules
    }
  },
  methods: {
    onBlurTextField() {
      this.$emit('blur', this.text)
    },
    submitAnswer() {
      const { numericOnly } = this.config
      const numericPattern = /^[0-9]+$/
      const hasFilledText = this.required ? !!this.text : true
      console.log("this.text: ", this.text)
      const hasFilledNumericOnly = numericOnly ? numericPattern.test(this.text) : true
      if (hasFilledText && hasFilledNumericOnly) {
        this.showDialog = false
        this.$emit('change', { ...this.passedData, value: this.text })
        this.$emit('submit', this.text)
      } else {
        if (!hasFilledText) {
          this.dialogErrorMessage = this.$t('rules.required')
        }
        if (!hasFilledNumericOnly) {
          this.dialogErrorMessage = this.$i18n.t('rules.inputTextRules.numericOnly')
        }
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

  &__question,
  &__category {
    font-size: 0.8rem;
    line-height: 0.95;
  }

  &__category {
    padding: 0 !important;
  }

  &__answer {
    font-size: 0.6rem;
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

  &__textfield {
    .v-input {
      font-size: 0.8rem;
    }
  }
}

.widget-dialog {
  &__title {
    font-size: 0.8rem;
    line-height: 0.95;
    word-break: break-word !important;
  }

  &__text {
    font-size: 0.7rem;
    line-height: 0.85;

    .v-input__append-outer {
      margin-top: 0;
    }
  }

  &__warning {
    color: red;
  }
}
</style>
