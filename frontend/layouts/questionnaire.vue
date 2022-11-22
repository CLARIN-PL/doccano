<template>
  <v-app>
    <the-header />
    <v-main>
      <v-container fluid fill-height>
        <v-layout justify-center>
          <v-flex fill-height>
            <nuxt />
          </v-flex>
        </v-layout>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  qCategories,
  getQuestionnaireTypes,
} from "~/utils/questionnaires"

import TheHeader from "~/components/layout/TheHeader.vue"

export default {
    name: "Questionnaire",
    components: {
      TheHeader
    },
    middleware: ['check-auth', 'auth', 'check-questionnaire'],
  data() {
    return {
      qCategories,
      qTypes: getQuestionnaireTypes(),
    }
  },
  computed: {
    ...mapGetters('user', ['getQuestionnaire']),
    toShowCategoryKey() {
      return this.$route.path.split("/")[2]
    },
    qCategoryId() {
      return this.qCategories.find((qCategory)=> qCategory.key === this.toShowCategoryKey).id
    },
    toShowId() {
      return this.getQuestionnaire.toShow.find((qToShow)=> qToShow.startsWith(this.qCategoryId))
    },
    selectedQuestionnaire() {
      return this.qTypes.find((qType)=> qType.id === this.toShowId)
    }
  },
  created() {
    this.validateQuestionnaire()
  },
  methods: {
    validateQuestionnaire() {
      const {toShow} = this.getQuestionnaire
      if(toShow[0] !== this.toShowId) {
        this.$router.push("/questionnaires")
      }
    },
  }
}
</script>

</script>
