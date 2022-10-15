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
        <v-row>
          <v-col cols="12">
              <h3 class="mt-3"> 
                {{ $t('annotation.articleTitle') }}: {{ doc.meta.meta.article_title }}
              </h3>
              <p class="mt-0 mb-0">{{ $t('annotation.articleId') }}: {{ currentArticleId }}</p>
              <v-divider />
          </v-col>
        </v-row>
        <v-row class="mt-3">
          <v-col cols="5">
            <div>
              <toolbar-article 
                :project="project"
                :article-items="currentWholeArticle.items"
                :current-article-item="doc"
              />
            </div>
          </v-col>
          <v-col cols="7">
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
              <v-divider />
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
              <v-divider />
              <div v-if="isScaleImported" class="pa-4">
                <summary-input
<<<<<<< HEAD
                  v-if="project.isSummaryMode"
                  :text="doc.text"
                  :tags="affectiveSummaryTags"
                  :impressions="affectiveSummaryImpressions"
                  @remove:tag="removeTag"
                  @update:tag="updateTag"
                  @add:tag="addTag"
                  @remove:impression="removeImpression"
                  @update:impression="updateImpression"
                  @add:impression="addImpression"
                />
                <emotions-input
                  v-else-if="project.isEmotionsMode"
                  :general-positivity="affectiveScalesValues.positive"
                  :general-negativity="affectiveScalesValues.negative"
                  :joy="affectiveScalesValues.joy"
                  :admiration="affectiveScalesValues.admiration"
                  :inspiration="affectiveScalesValues.inspiration"
                  :peace="affectiveScalesValues.peace"
                  :surprise="affectiveScalesValues.surprise"
                  :sympathy="affectiveScalesValues.sympathy"
                  :fear="affectiveScalesValues.fear"
                  :sadness="affectiveScalesValues.sadness"
                  :disgust="affectiveScalesValues.disgust"
                  :anger="affectiveScalesValues.anger"
                  @change="emotionsChangeHandler"
                />
                <others-input
                  v-else-if="project.isOthersMode"
                  :ironic="affectiveScalesValues.ironic"
                  :embarrassing="affectiveScalesValues.embarrassing"
                  :vulgar="affectiveScalesValues.vulgar"
                  :politic="affectiveScalesValues.politic"
                  :interesting="affectiveScalesValues.interesting"
                  :comprehensible="affectiveScalesValues.comprehensible"
                  :agreeable="affectiveScalesValues.agreeable"
                  :believable="affectiveScalesValues.believable"
                  :sympathy-to-author="affectiveScalesValues.sympathyToAuthor"
                  :need-more-info="affectiveScalesValues.needMoreInfo"
                  :wish-to-author="affectiveOthersWishToAuthor"
                  @change="othersChangeHandler"
                  @nullifyCategoryValue="nullifyOthersValueHandler"
                  @restoreCategoryValue="restoreOthersValueHandler"
                  @remove:wishToAuthor="removeWishToAuthor"
                  @update:wishToAuthor="updateWishToAuthor"
                  @add:wishToAuthor="addWishToAuthor"
                  @nullify:wishToAuthor="nullifyWishToAuthor"
                  @restore:wishToAuthor="restoreWishToAuthor"
                />
                <offensive-input
                  v-else-if="project.isOffensiveMode"
                  v-model="affectiveTmp" />
                <humor-input
                  v-else-if="project.isHumorMode"
                  v-model="affectiveTmp" />
