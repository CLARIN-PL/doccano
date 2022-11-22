<template>
<div>
  przed i po badaniu
</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  qTypes
} from "./js/questionnaires"

export default {
    name: "PrzedIPoBadaniu",
    layout: "questionnaire",
  data() {
    return {
      qTypes
    }
  },
  computed: {
    ...mapGetters('user', ['getQuestionnaire']),
    toShowId() {
      return this.getQuestionnaire.toShow.find((qToShow)=> qToShow.startsWith("1."))
    },
    selectedQuestionnaire() {
      return this.qTypes.find((qType)=> qType.id === this.toShowId)
    }
  },
  created() {
    this.validateQuestionnaire()
  },
  methods: {
    ...mapActions('user', ['setQuestionnaire']),
    validateQuestionnaire() {
      const {toShow} = this.getQuestionnaire
      if(!toShow.includes("1.1")) {
        this.$router.push("/questionnaires")
      }
    },
    finishQuestionnaire() {
        const { toShow } = this.getQuestionnaire
        const filteredToShow = toShow.filter((ts) => ts !== '1.1')
        this.setQuestionnaire({toShow: filteredToShow, filled: ["1.1"]})
        if(filteredToShow.length) {
            this.$router.push("/questionnaires")
        } else {
            this.$router.push("/projects")
        }
    }
  }
}
</script>
