<template>
  <v-container class="widget">
    <v-row v-if="question" class="widget__question">
      {{ question }}
      <span  v-if="required" class="red--text">
         *
      </span>
    </v-row>
    <v-row class="widget__answer"  justify="center" align="center">
      <v-col
        :cols="12"
        class="widget__textfield"
        @click="textfieldClickHandler"
      >
        <v-text-field
          :disabled="!enableTextfield || disabled"
          small
          dense
          outlined
          readonly
          :value="showDialog ? '' : value"
          :rules="rulesTextfield"
          hide-details="auto"
        />
      </v-col>
    </v-row>

    <v-dialog
      v-model="showDialog"
      scrollable
      persistent
      width="600"
      class="widget-dialog"
    >
      <v-card>
        <v-card-title class="widget-dialog__title">
          {{ fullQuestion || question }}
        </v-card-title>
        <v-card-text  class="widget-dialog__text">
          <p class="widget-dialog__warning">{{ dialogErrorMessage }}</p>
            <v-text-field  
                v-model.trim="text"
                outlined
                autofocus
                :hint="$t('labels.clickEnter')"
                :rules="rulesTextfield"
                @keyup.enter="submitAnswer" >
                <template #append-outer>
                    <v-btn 
                    large 
                    primary
                    color="primary"
                    height="55px"
                    class="ma-0"
                    :disabled="!value"
                    @click="submitAnswer">
                      <v-icon>{{ mdiSend }}</v-icon>
                    </v-btn>
                </template>
            </v-text-field>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import {  mdiSend } from '@mdi/js'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    question: {
      type: String,
      default: ""
    },
    fullQuestion: {
      type: String,
      default: ""
    },
    value: {
      type: String,
      default: ""
    },
    rulesTextfield: {
      type: Array,
      default: () => []
    },
  },

  data() {
    return {
      mdiSend,
      enableTextfield: true,
      showDialog: false,
      dialogErrorMessage: "",
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
    }
  },

  methods: {
    submitAnswer() {
      const hasFilledText = this.required ? !!this.text : true
      if(hasFilledText) {
        this.showDialog = false
        this.$emit("submit", this.text)
      } else {
        this.dialogErrorMessage = this.$t('rules.required')
      }
    },
    textfieldClickHandler() {
      if (this.enableTextfield) {
        this.showDialog = true
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

    &__textfield {
      .v-input {
        font-size: .8rem;
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

      .v-input__append-outer {
        margin-top: 0;
      }
    }

    &__warning {
      color: red;
    }
    

  }
  </style>
