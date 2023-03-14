<template>
  <div v-show="isLoaded" class="dynamic-annotation">
    <layout-text v-if="doc.id" class="layout-text --sticky">
      <template #header>
        <div class="layout-text__header --sticky">
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
          <toolbar-mobile
            :total="docs.count"
            :disable-prev="!canNavigateBackward"
            :disable-next="!canNavigateForward"
            class="d-flex d-sm-none header-toolbar --mobile"
          />
          <v-card>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="9">
                  <p ref="entityText" class="header-text">
                    {{ doc.text }}
                  </p>
                </v-col>
                <v-col cols="12" md="3" class="d-sm-none d-md-block text-center">
                  <v-btn class="btn-toggle" plain x-small color="info" @click="toggleProgressBar">
                    {{ $t('annotation_sidebar.progress.toggle') }}
                  </v-btn>
                  <annotation-progress
                    :class="showProgressBar ? 'd-block' : 'd-none'"
                    :progress="progress"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </div>
      </template>
      <template #content>
        <div class="layout-text__content --expanded">
          <v-row class="mt-3 content__article">
            <v-col class="content-article__container">
              <v-divider />
              <v-card
                v-if="isScaleImported"
                ref="dimensionCard"
                class="pa-4 dimension-card --sticky"
              >
                <v-card-text>
                  <v-form ref="dimensionForm">
                    <ul>
                      <li
                        v-for="(key, idx) in Object.keys(formData.dimensions)"
                        :key="`dimension-group_${idx}`"
                      >
                        <h2>
                          {{ key }}
                        </h2>
                        <ul>
                          <li
                            v-for="(dim, dimIdx) in formData.dimensions[key]"
                            :key="`dimension-group--${key}_${dimIdx}`"
                          >
                            <component
                              :is="getDimComponent(dim)"
                              :value="dim.value"
                              :name="dim.name"
                              :form-data-key="`[${key}][${dimIdx}]`"
                              :state="getDimState(dim)"
                              :items="dimensionTypes"
                              :config="getDimConfig(dim)"
                              :required="dim.metadata[0].required"
                              :read-only="dim.metadata[0].readonly"
                              @update:scale="onDynamicComponentUpdateScale"
                              @add:label="onDynamicComponentAddLabel"
                              @update:label="onDynamicComponentUpdateLabel"
                              @remove:label="onDynamicComponentRemoveLabel"
                            />
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </v-form>
                </v-card-text>
                <v-btn block color="primary" @click="scrollToTop">
                  {{ $i18n.t('generic.goToTop') }}
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </template>
      <resting-period-modal v-if="showRestingMessage" :end-time="restingEndTime" />
    </layout-text>
  </div>
</template>

<script lang="ts">
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { mdiText, mdiFormatListBulleted } from '@mdi/js'
import moment from 'moment'
import LayoutText from '@/components/tasks/layout/LayoutText'
import ToolbarLaptop from '@/components/tasks/toolbar/ToolbarLaptop'
import ToolbarMobile from '@/components/tasks/toolbar/ToolbarMobile'
import AnnotationProgress from '@/components/tasks/sidebar/AnnotationProgress.vue'
import RestingPeriodModal from '@/components/utils/RestingPeriodModal.vue'
import { objectKeysSnakeToCamel } from '~/utils/stringHelpers'
import { DimensionDTO } from '~/services/application/dimension/dimensionData'
import SliderInput from '~/components/tasks/dynamicAnnotation/SliderInput.vue'
import CheckboxInput from '~/components/tasks/dynamicAnnotation/CheckboxInput.vue'

