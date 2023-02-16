<template>
  <div class="emotions-input" :class="{'--has-error': hasErrors, '--bordered': showBorders}">
    <p class="emotions-input__title">{{ $t('annotation.affectiveEmotions.titleQuestion') }}</p>
    <v-divider class="emotions-input__divider" />
    <p class="emotions-input__subheader">{{ $t('annotation.affectiveEmotions.titleWhat') }}</p>
    <div class="emotions-input__content">
      <slider
        :error="showErrors && generalPositivity === flagSliderUnclicked"
        :show-component="showPositiveCategory"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveEmotions.positiveCategory')"
        color="green"
        :hint="$t('annotation.affectiveEmotions.positiveHint')"
        :value="generalPositivity"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        :error="showErrors && generalNegativity === flagSliderUnclicked"
        :show-component="showNegativeCategory"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveEmotions.negativeCategory')"
        color="red"
        :hint="$t('annotation.affectiveEmotions.negativeHint')"
        :value="generalNegativity"
        :must-click="true"
        @change="updateEmotions"
      />
    </div>
    <v-divider class="emotions-input__divider" />
    <p class="emotions-input__subheader">{{ $t('annotation.affectiveEmotions.titleEmotions') }}</p>
    <div class="emotions-input__content">
      <slider
        :error="showErrors && joy === flagSliderUnclicked"
        :show-component="showJoyCategory"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveEmotions.joyCategory')"
        color="pink"
        :hint="$t('annotation.affectiveEmotions.joyHint')"
        :value="joy"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        :error="showErrors && admiration === flagSliderUnclicked"
        :show-component="showAdmirationCategory"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveEmotions.admirationCategory')"
        color="purple"
        :hint="$t('annotation.affectiveEmotions.admirationHint')"
        :value="admiration"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        :error="showErrors && inspiration === flagSliderUnclicked"
        :show-component="showInspirationCategory"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveEmotions.inspirationCategory')"
        color="indigo"
        :hint="$t('annotation.affectiveEmotions.inspirationHint')"
        :value="inspiration"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        :error="showErrors && peace === flagSliderUnclicked"
        :show-component="showPeaceCategory"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveEmotions.peaceCategory')"
        color="teal"
        :hint="$t('annotation.affectiveEmotions.peaceHint')"
        :value="peace"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        :error="showErrors && surprise === flagSliderUnclicked"
        :show-component="showSurpriseCategory"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveEmotions.surpriseCategory')"
        color="amber"
        :hint="$t('annotation.affectiveEmotions.surpriseHint')"
        :value="surprise"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        :error="showErrors && sympathy === flagSliderUnclicked"
        :show-component="showSympathyCategory"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveEmotions.sympathyCategory')"
        color="cyan"
        :hint="$t('annotation.affectiveEmotions.sympathyHint')"
        :value="sympathy"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        :error="showErrors && fear === flagSliderUnclicked"
        :show-component="showFearCategory"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveEmotions.fearCategory')"
        color="brown"
        :hint="$t('annotation.affectiveEmotions.fearHint')"
        :value="fear"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        :error="showErrors && sadness === flagSliderUnclicked"
        :show-component="showSadnessCategory"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveEmotions.sadnessCategory')"
        color="blue-grey darken-4"
        :hint="$t('annotation.affectiveEmotions.sadnessHint')"
        :value="sadness"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        :error="showErrors && disgust === flagSliderUnclicked"
        :show-component="showDisgustCategory"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveEmotions.disgustCategory')"
        color="lime darken-4"
        :hint="$t('annotation.affectiveEmotions.disgustHint')"
        :value="disgust"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        :error="showErrors && anger === flagSliderUnclicked"
        :show-component="showAngerCategory"
        :read-only="readOnly"
        :category-label="$t('annotation.affectiveEmotions.angerCategory')"
        color="red darken-4"
        :hint="$t('annotation.affectiveEmotions.angerHint')"
        :value="anger"
        :must-click="true"
        @change="updateEmotions"
      />
    </div>
  </div>
</template>

<script>
import Slider from '~/components/tasks/affectiveAnnotation/inputs/Slider.vue'

