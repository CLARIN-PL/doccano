<template>
  <div v-if="type === 'dimension'">
    <form-create-dimension
      ref="formCreateDimension"
      :items="dimensionItems"
      @submit:create="onSubmitCreateDimension"
      @submit:add="onSubmitAddDimension"
    />
  </div>
  <form-create v-else v-slot="slotProps" v-bind.sync="editedItem" :items="items">
    <v-btn :disabled="!slotProps.valid" color="primary" class="text-capitalize" @click="save">
      Save
    </v-btn>

    <v-btn
      :disabled="!slotProps.valid"
      color="primary"
      style="text-transform: none"
      outlined
      @click="saveAndAnother"
    >
      Save and add another
    </v-btn>
  </form-create>
</template>

<script lang="ts">
import Vue from 'vue'
import { LabelDTO } from '~/services/application/label/labelData'
import { DimensionListDTO, DimensionDTO } from '~/services/application/dimension/dimensionData'
import { ProjectDTO } from '~/services/application/project/projectData'
import FormCreate from '~/components/label/FormCreate.vue'
import FormCreateDimension from '~/components/label/FormCreateDimension.vue'

export default Vue.extend({
  components: {
    FormCreate,
    FormCreateDimension
  },

  layout: 'project',

  validate({ params, query, app }) {
    if (!['category', 'span', 'scale', 'relation', 'dimension'].includes(query.type as string)) {
      return false
    }
    if (/^\d+$/.test(params.id)) {
      return app.$services.project.findById(params.id).then((res: ProjectDTO) => {
        return res.canDefineLabel
      })
    }
    return false
  },

  data() {
    return {
      editedItem: {
        text: '',
        prefixKey: null,
        suffixKey: null,
        backgroundColor: '#73D8FF',
        textColor: '#ffffff'
      } as LabelDTO,
      defaultItem: {
        text: '',
        prefixKey: null,
        suffixKey: null,
        backgroundColor: '#73D8FF',
        textColor: '#ffffff'
      } as LabelDTO,
      items: [] as LabelDTO[],
      dimensionItems: [] as DimensionDTO[]
    }
  },

  computed: {
    projectId(): string {
      return this.$route.params.id
    },

    type(): string {
      const type = this.$route.query.type
      return type
    },

    service(): any {
      const type = this.$route.query.type
      if (type === 'category') {
        return this.$services.categoryType
      } else if (type === 'span') {
        return this.$services.spanType
      } else if (type === 'scale') {
        return this.$services.scaleType
      } else {
        return this.$services.relationType
      }
    }
  },

  created() {
    this.setItems()
  },

  methods: {
    async setItems() {
      if (this.type === 'dimension') {
        await this.$services.dimension.list(this.projectId).then((response: DimensionListDTO) => {
          this.dimensionItems = response.items.map((item: DimensionDTO) => {
            const groupMap = {
              DIM_OTH: 'Others',
              DIM_OF: 'Offensive',
              DIM_HUM: 'Humor',
              DIM_EMO: 'Emotions'
            }
            if (item.metadata && item.metadata.length) {
              const codename = item.metadata[0].codename
              for (const [key, value] of Object.entries(groupMap)) {
                if (codename.includes(key)) {
                  item.group = value
                  break
                }
              }

              if (!item.group) {
                item.group = 'Dynamic'
              }
            }
            return item
          })
        })
      } else {
        this.items = await this.service.list(this.projectId)
      }
    },
    async onSubmitCreateDimension({ request, redirect }) {
      await this.$services.dimension.create(
        this.projectId,
        request.name,
        request.type,
        request.dimension_meta_data
      )
      if (redirect) {
        this.$router.push(this.localePath(`/projects/${this.projectId}/labels`))
      }
    },
    async onSubmitAddDimension({ request, redirect }) {
      await this.$services.dimension.assign(this.projectId, request.dimension)
      if (redirect) {
        this.$router.push(this.localePath(`/projects/${this.projectId}/labels`))
      } else {
        this.$refs.formCreateDimension && this.$refs.formCreateDimension.resetForm()
      }
    },
    async save() {
      await this.service.create(this.projectId, this.editedItem)
      this.$router.push(this.localePath(`/projects/${this.projectId}/labels`))
    },

    async saveAndAnother() {
      await this.service.create(this.projectId, this.editedItem)
      this.editedItem = Object.assign({}, this.defaultItem)
      this.items = await this.service.list(this.projectId)
    }
  }
})
</script>
