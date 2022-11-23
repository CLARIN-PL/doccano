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
      :show-select="isStaff"
      @update:query="updateQuery"
    />
    <p v-if="!isStaff" class="warning-text" >
        {{ $t('generic.onlyDisplayCompletedProject', { number: projects.items.length }) }}
    </p>
    <resting-period-modal v-if="showRestingMessage" :end-time="restingEndTime" />
  </v-card>
</template>

<script lang="ts">
import _ from 'lodash'
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import ProjectList from '@/components/project/ProjectList.vue'
import RestingPeriodModal from '@/components/utils/RestingPeriodModal.vue'
import { MyProgress, MyProgressList } from '~/domain/models/metrics/metrics'
import { ProjectDTO, ProjectListDTO } from '~/services/application/project/projectData'
import FormDelete from '~/components/project/FormDelete.vue'

export default Vue.extend({
  components: {
    FormDelete,
    ProjectList,
    RestingPeriodModal
  },
  layout: 'projects',

  middleware: ['check-auth', 'auth', 'check-questionnaire'],

  data() {
    return {
      dialogDelete: false,
      projects: {
        items: [] as ProjectDTO[]
      } as ProjectListDTO,
      selected: [] as ProjectDTO[],
      isLoading: false,
      showRestingMessage: false,
      restingEndTime: "",
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
    ...mapActions('user', ['setRestingPeriod', 'calculateRestingPeriod', 
      'setCurrentlyAllowedProjectId', 'setProject']),
    async checkRestingPeriod() {
      const restingEndTime = await this.calculateRestingPeriod()
      if (restingEndTime === null) {
        this.showRestingMessage = false
        this.restingEndTime = ""
      } else {
        this.showRestingMessage = !this.isStaff
        this.restingEndTime = restingEndTime
      }
    },

    findNextProjectIdToAnnotate(progressList: MyProgressList) {
      try {
        const progress = progressList.results.find((projectProgress: MyProgress)=> projectProgress.remaining > 0)
        const nextProjectIdToAnnotate = progress?.project_id || -1
        this.setCurrentlyAllowedProjectId(nextProjectIdToAnnotate)
      } catch {
        this.setCurrentlyAllowedProjectId(-1)
      }
    },

    async getProjectData() {
      this.isLoading = true
      const projects = await this.$services.project.list(this.$route.query)
      if(this.isStaff) {
        this.projects = _.cloneDeep(projects)
      } else {
        const progresses = await this.$services.metrics.fetchMyProgresses()
        this.findNextProjectIdToAnnotate(progresses)
        const items = projects.items.map((projectItem: ProjectDTO)=> {
            const progress = progresses.results.find((prog: MyProgress)=> prog.project_id === projectItem.id)
            projectItem.isCompleted = progress && progress.total > 0  ?  progress.remaining === 0 : true
            return projectItem
          }).filter((projectItem)=> !projectItem.isCompleted)
        this.projects = {...projects, ...{
          items,
        }}
        const hasFinishedAll = items.length === 0
        this.setProject({hasFinishedAll})
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

.warning-text {
  padding: 10px 10px 20px;
  text-align: right;
  color: red;
  font-size: .7rem;
  word-break: break-word;
}
</style>
