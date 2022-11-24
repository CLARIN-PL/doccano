<template>
  <div>
    <questionnaire-form :q-types="qTypes" />
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
