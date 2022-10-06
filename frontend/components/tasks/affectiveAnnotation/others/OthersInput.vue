<template>
  <div class="others-input">
    <p class="others-input__title">{{ $t('annotation.affectiveOthers.titleQuestion') }}</p>
    <div class="others-input__content">
      <slider
        :category-label="$t('annotation.affectiveOthers.ironicCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.ironicHint')"
        :value="ironic"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <slider
        :category-label="$t('annotation.affectiveOthers.embarrassingCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.embarrassingHint')"
        :value="embarrassing"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <slider
        :category-label="$t('annotation.affectiveOthers.vulgarCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.vulgarHint')"
        :value="vulgar"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <slider
        :category-label="$t('annotation.affectiveOthers.politicCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.politicHint')"
        :value="politic"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <slider
        :category-label="$t('annotation.affectiveOthers.interestingCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.interestingHint')"
        :value="interesting"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <slider
        :category-label="$t('annotation.affectiveOthers.comprehensibleCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.comprehensibleHint')"
        :value="comprehensible"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <slider
        :category-label="$t('annotation.affectiveOthers.agreeableCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.agreeableHint')"
        :value="agreeable"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <slider
        :category-label="$t('annotation.affectiveOthers.believableCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.believableHint')"
        :value="believable"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <slider
        :category-label="$t('annotation.affectiveOthers.needMoreInfoCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.needMoreInfoHint')"
        :value="needMoreInfo"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <slider
        :category-label="$t('annotation.affectiveOthers.sympathyToAuthorCategory')"
        color="blue"
        :hint="$t('annotation.affectiveOthers.sympathyToAuthorHint')"
        :value="sympathyToAuthor"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <textfield-with-seq-2-seq
        :text="$t('annotation.affectiveOthers.wishToAuthorCategory')"
        :category-label="$t('annotation.affectiveOthers.wishToAuthorCategory')"
        :answers="wishToAuthor"
        :rules-textfield="rules"
        :text-validation="textValidation"
        :with-checkbox="true"
        :checkbox-label="$t('annotation.affectiveOthers.noWishToAuthor')"
        :hide-textfield-on-checked="true"
        @remove="removeWishToAuthor"
        @update="updateWishToAuthor"
        @add="addWishToAuthor"
        @markCheckbox="nullifyWishToAuthor"
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
    ironic: {
      type: Number,
      default: 0
    },
    embarrassing: {
      type: Number,
      default: 0
    },
    vulgar: {
      type: Number,
      default: 0
    },
    politic: {
      type: Number,
      default: 0
    },
    interesting: {
      type: Number,
      default: 0
    },
    comprehensible: {
      type: Number,
      default: 0
    },
    agreeable: {
      type: Number,
      default: 0
    },
    believable: {
      type: Number,
      default: 0
    },
    sympathyToAuthor: {
      type: Number,
      default: 0
    },
    needMoreInfo: {
      type: Number,
      default: 0
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
            const pattern = /^[A-Za-z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż,().! -]+$/
            return pattern.test(value) || this.$i18n.t('annotation.warningInvalidChar')
          }
          return true
        }
      ],
      checkboxLabel: "Nie wiem",
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
      return []
    }
  },

  methods: {
    updateCategory(value, categoryLabel) {
      const category = this.categoryLabelDict[categoryLabel]
      this.$emit('change', value, category)
    },
    nullifyCategory(checkboxIsMarked, categoryLabel) {
      const category = this.categoryLabelDict[categoryLabel]
      this.$emit('markCheckbox', checkboxIsMarked, category)
    },
    textValidation(value, arrayToCheck) {
      let errorMessage = ""
      const pattern = /^[A-Za-z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż,().! -]+$/
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
    removeWishToAuthor() {
      this.$emit('remove:wishToAuthor')
    },
    updateWishToAuthor(text) {
      if (text.length > 0) {
        this.$emit('update:wishToAuthor', text)
      } else {
        this.removeWishToAuthor()
      }
    },
    addWishToAuthor(text) {
      this.$emit('add:wishToAuthor', text)
    },
    nullifyWishToAuthor() {
      this.removeWishToAuthor()
    }
  }
}
</script>

<style lang="scss">
.others-input {
  word-wrap: normal;
  word-break: break-word;
  max-height: 170px;
  overflow-x: auto;
  width: 100%;
  padding-right: 20px !important;

  &__title {
    font-size: 1.0rem;
    line-height: 1.0;
    margin-bottom: 0 !important;
  }

  &__subheader {
    font-size: 0.8rem;
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
