<template>
  <v-card>
    <v-card-title v-if="isStaff">
      <v-btn class="text-capitalize" color="primary" @click.stop="$router.push('projects/create')">
        {{ $t('generic.create') }}
      </v-btn>
      <v-btn
        class="text-capitalize ms-2"
        :disabled="!canDelete"
        outlined
        @click.stop="dialogDelete = true"
      >
        {{ $t('generic.delete') }}
      </v-btn>
      <v-dialog v-model="dialogDelete">
        <form-delete :selected="selected" @cancel="dialogDelete = false" @remove="remove" />
      </v-dialog>
    </v-card-title>
    <project-list
      v-model="selected"
      :items="projects.items"
      :is-loading="isLoading"
      :total="projects.count"
      :footer-props="projectListFooterProps"
      @update:query="updateQuery"
    />
    <resting-period-modal v-if="showRestingMessage" :end-time="restingEndTime" />
  </v-card>
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import ProjectList from '@/components/project/ProjectList.vue'
import RestingPeriodModal from '@/components/utils/RestingPeriodModal.vue'
import { ProjectDTO, ProjectListDTO } from '~/services/application/project/projectData'
import FormDelete from '~/components/project/FormDelete.vue'

export default Vue.extend({
  components: {
    FormDelete,
    ProjectList,
    RestingPeriodModal
  },
  layout: 'projects',

  middleware: ['check-auth', 'auth'],

  data() {
    return {
      dialogDelete: false,
      projects: {} as ProjectListDTO,
      selected: [] as ProjectDTO[],
      isLoading: false,
      showRestingMessage: false,
      restingEndTime: new Date(),
    }
  },

  async fetch() {
    await this.getProjectData()
  },

  computed: {
    ...mapGetters('auth', ['isStaff']),
    canDelete(): boolean {
      return this.selected.length > 0
    },
    projectListFooterProps() : any {
      return this.isStaff ? {
        showFirstLastPage: true,
        itemsPerPageOptions: [10, 50, 100]
      } : {
        showFirstLastPage: true,
        itemsPerPageOptions: [100]
      } 
    }
  },

  watch: {
    '$route.query': _.debounce(function () {
      // @ts-ignore
      this.$fetch()
    }, 1000)
  },

  created() {
    this.checkRestingPeriod()
  },

  methods: {
    ...mapActions('auth', ['setRestingPeriod', 'getRestingPeriod']),

    async checkRestingPeriod() {
      const restingEndTime = await this.getRestingPeriod()
      if (restingEndTime === null) {
        this.showRestingMessage = false
      } else {
        this.showRestingMessage = !this.isStaff
        this.restingEndTime = restingEndTime
      }
    },

    async getProjectData() {
      this.isLoading = true
      const projects = await this.$services.project.list(this.$route.query)
      if(this.isStaff) {
        this.projects = _.cloneDeep(projects)
      } else {
        const projectIds = _.flatMap(projects.items, 'id')
        const promises = projectIds.map((projectId)=> this.$services.metrics.fetchMyProgress(projectId))
        await Promise.all(promises).then((results) => {
          results.forEach((result, key)=> {
            projects.items[key].isCompleted = result.complete === result.total
          })
        })
        this.projects = {...projects, ...{
          items: projects.items.filter((projectItem)=> !projectItem.isCompleted)
        }}
      }
      this.isLoading = false
    },

    async remove() {
      await this.$services.project.bulkDelete(this.selected)
      this.$fetch()
      this.dialogDelete = false
      this.selected = []
    },

    updateQuery(query: object) {
      this.$router.push(query)
    }
  }
})
</script>

<style scoped>
::v-deep .v-dialog {
  width: 800px;
}
</style>
