<template>
  <form-create v-bind.sync="editedItem" @save="create" />
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import FormCreate from '~/components/project/FormCreate.vue'
import { ProjectDTO, ProjectWriteDTO } from '~/services/application/project/projectData'
import { DimensionDTO } from '~/services/application/dimension/dimensionData'

export default Vue.extend({
  components: {
    FormCreate
  },

  layout: 'projects',

  middleware: ['check-auth', 'auth'],

  data() {
    return {
      dimensions: [] as DimensionDTO[],
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
        affectiveProjectMode: 'isSummaryMode',
        isSingleAnnView: false,
        isCombinationMode: false,
        tags: [] as string[],
        dimension: [] as any[]
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
        affectiveProjectMode: 'isSummaryMode',
        isSingleAnnView: false,
        isCombinationMode: false,
        tags: [] as string[],
        dimension: [] as any[]
      } as ProjectWriteDTO
    }
  },

  async created() {
    await this.setDimensionList()
  },

  methods: {
    async setDimensionList() {
      await this.$services.dimension.listAllDimensions().then((response) => {
        this.dimensions = response.items
      })
    },
    async create() {
      const projectItem = this.getProjectItem()
      console.log(projectItem)
      const project = await this.$services.project.create(projectItem)
      const projectTypesWithAutoUploadScaleTypes = ['AffectiveAnnotation', 'DynamicAnnotation']
      if (projectTypesWithAutoUploadScaleTypes.includes(project.projectType)) {
        if (!project.isSummaryMode) {
          await this.uploadScaleTypeFile(project)
        }
      }
      this.$router.push(this.localePath(`/projects/${project.id}`))
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
      })
    },
    getProjectItem(): ProjectWriteDTO {
      const editedItem: any = _.cloneDeep(this.editedItem)
      if (editedItem.projectType !== 'AffectiveAnnotation') {
        editedItem.affectiveProjectMode = ''
      }

      if (editedItem.affectiveProjectMode) {
        editedItem[editedItem.affectiveProjectMode] = true
      }
      const affectiveProjectModes = [
        'isHumorMode',
        'isSummaryMode',
        'isEmotionsMode',
        'isOthersMode',
        'isOffensiveMode'
      ]
      affectiveProjectModes.forEach((key: string) => {
        const mode = editedItem[key] || false
        editedItem[key] = editedItem.isCombinationMode ? false : mode
      })
      delete editedItem.affectiveProjectMode

      if (editedItem.projectType === 'DynamicAnnotation') {
        const adtDimensions = this.getAdditionalDimensions(editedItem.dimension)
        editedItem.dimension = editedItem.dimension.concat(adtDimensions)
        editedItem.dimension = editedItem.dimension.map((dim: number) => {
          return {
            dimension: [dim]
          }
        })
        editedItem.isCombinationMode = true
      }
      return editedItem
    },
    getAdditionalDimensions(dimensions: number[]) {
      const adtDimensions = []
      const dimensionsWithAdtDimensions = this.dimensions.filter((dim: any) => {
        if (dim && dim.metadata.length) {
          const { config } = dim.metadata[0]
          if (config) {
            const { checkbox_codename } = config
            dim.hasChildren = !!checkbox_codename
            dim.checkbox_codename = checkbox_codename
          }
        }
        return dim.hasChildren
      })
      dimensions.forEach((dim: any) => {
        const adtDimension = dimensionsWithAdtDimensions.find((adt) => adt.id === dim)
        if (adtDimension) {
          const adtDimensionDTO = this.dimensions.find(
            (dim: any) => dim.metadata[0].codename === adtDimension.checkbox_codename
          )
          if (adtDimensionDTO) {
            adtDimensions.push(adtDimensionDTO.id)
          }
        }
      })
      return adtDimensions
    },
    async getBlobScaleData(project: ProjectDTO): Promise<Blob[]> {
      let fdata = [] as Blob[]
      if (project.isCombinationMode) {
        const paths = {
          isEmotionsMode: '/formats/affective_annotation/affective_emotions_scales.json',
          isOthersMode: '/formats/affective_annotation/affective_others_scales.json',
          isHumorMode: '/formats/affective_annotation/affective_humor_scales.json',
          isOffensiveMode: '/formats/affective_annotation/affective_offensive_scales.json'
        }
        const requests = Object.values(paths).map((path) => fetch(path))
        const responses = await Promise.all(requests)
        const blobPromises = responses.map(async (response) => await response.blob())
        const blobs = await Promise.all(blobPromises)
        return [...blobs.flat()]
      } else {
        let selectedFile = ''
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
        fdata = [await rawData.blob()]
      }
      return fdata
    },
    async uploadScaleTypeFile(project: ProjectDTO) {
      const fdatas: Blob[] = await this.getBlobScaleData(project)
      fdatas.forEach(async (fdata, index) => {
        const fname = `scales_${index}.json`
        const fmetadata = { type: 'application/JSON' }
        const file = new File([fdata], fname, fmetadata)
        try {
          const projectId = project.id.toString()
          await this.$services.scaleType.upload(projectId, file)
        } catch (e) {
          console.error(e.message)
        }
      })
    }
  }
})
</script>
