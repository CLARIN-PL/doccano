<template>
  <div class="others-input">
    <p class="others-input__title">Jaki jest ten tekst?</p>
    <div class="others-input__content">
      <slider
        category-label="Ironiczny"
        color="blue"
        hint="Ironiczny, sarkastyczny"
        :value="ironic"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <slider
        category-label="Żenujący"
        color="blue"
        hint="Żenujący"
        :value="embarassing"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <slider
        category-label="Wulgarny"
        color="blue"
        hint="Wulgarny"
        :value="vulgar"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <slider
        category-label="Polityczny"
        color="blue"
        hint="Polityczny"
        :value="politic"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <slider
        category-label="Interesujący"
        color="blue"
        hint="Interesujący, ciekawy"
        :value="interesting"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <slider
        category-label="Zrozumiały"
        color="blue"
        hint="Zrozumiały"
        :value="comprehensible"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <slider
        category-label="Zgadzam się z tekstem"
        color="blue"
        hint="Zgadzam się z tekstem"
        :value="agreeable"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <slider
        category-label="Wierzę w tę informację"
        color="blue"
        hint="Wierzę w tę informację"
        :value="believable"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <slider
        category-label="Potrzebuję więcej informacji"
        color="blue"
        hint="Potrzebuję więcej informacji, aby ocenić ten tekst"
        :value="needMoreInfo"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <slider
        category-label="Czuję sympatię do autora"
        color="blue"
        hint="Czuję sympatię do autora"
        :value="sympathyToAuthor"
        :must-click="true"
        :with-checkbox="true"
        :checkbox-label="checkboxLabel"
        :hide-slider-on-checked="true"
        @change="updateCategory"
        @markCheckbox="nullifyCategory"
      />
      <textfield-with-seq-2-seq
        text="Czego życzę autorowi tego tekstu?"
        category-label="Czego życzę autorowi tego tekstu?"
        :answers="wishToAuthor"
        :rules-textfield="rules"
        :text-validation="textValidation"
        :with-checkbox="true"
        checkbox-label="Nie mam życzeń"
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
    embarassing: {
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
      categoryLabelDict: {
        "Ironiczny": "ironic",
        "Żenujący": "embarassing",
        "Wulgarny": "vulgar",
        "Polityczny": "politic",
        "Interesujący": "interesting",
        "Zrozumiały": "comprehensible",
        "Zgadzam się z tekstem": "agreeable",
        "Wierzę w tę informację": "believable",
        "Czuję sympatię do autora": "sympathyToAuthor",
        "Potrzebuję więcej informacji": "needMoreInfo"
      }
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
