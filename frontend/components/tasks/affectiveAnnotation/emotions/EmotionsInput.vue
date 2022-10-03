<template>
  <div class="emotions-input">
    <p class="emotions-input__title">Czy tekst wzbudza w Tobie jakiekolwiek emocje?</p>
    <p class="emotions-input__subheader">Jakie?</p>
    <div class="emotions-input__content">
      <slider
        category="Pozytywne"
        color="green"
        hint="Pozytywne"
      />
      <slider
        category="Negatywne"
        color="red"
        hint="Negatywne"
      />
    </div>
    <v-divider class="emotions-input__divider" />
    <p class="emotions-input__subheader">Emocje</p>
    <div class="emotions-input__content">
      <slider
        category="Radość"
        color="pink"
        hint="Radość, szczęście"
      />
      <slider
        category="Zachwyt"
        color="purple"
        hint="Zachwyt, podziw, duma"
      />
      <slider
        category="Inspiruje"
        color="indigo"
        hint="Podnosi na duchu, inspiruje"
      />
      <slider
        category="Spokój"
        color="teal"
        hint="Spokój, relaks"
      />
      <slider
        category="Zaskoczenie"
        color="amber"
        hint="Zaskoczenie, zdziwienie"
      />
      <slider
        category="Współczucie"
        color="lime"
        hint="Współczucie"
      />
      <slider
        category="Strach"
        color="brown"
        hint="Strach, niepokój"
      />
      <slider
        category="Smutek"
        color="blue-grey darken-4"
        hint="Smutek, nieszczęście"
      />
      <slider
        category="Wstręt"
        color="lime darken-4"
        hint="Wstręt, obrzydzenie"
      />
      <slider
        category="Złość"
        color="red darken-4"
        hint="Złość, wkurzenie, gniew, irytacja"
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
}
</script>

<style lang="scss">
.emotions-input {
  word-wrap: normal;
  word-break: break-word;

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
    margin-bottom: 15px !important;
  }
}
</style>
