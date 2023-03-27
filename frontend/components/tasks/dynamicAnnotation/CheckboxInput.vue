<template>
  <div class="checkbox-input" :class="{ '--preview': preview, '--readonly': readOnly }">
    <div v-if="config.isMultipleAnswers" class="questions-item">
      <div class="questions-item__text">
        <h4 v-if="item.originalQuestion || name">
          {{ capitalize(item.originalQuestion) || capitalize(name) }}
          <span v-if="required" class="red--text">*</span>
        </h4>
        <span v-if="formData.errorMessage" class="d-block red--text">
          {{ formData.errorMessage }}
        </span>
      </div>
      <div class="questions-item__content">
        <ul class="content">
          <li
            v-for="(option, idx) in parseConfigOptions(config.options)"
            :key="`checkbox_${name}_${idx}`"
            class="content__item"
          >
            <v-checkbox
              v-model="formData.checkedOptions"
              :required="required"
              :readonly="preview || readOnly"
              :disabled="preview || formData.isSubmitting"
              :rules="[
                rules.requiredMultipleCheckboxes,
                rules.minAnswerNumber,
                rules.maxAnswerNumber
              ]"
              multiple
              hide-details
              :input-value="formData.checkedOptions"
              :value="option['value']"
              :label="option['label']"
              class="content-item__checkbox"
              @click.once="onCheckboxClick"
            />
          </li>
          <p></p>
        </ul>
      </div>
    </div>
    <div v-else>
      <v-checkbox
        v-model="formData.isChecked"
        :required="required"
        :rules="[rules.requiredSingleCheckbox]"
        :readonly="preview || readOnly"
        :disabled="preview || formData.isSubmitting"
        :label="name + (required ? ' *' : '')"
        class="content-item__checkbox"
        @click.once="onCheckboxClick"
      />
    </div>
  </div>
</template>
<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { capitalize } from '~/utils/stringHelpers'

