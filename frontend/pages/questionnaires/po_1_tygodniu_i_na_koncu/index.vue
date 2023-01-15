<template>
  <div class="overflow-visible">
    <questionnaire-form :q-types="qTypes" class="overflow-visible" />
  </div>
</template>

<script>
import { qTypes } from './js/questionnaires'
import QuestionnaireForm from '~/components/questionnaires/QuestionnaireForm.vue'

export default {
  components: {
    QuestionnaireForm
  },
  layout: 'questionnaire',
  data() {
    return {
      qTypes
    }
  }
}
</script>

<style>
.overflow-visible {
  position: relative;
  overflow: visible;
}
</style>
