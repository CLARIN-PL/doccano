<template>
  <v-card>
    <p>
        {{ $t('questionnaires_main.greetings')}}
    </p>
    <p>
        {{ $t('questionnaires_main.greetingsDetail')}}
    </p>

    <v-btn @click="redirect">
        go to questionnaire
    </v-btn>
  </v-card>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex'
import { qCategories } from "~/utils/questionnaires"

export default {
    name: "Questionnaires",
    layout: "questionnaires",
    middleware: ['check-auth', 'auth'],
    data() {
        return {
            qCategories
        }
    },
    computed: {
        ...mapGetters('user', ['getQuestionnaire']),
    },
    methods: {
        ...mapActions('user', ['setQuestionnaire', 'setIsWorkingOnQuestionnaire']),
        redirect() {
            const { toShow } = this.getQuestionnaire
            this.setIsWorkingOnQuestionnaire(true)
            if(toShow.length) {
                const questionnaireId = toShow[0].split(".")[0]
                this.setQuestionnaire({ inProgress: [toShow[0]] })
                const { key } = this.qCategories.find((k)=> k.id === questionnaireId)
                this.$router.push(`/questionnaires/${key}/`)
            }
        }
    }
}
</script>
