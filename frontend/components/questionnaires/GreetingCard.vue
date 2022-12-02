<template>
    <v-card class="greeting-card">
        <h3>
            {{ $t('questionnaires_main.greetings')}}
        </h3>
        <p>
            {{ $t('questionnaires_main.greetingsDetail')}}
        </p>
        <v-btn @click="onStartButtonClick">
            Start
        </v-btn>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    methods: {
        onStartButtonClick() {
            this.$emit("click")
        }
    }
})
</script>

<style lang="scss">
.greeting-card {
    padding: 20px;
}
</style>
