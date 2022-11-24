<template>
     <v-card>
    <p>
        {{ $t('questionnaires_main.greetings')}}
    </p>
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