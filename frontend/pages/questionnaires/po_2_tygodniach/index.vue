<template>
<div>
  po 2 tygodniach
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  qTypes, 
} from "./js/questionnaires"
import {
  qCategories,
} from "~/utils/questionnaires"

export default {
    name: "Po2Tygodniach",
    layout: "questionnaire",
  data() {
    return {
      qCategories,
      qTypes,
    }
  },
  computed: {
    ...mapGetters('user', ['getQuestionnaire']),
  },
  created() {
  },
  methods: {
    ...mapActions('user', ['setQuestionnaire']),
  }
}
</script>