=======
                    v-if="project.isSummaryMode"
                    :text="doc.text"
                    :tags="affectiveSummaryTags"
                    :impressions="affectiveSummaryImpressions"
                    @remove:tag="removeTag"
                    @update:tag="updateTag"
                    @add:tag="addTag"
                    @remove:impression="removeImpression"
                    @update:impression="updateImpression"
                    @add:impression="addImpression"
                  />
                  <emotions-input
                    v-if="project.isEmotionsMode"
                    :general-positivity="affectiveScalesValues.positive"
                    :general-negativity="affectiveScalesValues.negative"
                    :joy="affectiveScalesValues.joy"
                    :admiration="affectiveScalesValues.admiration"
                    :inspiration="affectiveScalesValues.inspiration"
                    :peace="affectiveScalesValues.peace"
                    :surprise="affectiveScalesValues.surprise"
                    :sympathy="affectiveScalesValues.sympathy"
                    :fear="affectiveScalesValues.fear"
                    :sadness="affectiveScalesValues.sadness"
                    :disgust="affectiveScalesValues.disgust"
                    :anger="affectiveScalesValues.anger"
                    @change="emotionsChangeHandler"
                  />
                  <others-input
                    v-if="project.isOthersMode"
                    :ironic="affectiveScalesValues.ironic"
                    :embarrassing="affectiveScalesValues.embarrassing"
                    :vulgar="affectiveScalesValues.vulgar"
                    :politic="affectiveScalesValues.politic"
                    :interesting="affectiveScalesValues.interesting"
                    :comprehensible="affectiveScalesValues.comprehensible"
                    :agreeable="affectiveScalesValues.agreeable"
                    :believable="affectiveScalesValues.believable"
                    :sympathy-to-author="affectiveScalesValues.sympathyToAuthor"
                    :need-more-info="affectiveScalesValues.needMoreInfo"
                    :wish-to-author="affectiveOthersWishToAuthor"
                    @change="othersChangeHandler"
                    @nullifyCategoryValue="nullifyOthersValueHandler"
                    @restoreCategoryValue="restoreOthersValueHandler"
                    @remove:wishToAuthor="removeWishToAuthor"
                    @update:wishToAuthor="updateWishToAuthor"
                    @add:wishToAuthor="addWishToAuthor"
                    @nullify:wishToAuthor="nullifyWishToAuthor"
                    @restore:wishToAuthor="restoreWishToAuthor"
                  />
                  <offensive-input
                    v-else-if="project.isOffensiveMode"
                    @update:scale="updateScale"
                    @add:label="addLabel"
                    @update:label="updateLabel"
                    @remove:label="removeLabel" />
                  <humor-input
                    v-else-if="project.isHumorMode"
                    @update:scale="updateScale"
                    @add:label="addLabel"
                    @update:label="updateLabel"
                    @remove:label="removeLabel"  />
>>>>>>> 29be3208 (feat: api (in progress))
              </div>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </template>
    <template #sidebar>
      <annotation-progress :progress="progress" />
      <v-card class="mt-4">
        <v-card-title>{{ $t('annotation.labelTypes') }}</v-card-title>
        <v-card-text>
          <v-switch v-if="useRelationLabeling" v-model="relationMode">
            <template #label>
              <span v-if="relationMode">{{ $t('annotation.relation') }}</span>
              <span v-else>{{ $t('annotation.span') }}</span>
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
import ToolbarArticle from '@/components/tasks/toolbar/ToolbarArticle'
import EntityEditor from '@/components/tasks/sequenceLabeling/EntityEditor.vue'
import AnnotationProgress from '@/components/tasks/sidebar/AnnotationProgress.vue'
import SummaryInput from '@/components/tasks/affectiveAnnotation/summary/SummaryInput.vue'
import EmotionsInput from '@/components/tasks/affectiveAnnotation/emotions/EmotionsInput.vue'
import EmotionsScales from '@/static/formats/affective_annotation/affective_emotions_scales.json'
import OthersInput from '@/components/tasks/affectiveAnnotation/others/OthersInput.vue'
import OthersScales from '@/static/formats/affective_annotation/affective_others_scales.json'
import OffensiveInput from '@/components/tasks/affectiveAnnotation/offensive/OffensiveInput.vue'
import HumorInput from '@/components/tasks/affectiveAnnotation/humor/HumorInput.vue'


