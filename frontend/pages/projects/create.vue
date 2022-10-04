<template>
  <form-create v-bind.sync="editedItem" @save="create" />
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import FormCreate from '~/components/project/FormCreate.vue'
import { ProjectWriteDTO } from '~/services/application/project/projectData'

export default Vue.extend({
  components: {
    FormCreate
  },

  layout: 'projects',

  middleware: ['check-auth', 'auth'],

  data() {
    return {
      editedItem: {
        name: '',
        description: '',
        projectType: 'DocumentClassification',
        enableRandomOrder: false,
        enableShareAnnotation: false,
        singleClassClassification: false,
        allowOverlapping: false,
        graphemeMode: false,
        useRelation: false,
        affectiveAnnotationMode: '',
        tags: [] as string[]
      } as ProjectWriteDTO,
      defaultItem: {
        name: '',
        description: '',
        projectType: 'DocumentClassification',
        enableRandomOrder: false,
        enableShareAnnotation: false,
        singleClassClassification: false,
        allowOverlapping: false,
        graphemeMode: false,
        useRelation: false,
        affectiveAnnotationMode: '',
        tags: [] as string[]
      } as ProjectWriteDTO
    }
  },

  methods: {
    async create() {
      const projectItem = this.getProjectItem()
      const project = await this.$services.project.create(projectItem)
      this.$router.push(`/projects/${project.id}`)
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },
    getProjectItem() : any {
      const editedItem : any = _.cloneDeep(this.editedItem)
      if(this.editedItem.affectiveAnnotationMode) {
        editedItem[this.editedItem.affectiveAnnotationMode] = true
      }
      const affectiveAnnotationModes = ['isHumorMode', 'isSummaryMode', 'isEmotionsMode',
        'isOthersMode', 'isOffensiveMode']
      affectiveAnnotationModes.forEach((key: string) => {
        editedItem[key] = editedItem[key] ? editedItem[key] : false
      })
      delete editedItem.affectiveAnnotationMode
      return editedItem
    }
  }
})
</script>
