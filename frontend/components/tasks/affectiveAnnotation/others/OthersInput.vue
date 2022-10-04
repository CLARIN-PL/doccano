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
      <!-- Add textfield for Czego życzę autorowi tego tekstu? -->
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
      type: String,
      default: ""
    }
  },

  data() {
    return {
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
        "Potrzebuję więcej informacji": "needMoreInfo",
        "wishToAuthor": "wishToAuthor"
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
