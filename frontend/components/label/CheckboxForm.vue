<template>
  <div>
    <v-form ref="checkboxForm" v-model="valid">
      <v-row>
        <v-col cols="12" sm="12" class="pt-0">
          <v-checkbox
            v-model="formData.isMultipleAnswers"
            :disabled="loading"
            class="mt-0"
            :label="$t('labels.hasMultipleAnswers')"
            color="primary"
            required
            hide-details
          />
        </v-col>
      </v-row>
      <v-row v-show="formData.isMultipleAnswers">
        <v-col cols="6" sm="6">
          <v-text-field
            v-model.number="formData.minAnswerNumber"
            :disabled="loading"
            type="number"
            :label="$t('labels.min')"
            :rules="[
              rules.required,
              rules.number,
              rules.integer,
              rules.mustBeLesserThanMax,
              required ? rules.min1 : rules.min0,
              rules.maxOptionsLength
            ]"
            outlined
            required
          />
        </v-col>
        <v-col cols="6" sm="6">
          <v-text-field
            v-model.number="formData.maxAnswerNumber"
            :disabled="loading"
            type="number"
            :label="$t('labels.max')"
            :rules="[
              rules.required,
              rules.number,
              rules.integer,
              rules.mustBeBiggerThanMin,
              rules.maxOptionsLength
            ]"
            outlined
            required
          />
        </v-col>
        <v-col cols="12" sm="12">
          <v-row v-for="(option, idx) in formData.options" :key="`option_${idx}`">
            <v-col cols="9" sm="9" class="pt-0">
              <v-text-field
                v-model.trim="formData.options[idx].text"
                :disabled="loading"
                :label="$t('labels.checkboxOption')"
                :rules="[rules.required, rules.nameDuplicated, rules.nameStringOnly]"
                :error-messages="getOptionErrorMessages(formData.options[idx])"
                required
                outlined
                @input="onOptionsTextInput"
              />
            </v-col>
            <v-col cols="3" sm="3" class="pt-0">
              <v-btn
                :disabled="loading || formData.options.length == 1"
                @click="onClickDeleteButton(idx)"
              >
                {{ $t('generic.delete') }}
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" sm="12" class="pt-0">
          <v-btn
            :disabled="loading || formData.options.length === maxOptionCount"
            @click="onClickAddButton"
          >
            {{ $t('labels.addOption') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    required: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      valid: false,
      maxOptionCount: 20,
      formData: {
        isMultipleAnswers: false,
        minAnswerNumber: 1,
        maxAnswerNumber: 1,
        options: [
          {
            text: '',
            value: 0
          }
        ]
      }
    }
  },

  computed: {
    rules() {
      const base = this
      return {
        nameDuplicated: (
          v: string // @ts-ignore
        ) => !this.isUsedName(v) || base.$t('rules.labelNameRules').duplicated,
        nameStringOnly: (
          v: string // @ts-ignore
        ) => {
          const pattern = /^[A-Za-z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż, -]+$/
          return pattern.test(v) || this.$i18n.t('annotation.warningInvalidChar')
        },
        required: (v: string) =>
          String(v) !== 'undefined' ||
          String(v) !== '' ||
          String(v) !== 'null' ||
          this.$t('rules.required'),
        min0: (v: string) => parseInt(v) >= 0 || base.$t('mustBeBiggerOrEqualTo', { value: 0 }),
        min1: (v: string) => parseInt(v) >= 1 || base.$t('mustBeBiggerOrEqualTo', { value: 1 }),
        integer: (v: string) => Number.isInteger(Number(v)) || this.$i18n.t('rules.mustBeInteger'),
        number: (v: string) => !Number.isNaN(Number(v)) || base.$t('mustBeNumber'),
        maxOptionsLength: (v: string) =>
          ((base.required ? parseInt(v) > 0 : true) &&
            parseInt(v) <= base.formData.options.length) ||
          base.$t('mustBeLesserOrEqualTo', { value: base.formData.options.length }),
        mustBeLesserThanMax: (v: string) =>
          parseInt(v) <= base.formData.maxAnswerNumber ||
          base.$t('rules.mustBeLesserOrEqualThanMax'),
        mustBeBiggerThanMin: (v: string) =>
          parseInt(v) >= base.formData.minAnswerNumber ||
          base.$t('rules.mustBeBiggerOrEqualThanMin')
      }
    }
  },

  watch: {
    formData: {
      deep: true,
      handler(val) {
        this.$emit('update:checkbox', val)
      }
    },
    valid(val) {
      this.$emit('input', val)
    }
  },

  methods: {
    isUsedName(text: string): boolean {
      return this.formData.options.filter((opt: any) => opt.text === text).length > 1
    },
    getOptionErrorMessages(option: any) {
      const messages = []
      if (this.formData.isMultipleAnswers) {
        const hasEmptyText = option.text === ''
        hasEmptyText && messages.push(this.$t('rules.required'))
      }
      return messages
    },
    onOptionsTextInput() {
      if (this.$refs.checkboxForm) {
        // @ts-ignore
        this.$refs.checkboxForm.validate()
      }
    },
    onClickDeleteButton(idx: number) {
      this.formData.options.splice(idx, 1)
      if (this.$refs.checkboxForm) {
        // @ts-ignore
        this.$refs.checkboxForm.validate()
      }
    },
    onClickAddButton() {
      this.formData.options.push({ value: this.formData.options.length + 1, text: '' })
      if (this.$refs.checkboxForm) {
        // @ts-ignore
        this.$refs.checkboxForm.validate()
      }
    }
  }
})
</script>