export default {
  components: {
    Slider
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
    generalPositivity: {
      type: Number,
      default: -99
    },
    generalNegativity: {
      type: Number,
      default: -99
    },
    joy: {
      type: Number,
      default: -99
    },
    admiration: {
      type: Number,
      default: -99
    },
    inspiration: {
      type: Number,
      default: -99
    },
    peace: {
      type: Number,
      default: -99
    },
    surprise: {
      type: Number,
      default: -99
    },
    sympathy: {
      type: Number,
      default: -99
    },
    fear: {
      type: Number,
      default: -99
    },
    sadness: {
      type: Number,
      default: -99
    },
    disgust: {
      type: Number,
      default: -99
    },
    anger: {
      type: Number,
      default: -99
    },
    dimsToShow: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      flagSliderUnclicked: -99,
      positiveCategory: this.$i18n.t('annotation.affectiveEmotions.positiveCategory'),
      negativeCategory: this.$i18n.t('annotation.affectiveEmotions.negativeCategory'),
      joyCategory: this.$i18n.t('annotation.affectiveEmotions.joyCategory'),
      admirationCategory: this.$i18n.t('annotation.affectiveEmotions.admirationCategory'),
      inspirationCategory: this.$i18n.t('annotation.affectiveEmotions.inspirationCategory'),
      peaceCategory: this.$i18n.t('annotation.affectiveEmotions.peaceCategory'),
      surpriseCategory: this.$i18n.t('annotation.affectiveEmotions.surpriseCategory'),
      sympathyCategory: this.$i18n.t('annotation.affectiveEmotions.sympathyCategory'),
      fearCategory: this.$i18n.t('annotation.affectiveEmotions.fearCategory'),
      sadnessCategory: this.$i18n.t('annotation.affectiveEmotions.sadnessCategory'),
      disgustCategory: this.$i18n.t('annotation.affectiveEmotions.disgustCategory'),
      angerCategory: this.$i18n.t('annotation.affectiveEmotions.angerCategory')
    }
  },

  computed: {
    categoryLabelDict() {
      const output = {}
      output[this.positiveCategory]= "positive"
      output[this.negativeCategory]= "negative"
      output[this.joyCategory]= "joy"
      output[this.admirationCategory]= "admiration"
      output[this.inspirationCategory]= "inspiration"
      output[this.peaceCategory]= "peace"
      output[this.surpriseCategory]= "surprise"
      output[this.sympathyCategory]= "sympathy"
      output[this.fearCategory]= "fear"
      output[this.sadnessCategory]= "sadness"
      output[this.disgustCategory]= "disgust"
      output[this.angerCategory]= "anger"
      return output
    },
    hasValidEntries() {
      const items = [this.generalPositivity, this.generalNegativity, this.joy,
                    this.admiration, this.inspiration, this.peace, this.surprise,
                    this.sympathy, this.fear, this.sadness, this.disgust, this.anger]
      return items.findIndex((item) => item === this.flagSliderUnclicked) === -1
    },
    hasErrors() {
      return (this.showErrors) ? !this.hasValidEntries : false
    },
    showPositiveCategory() {
      const cat = this.positiveCategory
      return this.dimsToShow.findIndex((item) => item === cat) !== -1
    },
    showNegativeCategory() {
      const cat = this.negativeCategory
      return this.dimsToShow.findIndex((item) => item === cat) !== -1
    },
    showJoyCategory() {
      const cat = this.joyCategory
      return this.dimsToShow.findIndex((item) => item === cat) !== -1
    },
    showAdmirationCategory() {
      const cat = this.admirationCategory
      return this.dimsToShow.findIndex((item) => item === cat) !== -1
    },
    showInspirationCategory() {
      const cat = this.inspirationCategory
      return this.dimsToShow.findIndex((item) => item === cat) !== -1
    },
    showPeaceCategory() {
      const cat = this.peaceCategory
      return this.dimsToShow.findIndex((item) => item === cat) !== -1
    },
    showSurpriseCategory() {
      const cat = this.surpriseCategory
      return this.dimsToShow.findIndex((item) => item === cat) !== -1
    },
    showSympathyCategory() {
      const cat = this.sympathyCategory
      return this.dimsToShow.findIndex((item) => item === cat) !== -1
    },
    showFearCategory() {
      const cat = this.fearCategory
      return this.dimsToShow.findIndex((item) => item === cat) !== -1
    },
    showSadnessCategory() {
      const cat = this.sadnessCategory
      return this.dimsToShow.findIndex((item) => item === cat) !== -1
    },
    showDisgustCategory() {
      const cat = this.disgustCategory
      return this.dimsToShow.findIndex((item) => item === cat) !== -1
    },
    showAngerCategory() {
      const cat = this.angerCategory
      return this.dimsToShow.findIndex((item) => item === cat) !== -1
    }
  },

  methods: {
    updateEmotions(value, categoryLabel) {
      const category = this.categoryLabelDict[categoryLabel]
      this.$emit('change', value, category)
    }
  }
}
</script>

<style lang="scss">
.emotions-input {
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
