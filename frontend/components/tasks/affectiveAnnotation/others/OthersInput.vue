<template>
  <div class="others-input" :class="{'--has-error': hasErrors, '--bordered': showBorders}">
    <p class="others-input__title">{{ $t('annotation.affectiveOthers.titleQuestion') }}</p>
    <v-divider class="others-input__divider" />
    <div class="others-input__content">
      <slider
        :error="showErrors && ironic === flagSliderUnclicked"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveOthers.ironicCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.ironicHint')"
        :value="ironic"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategoryValue"
        @unmarkCheckbox="restoreCategoryValue"
      />
      <slider
        :error="showErrors && embarrassing === flagSliderUnclicked"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveOthers.embarrassingCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.embarrassingHint')"
        :value="embarrassing"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategoryValue"
        @unmarkCheckbox="restoreCategoryValue"
      />
      <slider
        :error="showErrors && vulgar === flagSliderUnclicked"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveOthers.vulgarCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.vulgarHint')"
        :value="vulgar"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategoryValue"
        @unmarkCheckbox="restoreCategoryValue"
      />
      <slider
        :error="showErrors && politic === flagSliderUnclicked"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveOthers.politicCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.politicHint')"
        :value="politic"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategoryValue"
        @unmarkCheckbox="restoreCategoryValue"
      />
      <slider
        :error="showErrors && interesting === flagSliderUnclicked"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveOthers.interestingCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.interestingHint')"
        :value="interesting"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategoryValue"
        @unmarkCheckbox="restoreCategoryValue"
      />
      <slider
        :error="showErrors && comprehensible === flagSliderUnclicked"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveOthers.comprehensibleCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.comprehensibleHint')"
        :value="comprehensible"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategoryValue"
        @unmarkCheckbox="restoreCategoryValue"
      />
      <slider
        :error="showErrors && agreeable === flagSliderUnclicked"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveOthers.agreeableCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.agreeableHint')"
        :value="agreeable"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategoryValue"
        @unmarkCheckbox="restoreCategoryValue"
      />
      <slider
        :error="showErrors && believable === flagSliderUnclicked"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveOthers.believableCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.believableHint')"
        :value="believable"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategoryValue"
        @unmarkCheckbox="restoreCategoryValue"
      />
      <slider
        :error="showErrors && needMoreInfo === flagSliderUnclicked"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveOthers.needMoreInfoCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.needMoreInfoHint')"
        :value="needMoreInfo"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategoryValue"
        @unmarkCheckbox="restoreCategoryValue"
      />
      <slider
        :error="showErrors && sympathyToAuthor === flagSliderUnclicked"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveOthers.sympathyToAuthorCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.sympathyToAuthorHint')"
        :value="sympathyToAuthor"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategoryValue"
        @unmarkCheckbox="restoreCategoryValue"
      />
      <textfield-with-seq-2-seq
        :error="showErrors && (wishToAuthor.length === 0 || wishToAuthor.length > 1)"
        :read-only="readOnly"
        :text="$t('annotation.affectiveOthers.wishToAuthorCategory')"
        :category-label="$t('annotation.affectiveOthers.wishToAuthorCategory')"
        :answers="wishToAuthor"
        :rules-textfield="rules"
        :text-validation="textValidation"
        :with-checkbox="true"
        :checkbox-label="$t('annotation.affectiveOthers.labelNoWishToAuthor')"
        :hide-textfield-on-checked="true"
        @remove="removeWishToAuthor"
        @update="updateWishToAuthor"
        @add="addWishToAuthor"
        @markCheckbox="nullifyWishToAuthor"
        @unmarkCheckbox="restoreWishToAuthor"
      />
    </div>
  </div>
</template>
  
<script>
import Slider from '../inputs/Slider.vue'
import TextfieldWithSeq2Seq from '../inputs/TextfieldWithSeq2Seq.vue'

