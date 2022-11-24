<template>
  <div>
    <questionnaire-form :q-types="qTypes" />
  </div>
</template>

<script>
import {
  qTypes, 
} from "./js/questionnaires"
import QuestionnaireForm from "~/components/questionnaires/QuestionnaireForm.vue"

export default {
    layout: "questionnaire",
    components: {
      QuestionnaireForm
    },
    data() {
      return {
        qTypes
      }
    }
}
</script>