export default {
  components: {
    AnnotationProgress,
    LayoutText,
    ToolbarLaptop,
    ToolbarMobile,
    RestingPeriodModal,
    SliderInput,
    CheckboxInput
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
      dimensionTypes: [],
      formData: {
        dimensions: {}
      },
      project: {},
      enableAutoLabeling: false,
      rtl: false,
      progress: {},
      isProjectAdmin: false,
      articleTotal: 1,
      articleIndex: 1,
      isScaleImported: true,
      currentArticleId: '',
      currentWholeArticle: [],
      showRestingMessage: false,
      restingEndTime: '',
      hasCheckedPreviousDoc: false,
      hasValidEntries: {},
      canConfirm: false,
      hasClickedConfirmButton: false,
      showProgressBar: true
    }
  },

  async fetch() {
    this.isProjectAdmin = await this.$services.member.isProjectAdmin(this.projectId)
    await this.setProjectData()
    await this.setDoc()
    await this.setHasCheckedPreviousDoc()
    this.$nextTick(() => {
      this.setArticleData()
      this.list(this.doc.id)
    })
  },

  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'getUsername', 'getUserId']),
    ...mapGetters('config', ['isRTL']),
    ...mapGetters('user', ['getAnnotation']),
    scaleValues(): any[] {
      return this.scales.map((scale: any) => {
        const scaleType: any =
          this.scaleTypes.find((scaleType: any) => scaleType.id === scale.label) || {}
        return {
          ...scale,
          ...scaleType,
          scaleTypeId: scale.label
        }
      })
    },
    textLabelValues(): any[] {
      return this.textLabels.map((textLabel: any) => {
        const substatementQuestion = textLabel.question
        /* const annotation = _.cloneDeep(this.polishAnnotation.humor) as any
        let substatementKey = ''
        Object.keys(annotation).forEach((subKey: string) => {
          if (typeof annotation[subKey] === 'object') {
            Object.keys(annotation[subKey]).every((subKey2: string) => {
              let isKey = annotation[subKey][subKey2] === textLabel.question
              if (textLabel.question.includes(' - ')) {
                const questions = textLabel.question.split(' - ')
                isKey =
                  annotation[subKey].question === questions[0] &&
                  annotation[subKey][subKey2] === questions[1]
              }
              if (isKey) {
                substatementKey = `${subKey}.${subKey2}`
              }
              return !isKey
            })
          }
        }) */
        return {
          ...textLabel,
          substatementQuestion
          // substatementKey
        }
      })
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
    isDynamicAnnotation() {
      return this.project.projectType === 'DynamicAnnotation'
    },
    showFilterButton() {
      return this.isDynamicAnnotation ? this.isProjectAdmin : true
    },
    canEdit() {
      return this.isDynamicAnnotation && this.doc.isConfirmed ? this.isProjectAdmin : true
    },
    canNavigateBackward() {
      const canNavigateBackward = this.isProjectAdmin || !this.hasCheckedPreviousDoc
      return this.isDynamicAnnotation ? canNavigateBackward : true
    },
    canNavigateForward() {
      const canNavigateForward = this.isProjectAdmin ? true : this.doc.isConfirmed
      return this.isDynamicAnnotation ? canNavigateForward : true
    },
    canSkipForward() {
      return this.isDynamicAnnotation ? this.isProjectAdmin : true
    },
    showAutoLabeling() {
      return !this.isDynamicAnnotation
    }
  },

  watch: {
    scaleValues: {
      deep: true,
      handler(val) {
        if (val.length) {
          Object.keys(this.formData.dimensions).forEach((key) => {
            this.formData.dimensions[key].forEach((dim) => {
              const scaleValue = val.find((scale: any) => scale.text === dim.name)
              const index = this.formData.dimensions[key].indexOf(dim)
              if (scaleValue) {
                const formDataKey = `[${key}][${index}]`
                _.set(this.formData.dimensions, `${formDataKey}.value`, scaleValue.scale)
                _.set(this.formData.dimensions, `${formDataKey}.isClicked`, true)
                _.set(this.formData.dimensions, `${formDataKey}.isDisabled`, false)
                _.set(this.formData.dimensions, `${formDataKey}.isSubmitting`, false)
              }
              this.$forceUpdate()
            })
          })
        }
      }
    },
    textLabels: {
      deep: true,
      handler(val) {
        if (val.length) {
          /*  val.forEach((textLabel: any) => {
            const substatementIndex = textLabel.substatementKey.split('.substatement')[1]
            const subquestionIndex = textLabel.substatementKey.split('.')[0]
            const formDataKey = `${subquestionIndex}[${parseInt(substatementIndex) - 1}]`
            const formData = _.get(this.formData, formDataKey)
            if (formData) {
              _.set(this.formData, `${formDataKey}.isChecked`, !!textLabel.text)
              _.set(this.formData, `${formDataKey}.isSubmitting`, false)
              _.set(this.formData, `${formDataKey}.answer`, textLabel.text)
            }
          })
          Object.keys(this.formData.dimensions).forEach((key) => {
            // @ts-ignore
            const subquestionLength = this.formData[key].length
            for (let i: number = 0; i < subquestionLength; i++) {
              const substatementKey = `${key}.substatement${i + 1}`
              const isStored = val.find(
                (textLabel: any) => textLabel.substatementKey === substatementKey
              )
              if (!isStored) {
                // @ts-ignore
                this.formData[key][i].answer = ''
                // @ts-ignore
                this.formData[key][i].isSubmitting = false
              }
            }
          }) */
        }
      }
    },
    getAnnotation: {
      deep: true,
      handler(val) {
        const textBatchCount = 20
        if (val.textCountToday > 0 && val.textCountToday % textBatchCount === 0) {
          this.$nextTick(async () => {
            const questionnaireStates =
              await this.$services.questionnaire.listFinishedQuestionnaires({
                questionnaireTypeId: 1,
                limit: 1
              })
            let firstQuestionnaireEverDate = null
            if (questionnaireStates && questionnaireStates.items.length > 0) {
              const firstQuestionnaireEver = questionnaireStates.items[0].finishedAt
              firstQuestionnaireEverDate = moment(String(firstQuestionnaireEver)).format(
                'DD-MM-YYYY'
              )
            }
            this.initQuestionnaire(firstQuestionnaireEverDate)
          })
        }
      }
    },
    getQuestionnaire: {
      deep: true,
      handler(val) {
        if (val.toShow.length) {
          this.$router.push(this.localePath('/questionnaires'))
        }
      }
    },
    '$route.query': '$fetch'
  },

  async created() {
    const hasRested = this.checkRestingPeriod()
    if (hasRested) {
      await this.setLabelData()
      await this.list(this.doc.id)
    }
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
    getDimComponent(dimension: DimensionDTO) {
      if (dimension.type === 'slider') {
        return SliderInput
      } else if (dimension.type === 'checkbox') {
        return CheckboxInput
      }
    },
    getDimState(dimension: DimensionDTO) {
      return {
        ...dimension
      }
    },
    getDimConfig(item: DimensionDTO) {
      let config = { config: {} }
      if (item.metadata && item.metadata[0]) {
        config = { ...config, ...objectKeysSnakeToCamel(item.metadata[0]) }
        if (item.metadata[0].config) {
          config.config = objectKeysSnakeToCamel(item.metadata[0].config)
        }
      }
      return config.config
    },
    toggleProgressBar() {
      this.showProgressBar = !this.showProgressBar
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
      this.scaleTypes = await this.$services.scaleType.list(this.projectId)
      await this.$services.dimension.list(this.projectId).then((res) => {
        this.dimensionTypes = res.items
        this.$nextTick(() => {
          const dimensions = this.dimensionTypes.map((item) => {
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

            if (item.type === 'slider') {
              const scale = this.scaleTypes.find((scaleType) => scaleType.text === item.name)
              item.questionId = scale ? scale.id : null
            }

            item.value = ''
            item.isValidated = false
            item.isClicked = false
            item.isSubmitting = false

            return item
          })
          this.formData.dimensions = _.groupBy(dimensions, 'group')
        })
      })
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
    async list(docId) {
      if (docId) {
        this.textLabels = await this.$services.affectiveTextlabel.list(this.projectId, docId)
        this.scales = await this.$services.affectiveScale.list(this.projectId, docId)
      }
    },
    onDynamicComponentUpdateScale: _.debounce(async function ({ formDataKey, val }) {
      const base = this as any
      const dimensionData = _.get(base.formData.dimensions, formDataKey)
      if (dimensionData && dimensionData.questionId) {
        _.set(base.formData.dimensions, `${formDataKey}.isClicked`, true)
        _.set(base.formData.dimensions, `${formDataKey}.isSubmitting`, true)
        await this.$services.affectiveScale.create(
          this.projectId,
          this.doc.id,
          dimensionData.questionId,
          val
        )
        _.set(base.formData.dimensions, `${formDataKey}.isSubmitting`, false)
        await this.list(this.doc.id)
      }
    }, 100),
    async onDynamicComponentRemoveLabel({ formDataKey }) {
      const base = this as any
      const dimensionData = _.get(base.formData.dimensions, formDataKey)
      if (dimensionData && dimensionData.questionId) {
        _.set(base.formData.dimensions, `${formDataKey}.isSubmitting`, true)

        await this.$services.affectiveTextlabel.delete(
          this.projectId,
          this.doc.id,
          dimensionData.questionId
        )
        _.set(base.formData.dimensions, `${formDataKey}.isSubmitting`, false)

        await this.list(this.doc.id)
      }
    },
    async onDynamicComponentUpdateLabel({ formDataKey, value }) {
      const base = this as any
      const dimensionData = _.get(base.formData.dimensions, formDataKey)

      if (dimensionData && dimensionData.questionId) {
        _.set(base.formData.dimensions, `${formDataKey}.isSubmitting`, true)

        await this.$services.affectiveTextlabel.changeText(
          this.projectId,
          this.doc.id,
          dimensionData.questionId,
          value
        )
        _.set(base.formData.dimensions, `${formDataKey}.isSubmitting`, false)

        await this.list(this.doc.id)
      }
    },
    async onDynamicComponentAddLabel({ formDataKey, value }) {
      const base = this as any
      const dimensionData = _.get(base.formData.dimensions, formDataKey)

      if (dimensionData && dimensionData.name) {
        _.set(base.formData.dimensions, `${formDataKey}.isSubmitting`, true)
        await this.$services.affectiveTextlabel.create(
          this.projectId,
          this.doc.id,
          value,
          dimensionData.name
        )
        _.set(base.formData.dimensions, `${formDataKey}.isSubmitting`, false)

        await this.list(this.doc.id)
      }
    },
    async clear() {
      await this.clearScales()
      await this.clearTextLabels()
      this.$nextTick(async () => {
        await this.list(this.doc.id)
      })
    },
    async clearScales() {
      await this.$services.affectiveScale.clear(this.projectId, this.doc.id)
    },
    async clearTextLabels() {
      await this.$services.affectiveTextlabel.clear(this.projectId, this.doc.id)
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
      this.canConfirm = this.$refs.dimensionForm.validate()
      console.log(this.canConfirm)
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
    onConfirmationAlertClose() {
      this.hasClickedConfirmButton = false
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
.dynamic-annotation {
  .layout-text {
    position: relative;
    &__header {
      &.--sticky {
        position: sticky;

        top: 55px;
        z-index: 1;
      }

      .header-text {
        font-size: 0.875rem;
        margin: 15px 0 0;
        line-height: 1.5;
        max-height: 150px;
        overflow-y: auto;
        opacity: 0.8;
      }

      .btn-toggle {
        white-space: normal;
        word-wrap: break-word;
        text-decoration: underline;
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
