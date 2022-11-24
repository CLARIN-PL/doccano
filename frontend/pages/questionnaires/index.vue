<template>
    <div>
        <greeting-card @click="redirect" />
    </div>
</template>

<script lang="ts">
import { mapGetters, mapActions } from 'vuex'
import { qCategories } from "~/utils/questionnaires"
import GreetingCard from "~/components/questionnaires/GreetingCard.vue"

export default {
    name: "Questionnaires",
    layout: "questionnaires",
    middleware: ['check-auth', 'auth'],
    components: {
        GreetingCard
    },
    data() {
        return {
            qCategories
        }
    },
    computed: {
        ...mapGetters('user', ['getQuestionnaire']),
    },
    methods: {
        ...mapActions('user', ['setQuestionnaire']),
        redirect() {
            const { toShow } = this.getQuestionnaire
            if(toShow.length) {
                const questionnaireId = toShow[0].split(".")[0]
                this.setQuestionnaire({ inProgress: [toShow[0]], isWorkingNow: true })
                const { key } = this.qCategories.find((k)=> k.id === questionnaireId)
                this.$router.push(`/questionnaires/${key}/`)
            }
        }
    }
}
</script>
