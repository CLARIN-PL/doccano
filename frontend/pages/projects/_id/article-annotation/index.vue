<template>
  <layout-text v-if="doc.id" v-shortkey="shortKeysSpans" @shortkey="changeSelectedLabel">
    <template #header>
      <toolbar-laptop
        :doc-id="doc.id"
        :enable-auto-labeling.sync="enableAutoLabeling"
        :guideline-text="project.guideline"
        :is-reviewd="doc.isConfirmed"
        :total="docs.count"
        :is-article-project="true"
        :article-index="articleIndex"
        :article-total="articleTotal"
        class="d-none d-sm-block"
        @click:clear-label="clear"
        @click:review="confirm"
      >
        <v-btn-toggle v-model="labelOption" mandatory class="ms-2">
          <v-btn icon>
            <v-icon>{{ mdiFormatListBulleted }}</v-icon>
          </v-btn>
          <v-btn icon>
            <v-icon>{{ mdiText }}</v-icon>
          </v-btn>
        </v-btn-toggle>
      </toolbar-laptop>
      <toolbar-mobile :total="docs.count" class="d-flex d-sm-none" />
    </template>
    <template #content>
      <div>
        <v-row class="mt-3" no-gutters>
          <v-col cols="6">
            <div id="viewer_component_placeholder" style="overflow-wrap: break-word;">
              <h3 class="mt-3">Whole Article Viewer Component Here</h3>
              <h3 class="mt-3">Article Title: {{ doc.meta.meta.article_title }}</h3>
              <p class="mt-3">Article ID: {{ currentArticleId }}</p>
              <p class="mt-3">{{ currentWholeArticleView }}</p>
            </div>
          </v-col>
          <v-col cols="6">
            <v-card v-shortkey="shortKeysCategory" @shortkey="addOrRemoveCategory">
              <v-card-title>
                  <label-group
                    v-if="labelOption === 0"
                    :labels="categoryTypes"
                    :annotations="categories"
                    :single-label="project.singleClassClassification"
                    @add="addCategory"
                    @remove="removeCategory"
                  />
                  <label-select
                    v-else
                    :labels="categoryTypes"
                    :annotations="categories"
                    :single-label="project.singleClassClassification"
                    @add="addCategory"
                    @remove="removeCategory"
                  />
              </v-card-title>
              <div class="annotation-text pa-4">
                <entity-editor
                  :dark="$vuetify.theme.dark"
                  :rtl="isRTL"
                  :text="doc.text"
                  :entities="spans"
                  :entity-labels="spanTypes"
                  :relations="relations"
                  :relation-labels="relationTypes"
                  :allow-overlapping="project.allowOverlapping"
                  :grapheme-mode="project.graphemeMode"
                  :selected-label="selectedLabel"
                  :relation-mode="relationMode"
                  @addEntity="addSpan"
                  @addRelation="addRelation"
                  @click:entity="updateSpan"
                  @click:relation="updateRelation"
                  @contextmenu:entity="deleteSpan"
                  @contextmenu:relation="deleteRelation"
                />
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </template>
    <template #sidebar>
      <annotation-progress :progress="progress" />
      <v-card class="mt-4">
        <v-card-title>Label Types</v-card-title>
        <v-card-text>
          <v-switch v-if="useRelationLabeling" v-model="relationMode">
            <template #label>
              <span v-if="relationMode">Relation</span>
              <span v-else>Span</span>
            </template>
          </v-switch>
          <v-chip-group v-model="selectedLabelIndex" column>
            <v-chip
              v-for="(item, index) in labelTypes"
              :key="item.id"
              v-shortkey="[item.suffixKey]"
              :color="item.backgroundColor"
              filter
              :text-color="$contrastColor(item.backgroundColor)"
              @shortkey="selectedLabelIndex = index"
            >
              {{ item.text }}
              <v-avatar
                v-if="item.suffixKey"
                right
                color="white"
                class="black--text font-weight-bold"
              >
                {{ item.suffixKey }}
              </v-avatar>
            </v-chip>
          </v-chip-group>
        </v-card-text>
      </v-card>
      <list-metadata :metadata="doc.meta" class="mt-4" />
    </template>
  </layout-text>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'
