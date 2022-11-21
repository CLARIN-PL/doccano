<template>
  <v-card v-if="selectedQuestionnaire">
    <v-window show-arrows>
    <template v-slot:prev="{ on, attrs }">
      <v-btn
        color="success"
        v-bind="attrs"
        v-on="on"
      >Previous slide</v-btn>
    </template>
    <template v-slot:next="{ on, attrs }">
      <v-btn
        color="info"
        v-bind="attrs"
        v-on="on"
      >Next slide</v-btn>
    </template>
    <v-window-item
      v-for="(n, index) in selectedQuestionnaire.questionnaires"
      :key="`questionnaire-${index}`"
    >
      <v-card
        color="grey"
        height="200"
      >
        <v-row
          class="fill-height"
          align="center"
          justify="center"
        >
          <h1
            style="font-size: 5rem;"
            class="white--text"
          >
            {{ n.title }}
          </h1>
        </v-row>
        <v-btn @click="finishQuestionnaire">Finish questionnaire</v-btn>
      </v-card>
    </v-window-item>
  </v-window>
  </v-card>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  qTypes
} from "./js/questionnaires"

export default {
    name: "PrzedBadaniem",
  data() {
    return {
      qTypes
    }
  },
  computed: {
    ...mapGetters('user', ['getQuestionnaire']),
    toShowId() {
      return this.getQuestionnaire.toShow.find((qToShow)=> qToShow.startsWith("4."))
    },
    selectedQuestionnaire() {
      return this.qTypes.find((qType)=> qType.id === this.toShowId)
    }
  },
  methods: {
    ...mapActions('user', ['setQuestionnaire']),
    finishQuestionnaire() {
        // to delete later 
        const { toShow } = this.getQuestionnaire
        const filteredToShow = toShow.filter((ts) => ts !== this.selectedQuestionnaire.id)
        this.setQuestionnaire({toShow: filteredToShow})
        if(filteredToShow.length) {
            this.$router.push("/questionnaires")
        } else {
            this.$router.push("/projects")
        }
    }
  }
}
</script>
