<template>
  <div>
    show the message 
    <ul>
        <li></li>
    </ul>
    <v-btn @click="redirect">
        go to questionnaire
    </v-btn>
  </div>
</template>

<script lang="ts">

import {mapGetters} from 'vuex'
import {questionnaires} from "~/utils/questionnaire"

export default {
    name: "Questionnaire",
    middleware: ['check-auth', 'auth'],
    computed: {
        ...mapGetters('user', ['getQuestionnaire']),
    },
    methods: {
        redirect() {
            const { toShow } = this.getQuestionnaire
            if(toShow.length) {
                const questionnaireId = toShow[0].split(".")[0]
                const {key} = questionnaires.find((k)=> k.id === questionnaireId)
                this.$router.push(`/questionnaires/${key}`)
            }
        }
    }
}
</script>
