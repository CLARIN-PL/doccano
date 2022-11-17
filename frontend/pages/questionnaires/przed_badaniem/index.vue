<template>
  <v-card>
    // przed badaniem
    // load the survey here
    // make sure everything is oke
    // then finish
    <v-btn @click="finishQuestionnaire">Finish questionnaire</v-btn>
  </v-card>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'

export default {
    name: "PrzedBadaniem",
  computed: {
    ...mapGetters('user', ['getQuestionnaire']),
    ...mapActions('user', ['setQuestionnaire'])
  },
  methods: {
    finishQuestionnaire() {
        const { toShow } = this.getQuestionnaire
        const filteredToShow = toShow.filter((ts) => ts !== '1.1')
        this.setQuestionnaire(filteredToShow)
        if(filteredToShow.length) {
            this.$router.push("/questionnaires")
        } else {
            this.$router.push("/projects")
        }
    }
  }
}
</script>
