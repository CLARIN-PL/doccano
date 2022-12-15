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
    <big-number-card
      v-if="!isStaff"
      :label="$t('statistics.totalTextsAnnotated')"
      :value="totalTextsAnnotated"
    />
    <project-list
      v-model="selected"
      :items="projects.items"
      :is-loading="isLoading"
      :total="projects.count"
      :show-select="isStaff"
      @update:query="updateQuery"
    />
    <p v-if="!isStaff" class="warning-text">
      {{ $t('generic.onlyDisplayCompletedProject', { number: projects.items.length }) }}
    </p>
    <resting-period-modal v-if="showRestingMessage" :end-time="restingEndTime" />
  </v-card>
</template>

<script lang="ts">
import _ from 'lodash'
import moment from 'moment'
import Vue from 'vue'
import { mapGetters, mapActions } from 'vuex'
import ProjectList from '@/components/project/ProjectList.vue'
import RestingPeriodModal from '@/components/utils/RestingPeriodModal.vue'
import BigNumberCard from '@/components/utils/BigNumberCard.vue'
import { MyProgress, MyProgressList } from '~/domain/models/metrics/metrics'
import { ProjectDTO, ProjectListDTO } from '~/services/application/project/projectData'
import FormDelete from '~/components/project/FormDelete.vue'
import { DATE_FORMAT_DDMMYYYY, DATETIME_FORMAT_DDMMYYYYHHMMSS } from '~/settings'

export default Vue.extend({
  name: 'Projects',
  components: {
    FormDelete,
    ProjectList,
    RestingPeriodModal,
    BigNumberCard
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
      restingEndTime: '',
      totalTextsAnnotated: 0
    }
  },

  async fetch() {
    await this.getProjectData()
    await this.setQuestionnaireFilledDate()
  },

  computed: {
    ...mapGetters('auth', ['isStaff']),
    ...mapGetters('user', ['getQuestionnaire', 'getRest']),
    canDelete(): boolean {
      return this.selected.length > 0
    }
  },

  watch: {
    '$route.query': _.debounce(function () {
      // @ts-ignore
      this.$fetch()
    }, 1000)
  },

  async created() {
    await this.toggleRestingModal()
  },

  mounted() {
    this.checkRestingPeriod()
  },

  methods: {
    ...mapActions('user', [
      'canClearRestingPeriod',
      'setProject',
      'setQuestionnaire',
      'initQuestionnaire'
    ]),

    async toggleRestingModal() {
      const { endTime } = this.getRest
      const canClearRestingPeriod = await this.canClearRestingPeriod()
      if (canClearRestingPeriod) {
        this.showRestingMessage = false
        this.restingEndTime = ''
      } else {
        this.showRestingMessage = !this.isStaff && !this.getQuestionnaire.toShow.length
        this.restingEndTime = moment(endTime).format(DATETIME_FORMAT_DDMMYYYYHHMMSS)
      }
    },
    checkRestingPeriod() {
      if (this.restingEndTime) {
        setInterval(function () {
          const hasPassed = new Date() > this.restingEndTime
          hasPassed && this.hideRestingModal()
        }, 1000)
      }
    },
    countTotalTextsAnnotated(progressList: MyProgressList) {
      try {
        this.totalTextsAnnotated = progressList.results.reduce(
          (subtotal, prog: MyProgress) => subtotal + prog.complete,
          0
        )
      } catch {
        this.totalTextsAnnotated = 0
      }
    },

    setCurrentlyAllowedProjectId(progressList: MyProgressList) {
      const progress = progressList.results.find(
        (projectProgress: MyProgress) => projectProgress.remaining > 0
      )
      const nextProjectIdToAnnotate = progress?.project_id || -1
      this.setProject({
        currentlyAllowedProjectId: nextProjectIdToAnnotate
      })
    },

    async getProjectData() {
      this.isLoading = true
      const projects = await this.$services.project.list(this.$route.query)
      let items = projects.items
      if (this.isStaff) {
        this.projects = _.cloneDeep(projects)
      } else {
        const progresses = await this.$services.metrics.fetchMyProgresses()
        this.countTotalTextsAnnotated(progresses)
        this.setCurrentlyAllowedProjectId(progresses)
        items = projects.items.map((projectItem: ProjectDTO) => {
          const progress = progresses.results.find(
            (prog: MyProgress) => prog.project_id === projectItem.id
          )
          projectItem.isCompleted = progress && progress.total > 0 ? progress.remaining === 0 : true
          return projectItem
        })
        const incompleteProjectItems = items.filter((projectItem) => !projectItem.isCompleted)
        this.projects = {
          ...projects,
          ...{
            items: incompleteProjectItems
          }
        }
      }
      const completedProjectsCount = items.filter((item: ProjectDTO) => item.isCompleted).length
      const hasFinishedAll = this.projects.items.length === 0
      this.setProject({ hasFinishedAll, completedProjectsCount })
      this.isLoading = false
    },

    async setQuestionnaireFilledDate() {
      const questionnaireStates = await this.$services.questionnaire.listFinishedQuestionnaires({
        questionnaireTypeId: 1,
        limit: 1
      })
      if (questionnaireStates && questionnaireStates.items.length > 0) {
        const firstQuestionnaireEver = questionnaireStates.items[0].finishedAt
        const firstQuestionnaireFilledDate = moment(String(firstQuestionnaireEver)).format(
          DATE_FORMAT_DDMMYYYY
        )
        this.setQuestionnaire({
          firstQuestionnaireFilledDate
        })
      }
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
  font-size: 0.7rem;
  word-break: break-word;
}
</style>