export default {
  components: {
    Slider,
    TextfieldWithSeq2Seq
  },

  props: {
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
    ironic: {
      type: Number,
      default: -99
    },
    embarrassing: {
      type: Number,
      default: -99
    },
    vulgar: {
      type: Number,
      default: -99
    },
    politic: {
      type: Number,
      default: -99
    },
    interesting: {
      type: Number,
      default: -99
    },
    comprehensible: {
      type: Number,
      default: -99
    },
    agreeable: {
      type: Number,
      default: -99
    },
    believable: {
      type: Number,
      default: -99
    },
    sympathyToAuthor: {
      type: Number,
      default: -99
    },
    needMoreInfo: {
      type: Number,
      default: -99
    },
    wishToAuthor: {
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
            const count_ok = words_array.length === 1
            return count_ok || "Please enter one answer."
          }
          return this.$i18n.t('annotation.warningRequired')
        },
        (value) => {
          if (value) {
            const pattern = /^[A-Za-z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż, -]+$/
            return pattern.test(value) || this.$i18n.t('annotation.warningInvalidChar')
          }
          return true
        }
      ],
      flagSliderUnclicked: -99,
      checkboxLabel: this.$i18n.t('annotation.affectiveOthers.labelDontKnow'),
      ironicCategory: this.$i18n.t('annotation.affectiveOthers.ironicCategory'),
      embarrassingCategory: this.$i18n.t('annotation.affectiveOthers.embarrassingCategory'),
      vulgarCategory: this.$i18n.t('annotation.affectiveOthers.vulgarCategory'),
      politicCategory: this.$i18n.t('annotation.affectiveOthers.politicCategory'),
      interestingCategory: this.$i18n.t('annotation.affectiveOthers.interestingCategory'),
      comprehensibleCategory: this.$i18n.t('annotation.affectiveOthers.comprehensibleCategory'),
      agreeableCategory: this.$i18n.t('annotation.affectiveOthers.agreeableCategory'),
      believableCategory: this.$i18n.t('annotation.affectiveOthers.believableCategory'),
      sympathyToAuthorCategory: this.$i18n.t('annotation.affectiveOthers.sympathyToAuthorCategory'),
      needMoreInfoCategory: this.$i18n.t('annotation.affectiveOthers.needMoreInfoCategory')
    }
  },

  computed: {
    categoryLabelDict() {
      const output = {}
      output[this.ironicCategory]= "ironic"
      output[this.embarrassingCategory]= "embarrassing"
      output[this.vulgarCategory]= "vulgar"
      output[this.politicCategory]= "politic"
      output[this.interestingCategory]= "interesting"
      output[this.comprehensibleCategory]= "comprehensible"
      output[this.agreeableCategory]= "agreeable"
      output[this.believableCategory]= "believable"
      output[this.sympathyToAuthorCategory]= "sympathyToAuthor"
      output[this.needMoreInfoCategory]= "needMoreInfo"
      return output
    },
    hasValidEntries() {
      const items = [this.ironic, this.embarrassing, this.vulgar, this.politic,
                    this.interesting, this.comprehensible, this.agreeable,
                    this.believable, this.sympathyToAuthor, this.needMoreInfo]
      return items.findIndex((item) => item === this.flagSliderUnclicked) === -1 && this.wishToAuthor.length > 0
    },
    hasErrors() {
      return (this.showErrors) ? !this.hasValidEntries : false
    }
  },

  methods: {
    updateCategory(value, categoryLabel) {
      const category = this.categoryLabelDict[categoryLabel]
      this.$emit('change', value, category)
    },
    nullifyCategoryValue(categoryLabel) {
      const category = this.categoryLabelDict[categoryLabel]
      this.$emit('nullifyCategoryValue', category)
    },
    restoreCategoryValue(categoryLabel) {
      const category = this.categoryLabelDict[categoryLabel]
      this.$emit('restoreCategoryValue', category)
    },
    textValidation(value, arrayToCheck) {
      let errorMessage = ""
      const pattern = /^[A-Za-z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż -]+$/
      if (!pattern.test(value)) {
        errorMessage = this.$i18n.t('annotation.warningInvalidChar')
      }
      if (arrayToCheck.length >= 1) {
        errorMessage = this.$i18n.t('annotation.warningMaxCount')
      }
      const isWordEntered = arrayToCheck.findIndex((item) => item.text === value)
      if (isWordEntered > -1) {
        errorMessage = this.$i18n.t('annotation.warningAlreadyWritten')
      }
      return errorMessage
    },
    removeWishToAuthor(annotationId) {
      this.$emit('remove:wishToAuthor', annotationId)
    },
    updateWishToAuthor(annotationId, text) {
      if (text.length > 0) {
        this.$emit('update:wishToAuthor', annotationId, text)
      } else {
        this.removeWishToAuthor(annotationId)
      }
    },
    addWishToAuthor(text) {
      this.$emit('add:wishToAuthor', text)
    },
    nullifyWishToAuthor() {
      this.$emit('nullify:wishToAuthor')
    },
    restoreWishToAuthor() {
      this.$emit('restore:wishToAuthor')
    }
  }
}
</script>

<style lang="scss">
.others-input {
  word-wrap: normal;
  word-break: break-word;
  overflow-y: auto;
  overflow-x: auto;
  width: 100%;
  padding: 15px 20px 10px 10px;

  &.--bordered {
    border: 2px solid #ddd;
    border-radius: 2px;  

    &.--has-error {
      border: 2px solid red;
    }
  }

  &__title {
    font-size: 1.0rem;
    font-weight: bold;
    line-height: 1.0;
  }

  &__subheader {
    font-size: 0.8rem;
    font-weight: bold;
    line-height: 0.95;
    margin-top: 10px !important;
    margin-bottom: 0 !important;
  }

  &__content {
    margin-top: 10px !important;
    margin-bottom: 10px !important;
  }
}
</style>
