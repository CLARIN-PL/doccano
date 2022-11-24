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
            const base = this
            const { toShow } = base.getQuestionnaire
            if(toShow.length) {
                const questionnaireId = toShow[0].split(".")[0]
                base.setQuestionnaire({ inProgress: [toShow[0]], isWorkingNow: true })
                const { key } = base.qCategories.find((k: any)=> k.id === questionnaireId)
                base.$router.push(`/questionnaires/${key}/`)
            }
        }
    }
}
</script>