import { mdiText, mdiFormatListBulleted } from '@mdi/js'
import LabelGroup from '@/components/tasks/textClassification/LabelGroup'
import LabelSelect from '@/components/tasks/textClassification/LabelSelect'
import LayoutText from '@/components/tasks/layout/LayoutText'
import ListMetadata from '@/components/tasks/metadata/ListMetadata'
import ToolbarLaptop from '@/components/tasks/toolbar/ToolbarLaptop'
import ToolbarMobile from '@/components/tasks/toolbar/ToolbarMobile'
import EntityEditor from '@/components/tasks/sequenceLabeling/EntityEditor.vue'
import AnnotationProgress from '@/components/tasks/sidebar/AnnotationProgress.vue'

export default {
  components: {
    AnnotationProgress,
    EntityEditor,
    LayoutText,
    ListMetadata,
    ToolbarLaptop,
    ToolbarMobile,
    LabelGroup,
    LabelSelect
  },

  layout: 'workspace',

  validate({ params, query }) {
    return /^\d+$/.test(params.id) && /^\d+$/.test(query.page)
  },

  data() {
    return {
      mdiText,
      mdiFormatListBulleted,
      docs: [],
      spans: [],
      spanTypes: [],
      relations: [],
      relationTypes: [],
      categories: [],
      categoryTypes: [],
      labelOption: 0,
      project: {},
      enableAutoLabeling: false,
      rtl: false,
      selectedLabelIndex: null,
      progress: {},
      relationMode: false,
      articleTotal: 1,
      articleIndex: 1,
      currentArticleId: "",
      currentWholeArticle: []
    }
  },

  async fetch() {
    this.docs = await this.$services.example.fetchOne(
      this.projectId,
      this.$route.query.page,
      this.$route.query.q,
      this.$route.query.isChecked
    )
    const doc = this.docs.items[0]
    if (this.enableAutoLabeling && !doc.isConfirmed) {
      await this.autoLabel(doc.id)
    }
    await this.list(doc.id)

    this.currentArticleId = doc.articleId
    this.currentWholeArticle = await this.$services.example.fetchByLimit(
      this.projectId,
      this.docs.count.toString(),
      this.currentArticleId,
      this.$route.query.isChecked
    )
    const allArticleIds = await this.$services.example.fetchArticleIds(
      this.projectId,
      this.docs.count.toString()
    )
    this.articleTotal = allArticleIds.length
    this.articleIndex = allArticleIds.indexOf(this.currentArticleId) + 1
  },

  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'getUsername', 'getUserId']),
    ...mapGetters('config', ['isRTL']),

    shortKeysSpans() {
      return Object.fromEntries(this.spanTypes.map((item) => [item.id, [item.suffixKey]]))
    },

    shortKeysCategory() {
      return Object.fromEntries(this.categoryTypes.map((item) => [item.id, [item.suffixKey]]))
    },

    projectId() {
      return this.$route.params.id
    },

    doc() {
      if (_.isEmpty(this.docs) || this.docs.items.length === 0) {
        return {}
      } else {
        return this.docs.items[0]
      }
    },

    selectedLabel() {
      if (Number.isInteger(this.selectedLabelIndex)) {
        if (this.relationMode) {
          return this.relationTypes[this.selectedLabelIndex]
        } else {
          return this.spanTypes[this.selectedLabelIndex]
        }
      } else {
        return null
      }
    },

    useRelationLabeling() {
      return !!this.project.useRelation
    },

    labelTypes() {
      if (this.relationMode) {
        return this.relationTypes
      } else {
        return this.spanTypes
      }
    },

    currentWholeArticleView() {
      return JSON.stringify(this.currentWholeArticle)
    }
  },

  watch: {
    '$route.query': '$fetch',
    enableAutoLabeling(val) {
      if (val) {
        this.list(this.doc.id)
      }
    }
  },

  async created() {
    this.categoryTypes = await this.$services.categoryType.list(this.projectId)
    this.spanTypes = await this.$services.spanType.list(this.projectId)
    this.relationTypes = await this.$services.relationType.list(this.projectId)
    this.project = await this.$services.project.findById(this.projectId)
    this.progress = await this.$services.metrics.fetchMyProgress(this.projectId)
  },

  methods: {
    async maybeFetchSpanTypes(spans) {
      const labelIds = new Set(this.spanTypes.map((label) => label.id))
      if (spans.some((item) => !labelIds.has(item.label))) {
        this.spanTypes = await this.$services.spanType.list(this.projectId)
      }
    },
    async list(docId) {
      const spans = await this.$services.sequenceLabeling.list(this.projectId, docId)
      const relations = await this.$services.sequenceLabeling.listRelations(this.projectId, docId)
      // In colab mode, if someone add a new label and annotate data
      // with the label during your work, it occurs exception
      // because there is no corresponding label.
      await this.maybeFetchSpanTypes(spans)
      this.spans = spans
      this.relations = relations
      this.categories = await this.$services.textClassification.list(this.projectId, docId)
    },

    async deleteSpan(id) {
      await this.$services.sequenceLabeling.delete(this.projectId, this.doc.id, id)
      await this.list(this.doc.id)
    },

    async addSpan(startOffset, endOffset, labelId) {
      await this.$services.sequenceLabeling.create(
        this.projectId,
        this.doc.id,
        labelId,
        startOffset,
        endOffset
      )
      await this.list(this.doc.id)
    },

    async updateSpan(annotationId, labelId) {
      await this.$services.sequenceLabeling.changeLabel(
        this.projectId,
        this.doc.id,
        annotationId,
        labelId
      )
      await this.list(this.doc.id)
    },

    async addRelation(fromId, toId, typeId) {
      await this.$services.sequenceLabeling.createRelation(
        this.projectId,
        this.doc.id,
        fromId,
        toId,
        typeId
      )
      await this.list(this.doc.id)
    },

    async updateRelation(relationId, typeId) {
      await this.$services.sequenceLabeling.updateRelation(
        this.projectId,
        this.doc.id,
        relationId,
        typeId
      )
      await this.list(this.doc.id)
    },
    async deleteRelation(relationId) {
      await this.$services.sequenceLabeling.deleteRelation(this.projectId, this.doc.id, relationId)
      await this.list(this.doc.id)
    },
    async removeCategory(id) {
      await this.$services.textClassification.delete(this.projectId, this.doc.id, id)
      await this.list(this.doc.id)
    },
    async addCategory(labelId) {
      await this.$services.textClassification.create(this.projectId, this.doc.id, labelId)
      await this.list(this.doc.id)
    },
    async addOrRemoveCategory(event) {
      const labelId = parseInt(event.srcKey, 10)
      const annotation = this.spans.find((item) => item.label === labelId)
      if (annotation) {
        await this.remove(annotation.id)
      } else {
        await this.add(labelId)
      }
    },
    async clear() {
      await this.clearSequenceLabels()
      await this.clearCategory()
    },
    async clearSequenceLabels() {
      await this.$services.sequenceLabeling.clear(this.projectId, this.doc.id)
      await this.list(this.doc.id)
    },
    async clearCategory() {
      await this.$services.textClassification.clear(this.projectId, this.doc.id)
      await this.list(this.doc.id)
    },
    async autoLabel(docId) {
      await this.autoLabelCategory(docId)
      await this.autoLabelSequences(docId)
    },
    async autoLabelCategory(docId) {
      try {
        await this.$services.textClassification.autoLabel(this.projectId, docId)
      } catch (e) {
        console.log(e.response.data.detail)
      }
    },
    async autoLabelSequences(docId) {
      try {
        await this.$services.sequenceLabeling.autoLabel(this.projectId, docId)
      } catch (e) {
        console.log(e.response.data.detail)
      }
    },
    async updateProgress() {
      this.progress = await this.$services.metrics.fetchMyProgress(this.projectId)
    },
    async confirm() {
      await this.$services.example.confirm(this.projectId, this.doc.id)
      await this.$fetch()
      this.updateProgress()
    },
    changeSelectedLabel(event) {
      this.selectedLabelIndex = this.spanTypes.findIndex((item) => item.suffixKey === event.srcKey)
    }
  }
}
</script>

<style scoped>
.annotation-text {
  font-size: 1.1rem !important;
  font-weight: 500;
  line-height: 2rem;
  font-family: 'Roboto', sans-serif !important;
  opacity: 0.6;
}
</style>
