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
        isCombinationMode: false,
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
        isCombinationMode: false,
        tags: [] as string[]
      } as ProjectWriteDTO
    }
  },

  methods: {
    async create() {
      const projectItem = this.getProjectItem()
      const project = await this.$services.project.create(projectItem)
      if(project.projectType === 'AffectiveAnnotation') {
        if (!project.isSummaryMode) {
          await this.uploadScaleTypeFile(project)
        }
      } /*
      this.$router.push(`/projects/${project.id}`)
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
      */
    },
    getProjectItem() : ProjectWriteDTO {
      const editedItem : any = _.cloneDeep(this.editedItem)
      if(this.editedItem.affectiveProjectMode) {
        editedItem[this.editedItem.affectiveProjectMode] = true
      }
      const affectiveProjectModes = ['isHumorMode', 'isSummaryMode', 'isEmotionsMode',
        'isOthersMode', 'isOffensiveMode']
      affectiveProjectModes.forEach((key: string) => {
        const mode = editedItem[key] || false
        editedItem[key] = this.editedItem.isCombinationMode ? false : mode
      })
      delete editedItem.affectiveProjectMode
      return editedItem
    },
    async getBlobScaleData(project: ProjectDTO) {
      let fdata: Blob = new Blob([], {type: 'text/JSON'})
      if(project.isCombinationMode) {
        const paths = {
          isEmotionsMode: '/formats/affective_annotation/affective_emotions_scales.json',
          isOthersMode: '/formats/affective_annotation/affective_emotions_scales.json',
          isHumorMode: '/formats/affective_annotation/affective_humor_scales.json',
          isOffensiveMode: '/formats/affective_annotation/affective_offensive_scales.json'
        }
        const requests = Object.values(paths).map((path)=> fetch(path))
        const responses = await Promise.all(requests)
        const jsonPromises = responses.map(async (response) => await response.json())
        const labels = await Promise.all(jsonPromises)
        const combinedLabels = [...labels.flat()]
        fdata = new Blob([new Uint8Array(combinedLabels)], { type: "application/JSON" })
        console.log(fdata)
      } else {
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
        fdata = await rawData.blob()
        console.log(fdata)
      }
      return fdata
    },
    async uploadScaleTypeFile(project: ProjectDTO) {
      const fdata : Blob = await this.getBlobScaleData(project)
      const fname = "scales.json"
      const fmetadata = { type: "application/JSON" }
      const file = new File([fdata], fname, fmetadata)
      try {
        const projectId = project.id.toString()
        await this.$services.scaleType.upload(projectId, file)
      } catch (e) {
        console.log(e.message)
      }
    }
  }
})
</script>
