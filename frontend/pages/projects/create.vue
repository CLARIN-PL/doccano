<template>
  <form-create v-bind.sync="editedItem" @save="create" />
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import FormCreate from '~/components/project/FormCreate.vue'
import { ProjectDTO, ProjectWriteDTO } from '~/services/application/project/projectData'

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
        affectiveProjectMode: '',
        isSingleAnnView: false,
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
        affectiveProjectMode: '',
        isSingleAnnView: false,
        tags: [] as string[]
      } as ProjectWriteDTO
    }
  },

  methods: {
    async create() {
      const projectItem = this.getProjectItem()
      const project = await this.$services.project.create(projectItem)

      if (project.isEmotionsMode || project.isOthersMode || project.isOffensiveMode|| project.isHumorMode) {
        await this.importScaleTypeFile(project)
      }

      this.$router.push(`/projects/${project.id}`)
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },
    getProjectItem() : ProjectWriteDTO {
      const editedItem : any = _.cloneDeep(this.editedItem)
      if(this.editedItem.affectiveProjectMode) {
        editedItem[this.editedItem.affectiveProjectMode] = true
      }
      const affectiveProjectModes = ['isHumorMode', 'isSummaryMode', 'isEmotionsMode',
        'isOthersMode', 'isOffensiveMode']
      affectiveProjectModes.forEach((key: string) => {
        editedItem[key] = editedItem[key] ? editedItem[key] : false
      })
      delete editedItem.affectiveProjectMode
      return editedItem
    },
    async importScaleTypeFile(project: ProjectDTO) {
      const projectId = project.id.toString()
      let selectedFile = ""
      if (project.isEmotionsMode) {
        selectedFile = '/formats/affective_annotation/affective_emotions_scales.json'
      }
      if (project.isOthersMode) {
        selectedFile = '/formats/affective_annotation/affective_others_scales.json'
      }
      if (project.isOffensiveMode) {
        selectedFile = '/formats/affective_annotation/affective_offensive_scales.json'
      }
      if (project.isHumorMode) {
        selectedFile = '/formats/affective_annotation/affective_humor_scales.json'
      }
      const rawData = await fetch(selectedFile)
      const fdata = await rawData.blob()
      const fname = "scales.json"
      const fmetadata = { type: "application/JSON" }
      const file = new File([fdata], fname, fmetadata)
      try {
        await this.$services.scaleType.upload(projectId, file)
      } catch (e) {
        console.log(e.message)
      }
    }
  }
})
</script>
