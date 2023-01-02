<template>
  <v-row align="center" justify="center">
    <v-col cols="8" class="mt-10">
      <greeting-card @click="redirect" />
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex'
import { qCategories } from '~/utils/questionnaires'
import GreetingCard from '~/components/questionnaires/GreetingCard.vue'

export default {
  name: 'Questionnaires',
  components: {
    GreetingCard
  },
  layout: 'questionnaires',
  data() {
    return {
      qCategories
    }
  },
  computed: {
    ...mapGetters('user', ['getQuestionnaire'])
  },
  methods: {
    ...mapActions('user', ['setQuestionnaire']),
    redirect() {
      const base: any = this
      const { toShow } = base.getQuestionnaire
      if (toShow.length) {
        const questionnaireId = toShow[0].split('.')[0]
        base.setQuestionnaire({ inProgress: [toShow[0]], isWorkingNow: true })
        const { key } = base.qCategories.find((k: any) => k.id === questionnaireId)
        base.$router.push(base.localePath(`/questionnaires/${key}/`))
      }
    }
  }
}
</script>
