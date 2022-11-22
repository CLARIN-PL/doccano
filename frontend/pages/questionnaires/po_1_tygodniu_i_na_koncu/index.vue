<template>
<div>
  po 1 tygodniu
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
    name: "Po1Tygodniu",
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
