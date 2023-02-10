<template>
  <div v-show="isLoaded" class="affective-annotation">
    <layout-text
      v-if="doc.id"
      v-shortkey="shortKeysSpans"
      class="layout-text"
      :class="{ '--sticky': hasStickyView }"
      @shortkey="changeSelectedLabel"
    >
      <template #header>
        <div class="layout-text__header" :class="{ '--sticky': hasStickyView }">
          <v-alert
            :value="!canConfirm && hasClickedConfirmButton"
            class="header-alert"
            color="error"
            dark
            transition="scale-transition"
            dismissible
            @input="onConfirmationAlertClose"
          >
            {{ $t('errors.incompleteAffectiveAnnotation') }}
          </v-alert>
          <toolbar-laptop
            :doc-id="doc.id"
            :button-options="{
              review: {
                visible: true,
                hasText: true,
                text: {
                  checked: $t('annotation.checkedTooltip'),
                  notChecked: $t('annotation.notCheckedTooltip')
                },
                disabled: !canEdit
              },
              filter: {
                visible: showFilterButton
              },
              guideline: {
                visible: true
              },
              comment: {
                visible: true
              },
              autoLabeling: {
                visible: showAutoLabeling
              },
              clear: {
                visible: true,
                disabled: !canEdit
              },
              pagination: {
                visible: true,
                disabled: {
                  first: !canNavigateBackward,
                  prev: !canNavigateBackward,
                  next: !canNavigateForward,
                  last: !canNavigateForward || !canSkipForward,
                  jump: !canSkipForward
                },
                tooltip: {
                  first: canNavigateBackward ? '' : $t('annotation.warningBackNavigation'),
                  prev: canNavigateBackward ? '' : $t('annotation.warningBackNavigation'),
                  next: canNavigateForward ? '' : $t('annotation.warningCheckedNavigation'),
                  prev: canNavigateBackward ? '' : $t('annotation.warningBackNavigation'),
                  jump: ''
                },
                callback: {
                  next: onPaginationCallback,
                  last: onPaginationCallback
                }
              }
            }"
            :enable-auto-labeling.sync="enableAutoLabeling"
            :guideline-text="project.guideline"
            :is-reviewd="doc.isConfirmed"
            :total="docs.count"
            :is-article-project="true"
            :article-index="articleIndex"
            :article-total="articleTotal"
            class="d-none d-sm-block header-toolbar --desktop"
            @click:clear-label="clear"
            @click:review="confirm"
          >
            <v-spacer />
          </toolbar-laptop>
          <toolbar-mobile :total="docs.count" class="d-flex d-sm-none header-toolbar --mobile" />
          <v-row v-show="hasStickyView">
            <v-col cols="12" md="9">
              <p ref="entityText" class="header-text">
                {{ doc.text }}
              </p>
            </v-col>
            <v-col cols="12" md="3" class="d-sm-none d-md-block">
              <annotation-progress :progress="progress" />
            </v-col>
          </v-row>
        </div>
      </template>
      <template #content>
        <div class="layout-text__content" :class="{ '--expanded': hasStickyView }">
          <v-row class="content__title">
            <v-col cols="12">
              <h3 class="mt-3 mb-2">
                {{ doc.meta.meta.article_title }}
              </h3>
              <v-divider />
            </v-col>
          </v-row>
          <v-row class="mt-3 content__article">
            <v-col v-if="showArticleViewer" cols="5" class="content-article__toolbar">
              <toolbar-article
                :project="project"
                :article-items="currentWholeArticle.items"
                :current-article-item="doc"
              />
            </v-col>
            <v-col :cols="showArticleViewer ? 7 : 12" class="content-article__container">
              <v-card
                v-shortkey="shortKeysCategory"
                class="annotation-card"
                :class="{ '--hidden': hasStickyView }"
                @shortkey="addOrRemoveCategory"
              >
                <v-card-title v-if="categoryTypes.length" class="annotation-card__title">
                  <label-group
                    v-if="labelOption === 0"
                    :read-only="!canEdit"
                    :labels="categoryTypes"
                    :annotations="categories"
                    :single-label="project.singleClassClassification"
                    @add="addCategory"
                    @remove="removeCategory"
                  />
                  <label-select
                    v-else
                    :read-only="!canEdit"
                    :labels="categoryTypes"
                    :annotations="categories"
                    :single-label="project.singleClassClassification"
                    @add="addCategory"
                    @remove="removeCategory"
                  />
                </v-card-title>
                <v-divider />
                <div class="annotation-card__text pa-4" :class="{ '--sticky': hasStickyView }">
                  <entity-editor
                    ref="entityEditor"
                    class="entity-editor"
                    :class="{ '--transparent': hasStickyView }"
                    :dark="$vuetify.theme.dark"
                    :rtl="isRTL"
                    :read-only="!canEdit"
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
              <v-divider />
              <v-card
                v-if="isScaleImported"
                ref="dimensionCard"
                class="pa-4 dimension-card"
                :style="`margin-top: ${
                  hasStickyView ? $refs.entityEditor.$el.clientHeight / 2 : 0
                }px`"
                :class="{ '--sticky': hasStickyView }"
              >
                <summary-input
                  v-if="project.isSummaryMode || project.isCombinationMode"
                  ref="summaryInput"
                  class="mb-10"
                  :text="doc.text"
                  :tags="affectiveSummaryTags"
                  :impressions="affectiveSummaryImpressions"
                  :read-only="!canEdit"
                  :show-borders="project.isCombinationMode"
                  :show-errors="!hasValidEntries.isSummaryMode && hasClickedConfirmButton"
                  @remove:tag="removeTag"
                  @update:tag="updateTag"
                  @add:tag="addTag"
                  @remove:impression="removeImpression"
                  @update:impression="updateImpression"
                  @add:impression="addImpression"
                />
                <emotions-input
                  v-if="project.isEmotionsMode || project.isCombinationMode"
                  ref="emotionsInput"
                  class="mb-10"
                  :read-only="!canEdit"
                  :show-borders="project.isCombinationMode"
                  :show-errors="!hasValidEntries.isEmotionsMode && hasClickedConfirmButton"
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
                  v-if="project.isOthersMode || project.isCombinationMode"
                  ref="othersInput"
                  class="mb-10"
                  :read-only="!canEdit"
                  :show-borders="project.isCombinationMode"
                  :show-errors="!hasValidEntries.isOthersMode && hasClickedConfirmButton"
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
                  v-if="project.isOffensiveMode || project.isCombinationMode"
                  ref="offensiveInput"
                  v-model="hasValidEntries.isOffensiveMode"
                  class="mb-10"
                  :show-borders="project.isCombinationMode"
                  :show-errors="hasClickedConfirmButton"
                  :project="project"
                  :doc="doc"
                  :scale-types="scaleTypes"
                  :scales="scales"
                  :text-labels="textLabels"
                  :read-only="!canEdit"
                  @update:scale="updateScale"
                  @add:label="addLabel"
                  @update:label="updateTag"
                  @remove:label="removeTag"
                />
                <humor-input
                  v-if="project.isHumorMode || project.isCombinationMode"
                  ref="humorInput"
                  v-model="hasValidEntries.isHumorMode"
                  class="mb-10"
                  :show-borders="project.isCombinationMode"
                  :show-errors="hasClickedConfirmButton"
                  :project="project"
                  :doc="doc"
                  :scale-types="scaleTypes"
                  :scales="scales"
                  :text-labels="textLabels"
                  :read-only="!canEdit"
                  @update:scale="updateScale"
                  @add:label="addLabel"
                  @update:label="updateTag"
                  @remove:label="removeTag"
                />
                <v-btn block color="primary" @click="scrollToTop">
                  {{ $i18n.t('generic.goToTop') }}
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </template>
      <template #sidebar>
        <div class="layout-text__sidebar">
          <annotation-progress :progress="progress" />
        </div>
      </template>
      <resting-period-modal v-if="showRestingMessage" :end-time="restingEndTime" />
    </layout-text>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { mdiText, mdiFormatListBulleted } from '@mdi/js'
import moment from 'moment'
import LabelGroup from '@/components/tasks/textClassification/LabelGroup'
import LabelSelect from '@/components/tasks/textClassification/LabelSelect'
import LayoutText from '@/components/tasks/layout/LayoutText'
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
import RestingPeriodModal from '@/components/utils/RestingPeriodModal.vue'

export default {
  components: {
    AnnotationProgress,
    EntityEditor,
    LayoutText,
    ToolbarLaptop,
    ToolbarMobile,
    ToolbarArticle,
    LabelGroup,
    LabelSelect,
    SummaryInput,
    EmotionsInput,
    OthersInput,
    OffensiveInput,
    HumorInput,
    RestingPeriodModal
  },

  layout: 'workspace',

  validate({ params, query }) {
    return /^\d+$/.test(params.id) && /^\d+$/.test(query.page)
  },

  data() {
    return {
      mdiText,
      mdiFormatListBulleted,
      isLoaded: false,
      docs: [],
      textLabels: [],
      scales: [],
      scaleTypes: [],
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
      isProjectAdmin: false,
      articleTotal: 1,
      articleIndex: 1,
      isScaleImported: true,
      currentArticleId: '',
      currentWholeArticle: [],
      affectiveTmp: {},
      affectiveScalesValues: {},
      affectiveTextlabelQuestions: {
        summaryTag:
          'Jakimi słowami opisałbyś ten tekst (tagi, słowa kluczowe)? Proszę wpisać 2-10 słów.',
        summaryImpression:
          'Jakie wrażenia/emocje/odczucia wzbudza w Tobie ten tekst? Proszę wpisać 2-10 słów.',
        othersWishToAuthor: 'Czego życzę autorowi tego tekstu?'
      },
      affectiveScalesDict: {},
      intNullFlag: -1,
      strNullFlag: '-1',
      affectiveSummaryTags: [],
      affectiveSummaryImpressions: [],
      affectiveOthersWishToAuthor: [],
      affectiveOthersTmp: {},
      showRestingMessage: false,
      restingEndTime: '',
      hasCheckedPreviousDoc: false,
      hasValidEntries: {
        isSummaryMode: false,
        isHumorMode: false,
        isOffensiveMode: false,
        isEmotionsMode: false,
        isOthersMode: false
      },
      hasClickedConfirmButton: false,
      hasStickyView: false,
      firstView: true
    }
  },

  async fetch() {
    this.isProjectAdmin = await this.$services.member.isProjectAdmin(this.projectId)
    this.firstView = true
    await this.setProjectData()
    await this.setDoc()
    await this.setHasCheckedPreviousDoc()
    this.$nextTick(() => {
      this.setArticleData()
      this.loadLabels()
    })
  },

  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'getUsername', 'getUserId']),
    ...mapGetters('config', ['isRTL']),
    ...mapGetters('user', ['getAnnotation']),
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
    isAffectiveAnnotation() {
      return this.project.projectType === 'AffectiveAnnotation'
    },
    isSingleAnnView() {
      return !!this.project?.isSingleAnnView
    },
    showFilterButton() {
      return this.isAffectiveAnnotation ? this.isProjectAdmin : true
    },
    canEdit() {
      return this.isAffectiveAnnotation && this.doc.isConfirmed ? this.isProjectAdmin : true
    },
    canNavigateBackward() {
      const canNavigateBackward = this.isProjectAdmin || !this.hasCheckedPreviousDoc
      return this.isAffectiveAnnotation ? canNavigateBackward : true
    },
    canNavigateForward() {
      const canNavigateForward = this.isProjectAdmin ? true : this.doc.isConfirmed
      return this.isAffectiveAnnotation ? canNavigateForward : true
    },
    canSkipForward() {
      return this.isAffectiveAnnotation ? this.isProjectAdmin : true
    },
    showAutoLabeling() {
      return !this.isAffectiveAnnotation
    },
    showArticleViewer() {
      return !this.isSingleAnnView
    },
    canConfirm() {
      let canConfirm = false
      if (this.project.isCombinationMode) {
        canConfirm = Object.values(this.hasValidEntries).every((value) => value === true)
      } else if (this.project.isSummaryMode) {
        canConfirm = this.hasValidEntries.isSummaryMode
      } else if (this.project.isEmotionsMode) {
        canConfirm = this.hasValidEntries.isEmotionsMode
      } else if (this.project.isOthersMode) {
        canConfirm = this.hasValidEntries.isOthersMode
      } else if (this.project.isHumorMode) {
        canConfirm = this.hasValidEntries.isHumorMode
      } else if (project.isOffensiveMode) {
        canConfirm = this.hasValidEntries.isOffensiveMode
      }
      return canConfirm
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
    }
  },

  watch: {
    getAnnotation: {
      deep: true,
      handler(val) {
        const textBatchCount = 20
        if (val.textCountToday > 0 && val.textCountToday % textBatchCount === 0) {
          this.$nextTick(async () => {
            const questionnaireStates = await this.$services.questionnaire.listFinishedQuestionnaires({
              questionnaireTypeId: 1,
              limit: 1
            })
            let firstQuestionnaireEverDate = null
            if (questionnaireStates && questionnaireStates.items.length > 0) {
              const firstQuestionnaireEver = questionnaireStates.items[0].finishedAt
              firstQuestionnaireEverDate = moment(String(firstQuestionnaireEver)).format('DD-MM-YYYY')
            }
            this.initQuestionnaire(firstQuestionnaireEverDate)
          })
        }
      }
    },
    getQuestionnaire: {
      deep: true,
      handler() {
        if (valtoShow.length) {
          this.$router.push(this.localePath('/questionnaires'))
        }
      }
    },
    '$route.query': '$fetch',
    enableAutoLabeling(val) {
      if (val) {
        this.list(this.doc.id)
      }
    }
  },

  async created() {
    const hasRested = this.checkRestingPeriod()
    if (hasRested) {
      await this.setLabelData()
      this.setAffectiveProjectScaleDataDict()
      this.setAffectiveProjectScaleData()
      await this.list(this.doc.id)
    }
  },

  beforeMount() {
    window.addEventListener('scroll', this.onScrollListener)
  },

  beforeDestroy() {
    window.removeEventListener('scroll', this.onScrollListener)
  },

  mounted() {
    this.isLoaded = true
  },

  methods: {
    ...mapActions('user', [
      'setRestingPeriod',
      'calculateRestingPeriod',
      'setAnnotation',
      'initQuestionnaire',
      'getQuestionnaire'
    ]),

    onScrollListener: _.debounce(function () {
      if (this.isLoaded) {
        const entityEditor = this.$refs.entityEditor
        const margin = 100
        if (entityEditor) {
          const { bottom } = entityEditor.$el.getBoundingClientRect()
          this.hasStickyView = bottom - margin < 0
        }
      }
    }, 50),

    getDimensionComponentRef() {
      let dimensionRef = 'summaryInput'
      if (this.isCombinationMode) {
        dimensionRef = 'summaryInput'
      } else if (this.isSummaryMode) {
        dimensionRef = 'summaryInput'
      } else if (this.isEmotionsMode) {
        dimensionRef = 'emotionsInput'
      } else if (this.isOthersMode) {
        dimensionRef = 'othersInput'
      } else if (this.isHumorMode) {
        dimensionRef = 'humorInput'
      } else if (this.isOffensiveMode) {
        dimensionRef = 'offensiveInput'
      }
      return this.$refs[dimensionRef]
    },

    async checkRestingPeriod() {
      const restingEndTime = await this.calculateRestingPeriod()
      if (restingEndTime === null) {
        this.showRestingMessage = false
        this.restingEndTime = ''
        return true
      } else {
        this.showRestingMessage = !this.isProjectAdmin
        this.restingEndTime = restingEndTime
        return false
      }
    },
    async setHasCheckedPreviousDoc() {
      const query = this.$route.query.q || ''
      const isCheckedQuery = this.$route.query.isChecked || ''
      const page = parseInt(this.$route.query.page)
      const prevPage = page > 1 ? page - 1 : page
      const docs = await this.$services.example.fetchOne(
        this.projectId,
        prevPage,
        query,
        isCheckedQuery
      )
      const doc = docs.items[0]
      this.hasCheckedPreviousDoc = !!doc.isConfirmed
    },
    onPaginationCallback() {
      this.scrollToTop()
      this.annotateStartStates()
    },
    async annotateStartStates() {
      await this.setDoc()
      this.$nextTick(() => {
        !this.doc.isConfirmed &&
          this.$services.example.annotateStartStates(this.projectId, this.doc.id)
      })
    },
    async setLabelData() {
      this.categoryTypes = await this.$services.categoryType.list(this.projectId)
      this.spanTypes = await this.$services.spanType.list(this.projectId)
      this.relationTypes = await this.$services.relationType.list(this.projectId)
      this.scaleTypes = await this.$services.scaleType.list(this.projectId)
    },
    async setProjectData() {
      this.project = await this.$services.project.findById(this.projectId)
      this.progress = await this.$services.metrics.fetchMyProgress(this.projectId)
    },
    async setDoc() {
      const query = this.$route.query.q || ''
      const isCheckedQuery = this.$route.query.isChecked || ''
      this.docs = await this.$services.example.fetchOne(
        this.projectId,
        this.$route.query.page,
        query,
        isCheckedQuery
      )
    },
    setAffectiveProjectScaleDataDict() {
      let affectiveScaleLabelsJSON = []
      if (this.project.isEmotionsMode) {
        affectiveScaleLabelsJSON = EmotionsScales
      } else if (this.project.isOthersMode) {
        affectiveScaleLabelsJSON = OthersScales
      } else if (this.project.isCombinationMode) {
        affectiveScaleLabelsJSON.push(...EmotionsScales)
        affectiveScaleLabelsJSON.push(...OthersScales)
      }
      const affectiveScalesDict = {}
      affectiveScaleLabelsJSON.forEach(function (item) {
        affectiveScalesDict[item.text] = item.varname
      })
      this.affectiveScalesDict = affectiveScalesDict
    },
    setAffectiveProjectScaleData() {
      const scaleTypesRaw = this.scaleTypes
      if (scaleTypesRaw.length > 0) {
        const scaleTypesIdsTexts = {}
        const scaleTypesTextsIds = {}
        scaleTypesRaw.forEach(function (item) {
          scaleTypesIdsTexts[item.id] = item.text
          scaleTypesTextsIds[item.text] = item.id
        })
        this.scaleTypesIdsTexts = scaleTypesIdsTexts
        this.scaleTypesTextsIds = scaleTypesTextsIds
      } else if (!this.project.isSummaryMode) {
        this.isScaleImported = false
      }
    },
    async setArticleData() {
      if (this.docs.items && this.docs.items.length) {
        const doc = this.docs.items[0]
        const isCheckedQuery = this.$route.query.isChecked || ''
        this.currentArticleId = doc.articleId
        this.currentWholeArticle = await this.$services.example.fetchByLimit(
          this.projectId,
          this.docs.count.toString(),
          this.currentArticleId,
          isCheckedQuery
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
      if (docId) {
        const spans = await this.$services.sequenceLabeling.list(this.projectId, docId)
        const relations = await this.$services.sequenceLabeling.listRelations(this.projectId, docId)
        // In colab mode, if someone add a new label and annotate data
        // with the label during your work, it occurs exception
        // because there is no corresponding label.
        await this.maybeFetchSpanTypes(spans)
        this.spans = spans
        this.relations = relations
        this.categories = await this.$services.textClassification.list(this.projectId, docId)
        this.textLabels = await this.$services.affectiveTextlabel.list(this.projectId, docId)
        this.scales = await this.$services.affectiveScale.list(this.projectId, docId)
        this.setAffectiveList()
      }
    },
    setAffectiveList() {
      this.affectiveSummaryTags = this.textLabels.filter(
        (item) => item.question === this.affectiveTextlabelQuestions.summaryTag
      )
      this.affectiveSummaryImpressions = this.textLabels.filter(
        (item) => item.question === this.affectiveTextlabelQuestions.summaryImpression
      )
      this.affectiveOthersWishToAuthor = this.textLabels.filter(
        (item) => item.question === this.affectiveTextlabelQuestions.othersWishToAuthor
      )
      const affectiveScalesValues = {}
      const affectiveScalesDict = this.affectiveScalesDict
      const scaleTypesIdsTexts = this.scaleTypesIdsTexts
      this.scales.forEach(function (item) {
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
      await this.clearScales()
      await this.clearTextLabels()

      await this.list(this.doc.id)
    },
    async clearScales() {
      await this.$services.affectiveScale.clear(this.projectId, this.doc.id)
    },
    async clearTextLabels() {
      await this.$services.affectiveTextlabel.clear(this.projectId, this.doc.id)
    },
    async clearSequenceLabels() {
      await this.$services.sequenceLabeling.clear(this.projectId, this.doc.id)
    },
    async clearCategory() {
      await this.$services.textClassification.clear(this.projectId, this.doc.id)
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

      if (this.progress.complete === this.progress.total) {
        this.setRestingPeriod()
        this.$router.push(this.localePath('/projects'))
      }
    },
    async confirm() {
      const DATE_FORMAT = 'DD-MM-YYYY HH:mm:ss'
      if (this.project.isCombinationMode) {
        this.hasValidEntries.isSummaryMode = this.isAllAffectiveSummaryAdded()
        this.hasValidEntries.isOthersMode = this.isAllAffectiveOthersAdded()
        this.hasValidEntries.isEmotionsMode = this.isAllAffectiveEmotionsAdded()
      } else if (this.project.isSummaryMode) {
        this.hasValidEntries.isSummaryMode = this.isAllAffectiveSummaryAdded()
      } else if (this.project.isOthersMode) {
        this.hasValidEntries.isOthersMode = this.isAllAffectiveOthersAdded()
      } else if (this.project.isEmotionsMode) {
        this.hasValidEntries.isEmotionsMode = this.isAllAffectiveEmotionsAdded()
      }
      this.hasClickedConfirmButton = this.canConfirm ? false : !this.isProjectAdmin
      if (this.canConfirm || this.isProjectAdmin) {
        await this.$services.example.confirm(this.projectId, this.doc.id)
        await this.$fetch()
        this.updateProgress()
        const textCountToday = this.doc.isConfirmed
          ? this.getAnnotation.textCountToday + 1
          : this.getAnnotation.textCountToday

        const { firstAnnotationTime } = this.getAnnotation
        this.setAnnotation({
          hasAnnotatedToday: true,
          textCountToday,
          firstAnnotationTime: firstAnnotationTime ?? moment().format(DATE_FORMAT),
          lastAnnotationTime: moment().format(DATE_FORMAT)
        })
        this.hasClickedConfirmButton = false
        this.scrollToTop()
      }
    },
    isAllAffectiveSummaryAdded() {
      return this.$refs.summaryInput.hasValidEntries
    },
    isAllAffectiveEmotionsAdded() {
      return this.$refs.emotionsInput.hasValidEntries
    },
    isAllAffectiveOthersAdded() {
      return this.$refs.othersInput.hasValidEntries
    },
    onConfirmationAlertClose() {
      this.hasClickedConfirmButton = false
    },
    changeSelectedLabel(event) {
      this.selectedLabelIndex = this.spanTypes.findIndex((item) => item.suffixKey === event.srcKey)
    },
    async removeTag(annotationId) {
      await this.$services.affectiveTextlabel.delete(this.projectId, this.doc.id, annotationId)
      await this.list(this.doc.id)
    },
    async updateTag(annotationId, text) {
      await this.$services.affectiveTextlabel.changeText(
        this.projectId,
        this.doc.id,
        annotationId,
        text
      )
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
      await this.$services.affectiveTextlabel.changeText(
        this.projectId,
        this.doc.id,
        annotationId,
        text
      )
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
      await this.$services.affectiveScale.create(this.projectId, this.doc.id, labelId, value)
      await this.list(this.doc.id)
    },
    async othersChangeHandler(value, category) {
      const affectiveOthersDict = Object.fromEntries(
        Object.entries(this.affectiveScalesDict).map(([k, v]) => [v, k])
      )
      const label = affectiveOthersDict[category]
      const labelId = this.scaleTypesTextsIds[label]
      await this.$services.affectiveScale.create(this.projectId, this.doc.id, labelId, value)
      await this.list(this.doc.id)
    },
    async nullifyOthersValueHandler(category) {
      if (this.affectiveScalesValues[category] !== this.intNullFlag) {
        this.affectiveOthersTmp[category] = this.affectiveScalesValues[category]
        await this.othersChangeHandler(this.intNullFlag, category)
      }
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
      await this.$services.affectiveTextlabel.changeText(
        this.projectId,
        this.doc.id,
        annotationId,
        text
      )
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
      if (this.affectiveOthersWishToAuthor.length > 0) {
        const annotationId = this.affectiveOthersWishToAuthor[0].id
        const currentText = this.affectiveOthersWishToAuthor[0].text
        if (currentText !== this.strNullFlag) {
          await this.updateWishToAuthor(annotationId, this.strNullFlag)
        }
      } else {
        await this.addWishToAuthor(this.strNullFlag)
      }
    },
    async restoreWishToAuthor() {
      if (this.affectiveOthersWishToAuthor.length > 0) {
        const annotationId = this.affectiveOthersWishToAuthor[0].id
        await this.removeWishToAuthor(annotationId)
      }
    },
    async updateScale(labelId, value) {
      if (labelId) {
        await this.$services.affectiveScale.create(this.projectId, this.doc.id, labelId, value)
        await this.list(this.doc.id)
      }
    },
    async addLabel(question, answer) {
      if (question && answer) {
        await this.$services.affectiveTextlabel.create(
          this.projectId,
          this.doc.id,
          answer,
          question
        )
        await this.list(this.doc.id)
      }
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }
}
</script>

<style lang="scss" >
.affective-annotation {
  .layout-text {
    position: relative;
    &__header {
      &.--sticky {
        position: sticky;
        background-color: #fff;
        padding: 20px;
        top: 55px;
        z-index: 1;
        border: 1px solid #ddd;
      }

      .header-text {
        font-size: 0.875rem;
        margin: 15px 0 0;
        line-height: 1.5;
        max-height: 150px;
        overflow-y: auto;
        opacity: 0.8;
      }
    }
  }
}

.content-article__container {
  position: relative;

  .annotation-card__text {
    font-size: 1.1rem !important;
    font-weight: 500;
    font-family: 'Roboto', sans-serif !important;
    opacity: 0.6;

    .--hidden {
      display: none;
    }

    > div > div > svg:last-of-type {
      height: 0;
      overflow: hidden;
    }

    .entity-editor {
      &.--transparent {
        height: 0;
        overflow: hidden;
      }
    }
  }

  .dimension-card {
    position: relative;
    z-index: 0;
    margin-top: 30px;

    &.--sticky {
      left: 0;
      right: 0;
    }
  }
}
</style>
