<template>
  <v-card style="margin: 100px" >
    <v-btn @click="redirect">
        go to questionnaire
    </v-btn>
  </v-card>
</template>

<script lang="ts">

import {mapGetters} from 'vuex'
import { qCategories } from "~/utils/questionnaires"

export default {
    name: "Questionnaire",
    middleware: ['check-auth', 'auth'],
    computed: {
        ...mapGetters('user', ['getQuestionnaire']),
    },
    data() {
        return {
            qCategories
        }
    },
    methods: {
        redirect() {
            const { toShow } = this.getQuestionnaire
            if(toShow.length) {
                const questionnaireId = toShow[0].split(".")[0]
                const { key } = this.qCategories.find((k)=> k.id === questionnaireId)
                this.$router.push(`/questionnaires/${key}/`)
            }
        }
    }
}
</script>
