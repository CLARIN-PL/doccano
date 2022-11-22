<template>
<div>
  przed badaniem
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
    name: "PrzedBadaniem",
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
    finishQuestionnaire() {
      // do something
    }
  }
}
</script>
