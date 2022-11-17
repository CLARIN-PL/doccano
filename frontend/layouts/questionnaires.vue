<template>
  <v-app>
    <the-header>
      <template #leftDrawerIcon>
        <v-app-bar-nav-icon @click="drawerLeft = !drawerLeft" />
      </template>
    </the-header>

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
import { mapGetters } from 'vuex'
import TheHeader from '~/components/layout/TheHeader'

export default {
  components: {
    TheHeader
  },
  middleware: ['check-auth', 'auth', 'check-admin', 'check-questionnaire'],
  data() {
    return {
      drawerLeft: null,
      isProjectAdmin: false
    }
  },

  computed: {
    ...mapGetters('projects', ['getLink', 'currentProject'])
  },

  async created() {
    this.isProjectAdmin = await this.$services.member.isProjectAdmin(this.$route.params.id)
  }
}
</script>