export default Vue.extend({
  props: {
    name: {
      type: String,
      default: 'Name'
    },
    formDataKey: {
      type: String,
      default: ''
    },
    value: {
      type: [Array, String, Boolean],
      default: () => [] as any[]
    },
    useValue: {
      type: Boolean,
      default: false
    },
    config: {
      type: Object,
      default() {
        return {
          isMultipleAnswers: false,
          minAnswerNumber: 1,
          maxAnswerNumber: 1,
          options: []
        }
      }
    },
    item: {
      type: Object,
      default: () => {
        return {
          id: '',
          value: [],
          isSubmitting: false,
          isChecked: false
        }
      }
    },
    items: {
      type: Array,
      default: () => []
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    preview: {
      type: Boolean,
      default: false
    },
    playground: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formData: {
        isDisabled: false,
        isChecked: false,
        isSubmitting: false,
        errorMessage: '' as any,
        checkedOptions: [] as string[]
      }
    }
  },
  computed: {
    rules() {
      return {
        requiredMultipleCheckboxes: () =>
          this.required ? !!this.formData.checkedOptions.length : true || this.$t('rules.required'),
        minAnswerNumber: () =>
          this.formData.checkedOptions.length >= this.config.minAnswerNumber ||
          this.$t('rules.pleaseChooseAtLeast', {
            value: this.config.minAnswerNumber
          }),
        maxAnswerNumber: () =>
          this.formData.checkedOptions.length <= this.config.maxAnswerNumber ||
          this.$t('rules.youCanOnlyChooseUpTo', {
            value: this.config.maxAnswerNumber
          }),
        requiredSingleCheckbox: () =>
          this.required ? this.formData.isChecked : true || this.$t('rules.required')
      }
    }
  },
  watch: {
    item: {
      deep: true,
      handler(val) {
        if (!val.isSubmitting) {
          this.setFormData()
        }
      }
    }
  },
  created() {
    this.setFormData()
  },
  methods: {
    capitalize,
    setFormData() {
      if (this.useValue) {
        this.setFormDataFromValue()
      } else {
        this.setFormDataFromItem()
      }
    },
    setFormDataFromValue() {
      if (this.config.isMultipleAnswers) {
        this.formData.checkedOptions = Array.isArray(this.value) ? this.value : []
      } else {
        this.formData.isChecked = !!this.value
      }
    },
    setFormDataFromItem() {
      if (this.config.isMultipleAnswers) {
        const val: any = this.item.tempValue || this.item.value
        this.formData.checkedOptions = Array.isArray(val) ? val : []
      } else {
        const val: any = this.item.tempValue || this.item.value
        this.formData.isChecked = !!val
      }
    },
    parseConfigOptions(val: string) {
      let options = []
      if (typeof val === 'string' && val.includes(';')) {
        options = val.split(';').map((v) => v.trim())
      } else if (Array.isArray(val)) {
        options = val
      }
      options = options.filter((opt) => !!opt)
      return options
    },
    validateCheckbox() {
      let isValidated = true
      if (this.config.isMultipleAnswers) {
        if (this.required && !this.formData.checkedOptions.length) {
          this.formData.errorMessage = this.$t('rules.required')
          isValidated = false
        }
        if (this.formData.checkedOptions.length < this.config.minAnswerNumber) {
          this.formData.errorMessage = this.$t('rules.pleaseChooseAtLeast', {
            value: this.config.minAnswerNumber
          })
          isValidated = false
        }
        if (this.formData.checkedOptions.length > this.config.maxAnswerNumber) {
          this.formData.errorMessage = this.$t('rules.youCanOnlyChooseUpTo', {
            value: this.config.maxAnswerNumber
          })
          isValidated = false
        }
      } else if (this.required && !this.formData.isChecked) {
        this.formData.errorMessage = this.$t('rules.required')
        isValidated = false
      }
      return isValidated
    },
    onCheckboxClick($event) {
      const lastClickedElement = [...$event.target.parentElement.children]
      const lastClickedElementInput = lastClickedElement.find((item) => item.tagName === 'INPUT')
      const lastAddedElement = lastClickedElementInput ? lastClickedElementInput.defaultValue : ''
      if (!this.preview) {
        const isValidated = this.validateCheckbox()
        let tempValue: any = this.config.isMultipleAnswers
          ? _.cloneDeep(this.formData.checkedOptions)
          : this.formData.isChecked

        if (!isValidated) {
          if (this.config.isMultipleAnswers) {
            tempValue = _.cloneDeep(this.formData.checkedOptions).splice(
              0,
              this.formData.checkedOptions.length - 1
            )
            this.formData.checkedOptions = _.cloneDeep(tempValue)
          } else {
            this.formData.isChecked = !!tempValue
          }
        } else if (this.config.isMultipleAnswers && isValidated) {
          this.formData.errorMessage = ''
          const dimensionName = lastAddedElement.includes('-')
            ? lastAddedElement
            : `${this.item.originalQuestion} - ${lastAddedElement}`
          const dimension = this.items.find((dim) => dim.name.includes(dimensionName))
          const isAdding = this.formData.checkedOptions.includes(lastAddedElement)
          if (isAdding && !dimension.questionId) {
            this.$emit('add:label', {
              formDataKey: this.formDataKey,
              name: dimension.name,
              value: lastAddedElement
            })
          } else if (
            !isAdding &&
            dimension &&
            dimension.questionId &&
            !this.formData.checkedOptions.length
          ) {
            this.$emit('delete:label', {
              formDataKey: this.formDataKey,
              questionId: dimension.questionId,
              name: dimension.name
            })
          }
          this.$emit('input', this.formData.checkedOptions)
        } else if (!this.config.isMultipleAnswers) {
          const isAdding = this.formData.isChecked
          if (!isAdding && this.item.questionId) {
            this.$emit('delete:label', {
              formDataKey: this.formDataKey,
              questionId: this.item.questionId,
              name: this.name
            })
          } else {
            this.$emit('add:label', {
              formDataKey: this.formDataKey,
              name: this.name,
              value: this.name
            })
          }
          this.$emit('input', this.formData.isChecked)
        }
      }
    }
  }
})
</script>
<style lang="scss" scoped>
.checkbox-input {
  &.--preview {
    zoom: 0.8;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 10px;
  }

  &.--readonly {
    opacity: 0.7;
  }
}
.questions-item {
  &__slider {
    display: flex;

    .v-slider__tick-label {
      font-size: 0.8rem;
    }

    .slider-text {
      color: gray;
      margin-top: 5px;

      &.--start {
        margin-right: 10px;
      }

      &.--end {
        margin-left: 10px;
      }
    }
  }

  &__text {
    margin-bottom: 10px;
  }

  .v-input--selection-controls {
    margin-top: 0 !important;
  }
}

.content {
  list-style-type: none;
  padding: 0;

  &__item {
    .content-item__checkbox {
      .v-label {
        font-size: 0.8rem;
      }

      .v-input__slot {
        margin: 0;
      }
    }
  }
}
</style>