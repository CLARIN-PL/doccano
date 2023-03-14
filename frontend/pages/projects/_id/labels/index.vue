<template>
  <v-card>
    <v-tabs v-if="hasMultiType" v-model="tab">
      <template v-if="isIntentDetectionAndSlotFilling">
        <v-tab class="text-capitalize">Category</v-tab>
        <v-tab class="text-capitalize">Span</v-tab>
      </template>
      <template v-else-if="isArticleAnnotation">
        <v-tab class="text-capitalize">Category</v-tab>
        <v-tab class="text-capitalize">Span</v-tab>
        <v-tab v-if="project.useRelation" class="text-capitalize">Relation</v-tab>
      </template>
      <template v-else-if="isDynamicAnnotation">
        <v-tab class="text-capitalize">Category</v-tab>
        <v-tab class="text-capitalize">Span</v-tab>
        <v-tab class="text-capitalize">Scale</v-tab>
        <v-tab class="text-capitalize">Dimensions</v-tab>
        <v-tab v-if="project.useRelation" class="text-capitalize">Relation</v-tab>
      </template>
      <template v-else-if="isAffectiveAnnotation">
        <v-tab class="text-capitalize">Category</v-tab>
        <v-tab class="text-capitalize">Span</v-tab>
        <v-tab class="text-capitalize">Scale</v-tab>
        <v-tab v-if="project.useRelation" class="text-capitalize">Relation</v-tab>
      </template>
      <template v-else>
        <v-tab class="text-capitalize">Span</v-tab>
        <v-tab class="text-capitalize">Relation</v-tab>
      </template>
    </v-tabs>
    <v-card-title>
      <action-menu
        @create="$router.push('labels/add?type=' + labelType)"
        @upload="$router.push('labels/import?type=' + labelType)"
        @download="download"
      />
      <v-btn
        v-if="showDeleteButton"
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
    <div v-if="isDynamicAnnotation && tab == 3">
      <dimension-list
        v-model="selected"
        :items="dimensionItems"
        :is-loading="isLoading"
        @edit="editDimensionItem"
      />
    </div>
    <div v-else>
      <label-list v-model="selected" :items="items" :is-loading="isLoading" @edit="editItem" />
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import ActionMenu from '@/components/label/ActionMenu.vue'
import FormDelete from '@/components/label/FormDelete.vue'
import LabelList from '@/components/label/LabelList.vue'
import DimensionList from '@/components/label/DimensionList.vue'
import { DimensionDTO, DimensionListDTO } from '~/services/application/dimension/dimensionData'

import { LabelDTO } from '~/services/application/label/labelData'
import { ProjectDTO } from '~/services/application/project/projectData'

export default Vue.extend({
  components: {
    ActionMenu,
    FormDelete,
    LabelList,
    DimensionList
  },
  layout: 'project',

  validate({ params, app }) {
    if (/^\d+$/.test(params.id)) {
      return app.$services.project.findById(params.id).then((res: ProjectDTO) => {
        return res.canDefineLabel
      })
    }
    return false
  },

  data() {
    return {
      dialogDelete: false,
      items: [] as LabelDTO[],
      dimensionItems: [] as DimensionDTO[],
      selected: [] as LabelDTO[],
      isLoading: false,
      tab: 0,
      project: {} as ProjectDTO
    }
  },

  computed: {
    showDeleteButton(): boolean {
      return !(this.isDynamicAnnotation && this.tab === 3)
    },
    canDelete(): boolean {
      return this.selected.length > 0
    },

    projectId(): string {
      return this.$route.params.id
    },

    hasMultiType(): boolean {
      if ('projectType' in this.project) {
        return (
          this.isIntentDetectionAndSlotFilling ||
          this.isArticleAnnotation ||
          this.isAffectiveAnnotation ||
          this.isDynamicAnnotation ||
          !!this.project.useRelation
        )
      } else {
        return false
      }
    },

    isIntentDetectionAndSlotFilling(): boolean {
      return this.project.projectType === 'IntentDetectionAndSlotFilling'
    },

    isArticleAnnotation(): boolean {
      return this.project.projectType === 'ArticleAnnotation'
    },

    isAffectiveAnnotation(): boolean {
      return this.project.projectType === 'AffectiveAnnotation'
    },

    isDynamicAnnotation(): boolean {
      return this.project.projectType === 'DynamicAnnotation'
    },

    isDynamicAnnotation(): boolean {
      return this.project.projectType === 'DynamicAnnotation'
    },

    labelType(): string {
      if (this.hasMultiType) {
        if (this.isIntentDetectionAndSlotFilling) {
          return ['category', 'span'][this.tab!]
        } else if (this.isArticleAnnotation) {
          return ['category', 'span', 'relation'][this.tab!]
        } else if (this.isAffectiveAnnotation) {
          return ['category', 'span', 'scale', 'relation'][this.tab!]
        } else if (this.isDynamicAnnotation) {
          return ['category', 'span', 'scale', 'dimension'][this.tab!]
        } else {
          return ['span', 'relation'][this.tab!]
        }
      } else if (this.project.projectType.endsWith('Classification')) {
        return 'category'
      } else {
        return 'span'
      }
    },

    service(): any {
      if (!('projectType' in this.project)) {
        return
      }
      if (this.hasMultiType) {
        if (this.isIntentDetectionAndSlotFilling) {
          return [this.$services.categoryType, this.$services.spanType][this.tab!]
        } else if (this.isArticleAnnotation) {
          return [
            this.$services.categoryType,
            this.$services.spanType,
            this.$services.relationType
          ][this.tab!]
        } else if (this.isAffectiveAnnotation) {
          return [
            this.$services.categoryType,
            this.$services.spanType,
            this.$services.scaleType,
            this.$services.relationType
          ][this.tab!]
        } else if (this.isDynamicAnnotation) {
          return [
            this.$services.categoryType,
            this.$services.spanType,
            this.$services.scaleType,
            this.$services.relationType,
            []
          ][this.tab!]
        } else {
          return [this.$services.spanType, this.$services.relationType][this.tab!]
        }
      } else if (this.project.projectType.endsWith('Classification')) {
        return this.$services.categoryType
      } else {
        return this.$services.spanType
      }
    }
  },

  watch: {
    tab() {
      this.list()
    }
  },

  async created() {
    this.project = await this.$services.project.findById(this.projectId)
    await this.list()
  },

  methods: {
    async list() {
      this.isLoading = true
      this.items = await this.service.list(this.projectId)
      if (this.isDynamicAnnotation && this.tab === 3) {
        await this.$services.dimension.list(this.projectId).then((response: DimensionListDTO) => {
          console.log(response.items)
          this.dimensionItems = response.items.map((item: any) => {
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
      }
      this.isLoading = false
    },

    async remove() {
      await this.service.bulkDelete(this.projectId, this.selected)
      this.list()
      this.dialogDelete = false
      this.selected = []
    },

    async download() {
      await this.service.export(this.projectId)
    },

    editItem(item: LabelDTO) {
      this.$router.push(`labels/${item.id}/edit?type=${this.labelType}`)
    },

    editDimensionItem(item: LabelDTO) {
      this.$router.push(`labels/${item.id}/edit?type=dimension`)
    }
  }
})
</script>

<style scoped>
::v-deep .v-dialog {
  width: 800px;
}
</style>