export default {
  components: {
    AnnotationProgress,
    EntityEditor,
    LayoutText,
    ListMetadata,
    ToolbarLaptop,
    ToolbarMobile,
    ToolbarArticle,
    LabelGroup,
    LabelSelect,
    SummaryInput,
    EmotionsInput,
    OthersInput,
    OffensiveInput,
    HumorInput
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
      isScaleImported: true,
      scaleTypesIdsTexts: {},
      scaleTypesTextsIds: {},
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
      currentWholeArticle: [],
      affectiveTmp: {},
      affectiveScalesDict: {},
      affectiveScalesValues: {},
      affectiveTextlabelQuestions: {
        summaryTag: "Jakimi słowami opisałbyś ten tekst (tagi, słowa kluczowe)? Proszę wpisać 2-10 słów.",
        summaryImpression: "Jakie wrażenia/emocje/odczucia wzbudza w Tobie ten tekst? Proszę wpisać 2-10 słów.",
        othersWishToAuthor: "Czego życzę autorowi tego tekstu?"
      },
      affectiveSummaryTags: [],
      affectiveSummaryImpressions: [],
      affectiveOthersWishToAuthor: [],
      affectiveOthersTmp: {},
    }
  },

  async fetch() {
    await this.setDoc()
    this.$nextTick(()=> {
      this.setArticleData()
    })
    this.$nextTick(()=> {
      this.loadLabels()
    })
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
  },

  watch: {
    '$route.query': '$fetch',
    enableAutoLabeling(val) {
      if (val) {
        this.list(this.doc.id)
      }
    },
  },

  async created() {
    this.categoryTypes = await this.$services.categoryType.list(this.projectId)
    this.spanTypes = await this.$services.spanType.list(this.projectId)
    this.relationTypes = await this.$services.relationType.list(this.projectId)
    this.project = await this.$services.project.findById(this.projectId)
    this.progress = await this.$services.metrics.fetchMyProgress(this.projectId)

    let affectiveScaleLabelsJSON = []
    if (this.project.isEmotionsMode) {
      affectiveScaleLabelsJSON = EmotionsScales
    } else if (this.project.isOthersMode) {
      affectiveScaleLabelsJSON = OthersScales
    }
    const affectiveScalesDict = {}
    affectiveScaleLabelsJSON.forEach(function(item) {
      affectiveScalesDict[item.text] = item.varname
    })
    this.affectiveScalesDict = affectiveScalesDict

    const scaleTypesRaw = await this.$services.scaleType.list(this.projectId)
    if (scaleTypesRaw.length > 0) {
      const scaleTypesIdsTexts = {}
      const scaleTypesTextsIds = {}
      scaleTypesRaw.forEach(function(item) {
        scaleTypesIdsTexts[item.id] = item.text
        scaleTypesTextsIds[item.text] = item.id
      })
      this.scaleTypesIdsTexts = scaleTypesIdsTexts
      this.scaleTypesTextsIds = scaleTypesTextsIds
    } else if (!this.project.isSummaryMode) {
      this.isScaleImported = false
    }
  },

  methods: {
    async setDoc() {
      const query = this.$route.query.q || ''
      const isChecked = this.$route.query.isChecked || ''
      this.docs = await this.$services.example.fetchOne(
        this.projectId,
        this.$route.query.page,
        query,
        isChecked
      )
    },
    async setArticleData() {
      if(this.docs.items && this.docs.items.length) {
        const doc = this.docs.items[0]
        const isChecked = this.$route.query.isChecked || ''
        this.currentArticleId = doc.articleId
        this.currentWholeArticle = await this.$services.example.fetchByLimit(
          this.projectId,
          this.docs.count.toString(),
          this.currentArticleId,
          isChecked
        )
        this.currentWholeArticle.items = _.orderBy(this.currentWholeArticle.items, 'order')
        const allArticleIds = await this.$services.example.fetchArticleIds(
          this.projectId,
          this.docs.count.toString()
        )
        this.articleTotal = allArticleIds.length
        this.articleIndex = allArticleIds.indexOf(this.currentArticleId) + 1
      }
    },
    async maybeFetchSpanTypes(spans) {
      const labelIds = new Set(this.spanTypes.map((label) => label.id))
      if (spans.some((item) => !labelIds.has(item.label))) {
        this.spanTypes = await this.$services.spanType.list(this.projectId)
      }
    },
    async loadLabels() {
      if (this.enableAutoLabeling && !this.doc.isConfirmed) {
        await this.autoLabel(this.doc.id)
      }
      await this.list(this.doc.id)
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

      const affectiveTextlabels = await this.$services.affectiveTextlabel.list(this.projectId, docId)
      this.affectiveSummaryTags = affectiveTextlabels.filter(
        (item) => item.question === this.affectiveTextlabelQuestions.summaryTag
      )
      this.affectiveSummaryImpressions = affectiveTextlabels.filter(
        (item) => item.question === this.affectiveTextlabelQuestions.summaryImpression
      )
      this.affectiveOthersWishToAuthor = affectiveTextlabels.filter(
        (item) => item.question === this.affectiveTextlabelQuestions.othersWishToAuthor
      )

      const affectiveScales = await this.$services.affectiveScale.list(this.projectId, docId)
      const affectiveScalesValues = {}
      const affectiveScalesDict = this.affectiveScalesDict
      const scaleTypesIdsTexts = this.scaleTypesIdsTexts
      affectiveScales.forEach(function(item) {
        const category = affectiveScalesDict[scaleTypesIdsTexts[item.label]]
        affectiveScalesValues[category] = item.scale
      })
      this.affectiveScalesValues = affectiveScalesValues
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
    },
    async removeTag(annotationId) {
      await this.$services.affectiveTextlabel.delete(this.projectId, this.doc.id, annotationId)
      await this.list(this.doc.id)
    },
    async updateTag(annotationId, text) {
      await this.$services.affectiveTextlabel.changeText(this.projectId, this.doc.id, annotationId, text)
      await this.list(this.doc.id)
    },
    async addTag(text) {
      await this.$services.affectiveTextlabel.create(
        this.projectId,
        this.doc.id,
        text,
        this.affectiveTextlabelQuestions.summaryTag
      )
      await this.list(this.doc.id)
    },
    async removeImpression(annotationId) {
      await this.$services.affectiveTextlabel.delete(this.projectId, this.doc.id, annotationId)
      await this.list(this.doc.id)
    },
    async updateImpression(annotationId, text) {
      await this.$services.affectiveTextlabel.changeText(this.projectId, this.doc.id, annotationId, text)
      await this.list(this.doc.id)
    },
    async addImpression(text) {
      await this.$services.affectiveTextlabel.create(
        this.projectId,
        this.doc.id,
        text,
        this.affectiveTextlabelQuestions.summaryImpression
      )
      await this.list(this.doc.id)
    },
    async emotionsChangeHandler(value, category) {
      const affectiveEmotionsDict = Object.fromEntries(
        Object.entries(this.affectiveScalesDict).map(([k, v]) => [v, k])
      )
      const label = affectiveEmotionsDict[category]
      const labelId = this.scaleTypesTextsIds[label]
      await this.$services.affectiveScale.create(
        this.projectId,
        this.doc.id,
        labelId,
        value
      )
      await this.list(this.doc.id)
    },
    async othersChangeHandler(value, category) {
      const affectiveOthersDict = Object.fromEntries(
        Object.entries(this.affectiveScalesDict).map(([k, v]) => [v, k])
      )
      const label = affectiveOthersDict[category]
      const labelId = this.scaleTypesTextsIds[label]
      await this.$services.affectiveScale.create(
        this.projectId,
        this.doc.id,
        labelId,
        value
      )
      await this.list(this.doc.id)
    },
    async nullifyOthersValueHandler(category) {
      this.affectiveOthersTmp[category] = this.affectiveScalesValues[category]
      await this.othersChangeHandler(-1, category)
    },
    async restoreOthersValueHandler(category) {
      const previousValue = this.affectiveOthersTmp[category] || 0
      await this.othersChangeHandler(previousValue, category)
    },
    async removeWishToAuthor(annotationId) {
      await this.$services.affectiveTextlabel.delete(this.projectId, this.doc.id, annotationId)
      await this.list(this.doc.id)
    },
    async updateWishToAuthor(annotationId, text) {
      await this.$services.affectiveTextlabel.changeText(this.projectId, this.doc.id, annotationId, text)
      await this.list(this.doc.id)
    },
    async addWishToAuthor(text) {
      await this.$services.affectiveTextlabel.create(
        this.projectId,
        this.doc.id,
        text,
        this.affectiveTextlabelQuestions.othersWishToAuthor
      )
      await this.list(this.doc.id)
    },
    async nullifyWishToAuthor() {
      this.affectiveOthersTmp.wishToAuthor = this.affectiveOthersWishToAuthor
      if (this.affectiveOthersWishToAuthor.length > 0) {
        const annotationId = this.affectiveOthersWishToAuthor[0].id
        await this.removeWishToAuthor(annotationId)
        await this.list(this.doc.id)
      }
    },
    async restoreWishToAuthor() {
      if (this.affectiveOthersTmp.wishToAuthor.length > 0) {
        const text = this.affectiveOthersTmp.wishToAuthor[0].text
        await this.addWishToAuthor(text)
        await this.list(this.doc.id)
      }
    },
    async updateScale(key, value) {
      await this.$services.affectiveScale.create(
        this.projectId,
        this.doc.id,
        key,
        value
      )
      await this.list(this.doc.id)
    },
    addLabel() {},
    updateLabel() {},
    removeLabel() {},
  }
}
</script>

<style lang="scss">
.annotation-text {
  font-size: 1.1rem !important;
  font-weight: 500;
  line-height: 2rem;
  font-family: 'Roboto', sans-serif !important;
  opacity: 0.6;
  margin-bottom: 20px;

  > div > div > svg:last-of-type {
    height: 0;
    overflow: hidden;
  }
}

</style>
