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
import TheHeader from '~/components/layout/TheHeader'

export default {
  name: 'Questionnaires',
  components: {
    TheHeader
  },
  middleware: ['check-questionnaire']
}
</script>
