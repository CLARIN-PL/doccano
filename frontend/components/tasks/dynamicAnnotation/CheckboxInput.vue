<template>
  <div class="checkbox-input" :class="{ '--preview': preview }">
    <div v-if="config.isMultipleAnswers" class="questions-item">
      <div class="questions-item__text">
        <h4 v-if="name">
          {{ name }}
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
              :disabled="formData.isSubmitting"
              :rules="[
                rules.requiredMultipleCheckboxes,
                rules.minAnswerNumber,
                rules.maxAnswerNumber
              ]"
              multiple
              hide-details
              :value="playground ? option.value : option"
              :label="playground ? option.text : option"
              class="content-item__checkbox"
              @click="onCheckboxClick"
            />
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <v-checkbox
        v-model="formData.isChecked"
        :required="required"
        :rules="[rules.requiredSingleCheckbox]"
        :readonly="preview || readOnly"
        :disabled="formData.isSubmitting"
        :label="name + (required ? ' *' : '')"
        class="content-item__checkbox"
        @click="onCheckboxClick"
      />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'

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
      default: () => []
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
        errorMessage: '',
        checkedOptions: []
      }
    }
  },
  computed: {
    rules() {
      return {
        requiredMultipleCheckboxes: () =>
          this.required ? !!this.formData.checkedOptions.length : true || 'Required',
        minAnswerNumber: () =>
          this.formData.checkedOptions.length >= this.config.minAnswerNumber ||
          `Please select at least ${this.config.minAnswerNumber} options`,
        maxAnswerNumber: () =>
          this.formData.checkedOptions.length <= this.config.maxAnswerNumber ||
          `You can only select up to ${this.config.maxAnswerNumber} options`,
        requiredSingleCheckbox: () => (this.required ? this.formData.isChecked : true || 'Required')
      }
    }
  },
  methods: {
    parseConfigOptions(val: string) {
      let options = []
      if (val.includes('; ')) {
        options = val.split(';').map((v) => v.trim())
      } else if (Array.isArray(val)) {
        if (val.length && typeof val[0] === 'object' && !this.playground) {
          options = val.map((v) => v.text || v.name)
        } else {
          options = val
        }
      }
      return options
    },
    validateCheckbox() {
      if (this.config.isMultipleAnswers) {
        if (this.required && !this.formData.checkedOptions.length) {
          this.formData.errorMessage = 'This field is required'
        }
        if (this.formData.checkedOptions.length < this.config.minAnswerNumber) {
          this.formData.errorMessage = `Please mark at least ${this.config.minAnswerNumber} answers`
        }
        if (this.formData.checkedOptions.length > this.config.maxAnswerNumber) {
          this.formData.errorMessage = 'Max answer number reached'
        }
      } else if (this.required && !this.formData.isChecked) {
        this.formData.errorMessage = 'This field is required'
      }
    },
    onCheckboxClick() {
      if (this.config.isMultipleAnswers) {
        let isValidated = true
        if (
          this.config.maxAnswerNumber &&
          this.formData.checkedOptions.length > this.config.maxAnswerNumber
        ) {
          isValidated = false
          this.formData.errorMessage = `You can only select up to ${this.config.maxAnswerNumber} options`
        }
        if (isValidated) {
          this.formData.errorMessage = ''
          this.$emit('input', this.formData.checkedOptions)
          this.$emit('change', this.formData.checkedOptions)
        }
      } else {
        this.$emit('input', this.formData.isChecked)
        this.$emit('change', this.formData.isChecked)
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