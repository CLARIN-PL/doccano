<template>
  <div class="emotions-input">
    <p class="emotions-input__title">Czy tekst wzbudza w Tobie jakiekolwiek emocje?</p>
    <p class="emotions-input__subheader">Jakie?</p>
    <div class="emotions-input__content">
      <slider
        category-label="Pozytywne"
        color="green"
        hint="Pozytywne"
        :value="generalPositivity"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        category-label="Negatywne"
        color="red"
        hint="Negatywne"
        :value="generalNegativity"
        :must-click="true"
        @change="updateEmotions"
      />
    </div>
    <v-divider class="emotions-input__divider" />
    <p class="emotions-input__subheader">Emocje</p>
    <div class="emotions-input__content">
      <slider
        category-label="Radość"
        color="pink"
        hint="Radość, szczęście"
        :value="joy"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        category-label="Zachwyt"
        color="purple"
        hint="Zachwyt, podziw, duma"
        :value="admiration"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        category-label="Inspiruje"
        color="indigo"
        hint="Podnosi na duchu, inspiruje"
        :value="inspiration"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        category-label="Spokój"
        color="teal"
        hint="Spokój, relaks"
        :value="peace"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        category-label="Zaskoczenie"
        color="amber"
        hint="Zaskoczenie, zdziwienie"
        :value="surprise"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        category-label="Współczucie"
        color="cyan"
        hint="Współczucie"
        :value="sympathy"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        category-label="Strach"
        color="brown"
        hint="Strach, niepokój"
        :value="fear"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        category-label="Smutek"
        color="blue-grey darken-4"
        hint="Smutek, nieszczęście"
        :value="sadness"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        category-label="Wstręt"
        color="lime darken-4"
        hint="Wstręt, obrzydzenie"
        :value="disgust"
        :must-click="true"
        @change="updateEmotions"
      />
      <slider
        category-label="Złość"
        color="red darken-4"
        hint="Złość, wkurzenie, gniew, irytacja"
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
    generalPositivity: {
      type: Number,
      default: 0
    },
    generalNegativity: {
      type: Number,
      default: 0
    },
    joy: {
      type: Number,
      default: 0
    },
    admiration: {
      type: Number,
      default: 0
    },
    inspiration: {
      type: Number,
      default: 0
    },
    peace: {
      type: Number,
      default: 0
    },
    surprise: {
      type: Number,
      default: 0
    },
    sympathy: {
      type: Number,
      default: 0
    },
    fear: {
      type: Number,
      default: 0
    },
    sadness: {
      type: Number,
      default: 0
    },
    disgust: {
      type: Number,
      default: 0
    },
    anger: {
      type: Number,
      default: 0
    }
  },

  data() {
    return {
      categoryLabelDict: {
        "Pozytywne": "positive",
        "Negatywne": "negative",
        "Radość": "joy",
        "Zachwyt": "admiration",
        "Inspiruje": "inspiration",
        "Spokój": "peace",
        "Zaskoczenie": "surprise",
        "Współczucie": "sympathy",
        "Strach": "fear",
        "Smutek": "sadness",
        "Wstręt": "disgust",
        "Złość": "anger"
      }
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
  max-height: 170px;
  overflow-x: auto;
  width: 100%;

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
