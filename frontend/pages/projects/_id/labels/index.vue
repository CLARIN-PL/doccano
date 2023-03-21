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
        <v-tab class="text-capitalize">{{ $t('labels.scale') }}</v-tab>
        <v-tab class="text-capitalize">{{ $t('labels.dimensions') }}</v-tab>
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
        v-if="!isDimensionsTab"
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
    <div v-if="isDynamicAnnotation && tab == 1">
      <dimension-list v-model="selected" :items="dimensionItems" :is-loading="isLoading" />
    </div>
    <div v-else>
      <label-list v-model="selected" :items="items" :is-loading="isLoading" @edit="editItem" />
    </div>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import ActionMenu from '@/components/label/ActionMenu.vue'
import FormDelete from '@/components/label/FormDelete.vue'
import LabelList from '@/components/label/LabelList.vue'
import DimensionList from '@/components/label/DimensionList.vue'
import { DimensionDTO } from '~/services/application/dimension/dimensionData'

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
      isLoadingAddPage: false,
      tab: 0,
      project: {} as ProjectDTO
    }
  },

  computed: {
    ...mapGetters('projects', ['currentDimensions']),
    isDimensionsTab(): boolean {
      return this.isDynamicAnnotation && this.tab === 1
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

    labelType(): string {
      if (this.hasMultiType) {
        if (this.isIntentDetectionAndSlotFilling) {
          return ['category', 'span'][this.tab!]
        } else if (this.isArticleAnnotation) {
          return ['category', 'span', 'relation'][this.tab!]
        } else if (this.isAffectiveAnnotation) {
          return ['category', 'span', 'scale', 'relation'][this.tab!]
        } else if (this.isDynamicAnnotation) {
          return ['scale', 'dimension'][this.tab!]
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
          return [this.$services.scaleType, this.$services.dimension][this.tab!]
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
    ...mapActions('projects', ['setCurrentDimensions']),
    async list() {
      this.isLoading = true
      let items = this.isDimensionsTab ? this.currentDimensions : []
      if (!items.length) {
        const response = await this.service.list(this.projectId)
        items = response.items ? response.items : response
      }
      if (items) {
        this.items = _.cloneDeep(items)
        this.isDimensionsTab && this.setCurrentDimensions(items)
      }
      this.$nextTick(() => {
        if (this.isDimensionsTab) {
          this.dimensionItems = items.map((item: any) => {
            const groupMap: any = {
              DIM_OTH: 'Others',
              DIM_OF: 'Offensive',
              DIM_HUM: 'Humor',
              DIM_EMO: 'Emotions'
            }
            if (item.metadata && item.metadata.length) {
              const { codename } = item.metadata[0]
              const groupMapKey: string =
                Object.keys(groupMap).find((key) => codename.includes(key)) || ''
              item.group = groupMap[groupMapKey] || 'Dynamic'
            }
            if (item.type === 'checkbox') {
              item.value = false
            }
            return item
          })
        }
      })
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
    }
  }
})
</script>

<style scoped>
::v-deep .v-dialog {
  width: 800px;
}
</style>
