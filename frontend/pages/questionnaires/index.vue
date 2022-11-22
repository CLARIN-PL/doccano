<template>
  <v-card style="margin: 100px" >
    <v-btn @click="redirect">
        go to questionnaire
    </v-btn>
  </v-card>
</template>

<script lang="ts">
import { mapGetters} from 'vuex'
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
