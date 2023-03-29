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
              <v-card ref="dimensionCard" class="pa-4 dimension-card --sticky">
                <v-card-text>
                  <v-form ref="dimensionForm">
                    <ul class="dimension-group-list">
                      <li
                        v-for="(key, idx) in Object.keys(formData.dimensions)"
                        :key="`dimension-group_${idx}`"
                        class="dimension-group-list__item"
                      >
                        <ol class="dimension-list">
                          <li
                            v-for="(dim, dimIdx) in getFilteredDimensions(formData.dimensions[key])"
                            :key="`dimension-group--${key}_${dimIdx}`"
                          >
                            <component
                              :is="getDimComponent(dim)"
                              :ref="`dimension_[${key}][${dimIdx}]`"
                              :key="dim.key"
                              :value="dim.value"
                              :name="dim.name"
                              :form-data-key="dim.formDataKey"
                              :item="dim"
                              :items="originalDimensions"
                              :config="getDimConfig(dim)"
                              :required="dim.metadata[0].required"
                              :read-only="!canEdit || dim.isSubmitting || dim.metadata[0].readonly"
                              class="dimension-list__item"
                              @update:scale="onDynamicComponentUpdateScale"
                              @add:label="onDynamicComponentAddLabel"
                              @delete:label="onDynamicComponentRemoveLabel"
                            />
                          </li>
                        </ol>
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

<script>
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
import { addGroupToDimensionList } from '~/utils/dynamicDimensions.js'
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
      currentArticleId: '',
      currentWholeArticle: [],
      showRestingMessage: false,
      restingEndTime: '',
      hasCheckedPreviousDoc: false,
      hasValidEntries: {},
      canConfirm: false,
      hasClickedConfirmButton: false,
      showProgressBar: false
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
      this.canConfirm = false
    })
  },

  computed: {
    ...mapGetters('auth', ['isAuthenticated', 'getUsername', 'getUserId']),
    ...mapGetters('config', ['isRTL']),
    ...mapGetters('projects', ['currentDimensions']),
    ...mapGetters('user', ['getAnnotation']),
    scaleValues() {
      return this.scales.map((scale) => {
        const scaleType = this.scaleTypes.find((scaleType) => scaleType.id === scale.label) || {}
        return {
          ...scale,
          ...scaleType,
          scaleTypeId: scale.label
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
    },
    originalDimensions() {
      let dimensions = []
      Object.keys(this.formData.dimensions).forEach((key) => {
        dimensions = [...dimensions, ...this.formData.dimensions[key]]
      })
      return dimensions
    },
    isSubmitting() {
      return this.originalDimensions.filter((dim) => dim.isSubmitting).length > 0
    }
  },

  watch: {
    scaleValues: {
      deep: true,
      handler(val) {
        if (val.length) {
          Object.keys(this.formData.dimensions).forEach((key) => {
            this.formData.dimensions[key].forEach((dim) => {
              const scaleValue = val.find((scale) => scale.text === dim.name)
              const index = this.formData.dimensions[key].indexOf(dim)
              const formDataKey = `[${key}][${index}]`
              if (scaleValue && dim.type === 'slider') {
                const isDisabled = scaleValue.scale === -1
                _.set(this.formData.dimensions, `${formDataKey}.questionId`, scaleValue.id)
                _.set(this.formData.dimensions, `${formDataKey}.value`, scaleValue.scale)
                _.set(this.formData.dimensions, `${formDataKey}.isClicked`, true)
                _.set(this.formData.dimensions, `${formDataKey}.isDisabled`, isDisabled)
                _.set(this.formData.dimensions, `${formDataKey}.isCheckboxChecked`, isDisabled)
                const formKey = _.get(this.formData.dimensions, `${formDataKey}.key`) || 0
                _.set(this.formData.dimensions, `${formDataKey}.key`, formKey + 1)
                _.set(this.formData.dimensions, `${formDataKey}.isSubmitting`, false)
              }
              this.$forceUpdate()
            })
          })
        } else {
          this.resetFormData()
        }
      }
    },
    textLabels: {
      deep: true,
      handler(val) {
        if (val.length) {
          Object.keys(this.formData.dimensions).forEach((key) => {
            this.formData.dimensions[key].forEach((dim) => {
              const textLabel = val.find((v) => v.question === dim.name)
              const index = this.formData.dimensions[key].indexOf(dim)
              const formDataKey = `[${key}][${index}]`
              const formData = _.get(this.formData.dimensions, `${formDataKey}`)
              const formKey = _.get(this.formData.dimensions, `${formDataKey}.key`) || 0
              if (dim.type === 'checkbox' && dim.isMock) {
                const value = val
                  .filter((v) => (v.text ? v.text.includes(`${dim.originalQuestion} - `) : false))
                  .map((v) => v.text)
                _.set(this.formData.dimensions, `${formDataKey}.value`, value)
                _.set(this.formData.dimensions, `${formDataKey}.isDisabled`, false)
                _.set(this.formData.dimensions, `${formDataKey}.isChecked`, true)
                _.set(this.formData.dimensions, `${formDataKey}.key`, formKey + 1)
                _.set(this.formData.dimensions, `${formDataKey}.isSubmitting`, false)
              } else if (textLabel && dim.type === 'checkbox') {
                const config = this.getDimConfig(formData)
                _.set(this.formData.dimensions, `${formDataKey}.questionId`, textLabel.id)
                let multipleAnswers =
                  typeof textLabel.text === 'string' && textLabel.text.includes('_')
                    ? textLabel.text.split('_')
                    : textLabel.text
                multipleAnswers = Array.isArray(multipleAnswers)
                  ? multipleAnswers
                  : [multipleAnswers]
                const answer = config.isMultipleAnswers ? multipleAnswers : !!textLabel.text
                _.set(this.formData.dimensions, `${formDataKey}.value`, answer)
                _.set(this.formData.dimensions, `${formDataKey}.isDisabled`, false)
                _.set(this.formData.dimensions, `${formDataKey}.isChecked`, true)
                _.set(this.formData.dimensions, `${formDataKey}.key`, formKey + 1)
                _.set(this.formData.dimensions, `${formDataKey}.isSubmitting`, false)
              } else if (!textLabel && dim.type === 'checkbox') {
                _.set(this.formData.dimensions, `${formDataKey}.questionId`, '')
                _.set(this.formData.dimensions, `${formDataKey}.value`, '')
                _.set(this.formData.dimensions, `${formDataKey}.isDisabled`, false)
                _.set(this.formData.dimensions, `${formDataKey}.isChecked`, false)
                _.set(this.formData.dimensions, `${formDataKey}.key`, 0)
                _.set(this.formData.dimensions, `${formDataKey}.isSubmitting`, false)
              }
            })

            this.$forceUpdate()
          })
        } else {
          this.resetFormData()
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
    getFilteredDimensions(dimensions) {
      return dimensions.filter((dim) => !dim.isHidden)
    },
    resetFormData() {
      Object.keys(this.formData.dimensions).forEach((key) => {
        this.formData.dimensions[key] = this.formData.dimensions[key].map((dim) => {
          if (dim.type === 'checkbox' && !this.textLabels.length) {
            dim.questionId = ''
            dim.value = false
            dim.isDisabled = false
            dim.isChecked = false
            dim.key = (dim.key || 0) + 1
            dim.isSubmitting = false
          } else if (dim.type === 'slider' && !this.scaleValues.length) {
            dim.value = 0
            dim.isDisabled = false
            dim.isClicked = false
            dim.isCheckboxChecked = false
            dim.key = (dim.key || 0) + 1
            dim.isSubmitting = false
          }
          return dim
        })
      })
    },
    getDimComponent(dimension) {
      if (dimension.type === 'slider') {
        return SliderInput
      } else if (dimension.type === 'checkbox') {
        return CheckboxInput
      }
    },
    getDimConfig(item) {
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
      let dimensions = _.cloneDeep(this.currentDimensions)
      if (!dimensions.length) {
        const response = await this.$services.dimension.list(this.projectId)
        dimensions = response.items
      }
      this.dimensionTypes = _.uniqBy(dimensions, 'name')
      const mocks = []
      const mockQuestions = []
      this.$nextTick(() => {
        let mappedDimensions = this.dimensionTypes.map((item) => {
          if (item.metadata && item.metadata.length) {
            const { config } = item.metadata[0]
            if (config) {
              const { original_question, options } = config
              if (options) {
                item.isHidden = !!original_question

                const mock = _.cloneDeep(item)
                const opts = typeof options === 'string' ? options.split('; ') : options
                mock.isMock = true
                mock.isHidden = false
                mock.originalQuestion = original_question
                mock.metadata[0].config.originalOptions = options
                mock.metadata[0].config.options = opts
                  .map((opt) => {
                    const dimName = `${original_question} - ${opt}`
                    const dim = dimensions.find((dim) => dim.name.includes(dimName))
                    return {
                      label: opt,
                      value: dim ? dim.name : opt
                    }
                  })
                  .filter((opt) => {
                    const dimName = `${original_question} - ${opt.label}`
                    const isAssigned = !!dimensions.find((dim) => dim.name.includes(dimName))
                    return isAssigned
                  })

                if (!mockQuestions.includes(mock.originalQuestion)) {
                  mocks.push(mock)
                  mockQuestions.push(mock.originalQuestion)
                }
              }
            }
          }
          if (item.type === 'slider') {
            const scale = this.scaleTypes.find((scaleType) => scaleType.text === item.name)
            item.questionId = scale ? scale.id : null
          } else if (item.type === 'checkbox') {
            const { config, codename } = item.metadata[0]
            item.value = config.is_multiple_answers ? [] : false
            item.isHidden =
              item.isHidden ||
              !!dimensions.find((dim) => dim.metadata[0].config.checkbox_codename === codename)
          }

          return item
        })
        mappedDimensions = [...mappedDimensions, ...mocks]
        mappedDimensions = addGroupToDimensionList(mappedDimensions)
        const groupedDimensions = _.groupBy(mappedDimensions, 'group')
        Object.keys(groupedDimensions).forEach((key) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          groupedDimensions[key].forEach((dim, dimIdx) => {
            const formDataKey = `[${key}][${dimIdx}]`
            _.set(groupedDimensions, `${formDataKey}.formDataKey`, formDataKey)
          })
        })
        this.formData.dimensions = _.cloneDeep(groupedDimensions)
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
      const base = this
      if (base.docs.items && base.docs.items.length) {
        const doc = base.docs.items[0]
        const isCheckedQuery = base.$route.query.isChecked || ''
        base.currentArticleId = doc.articleId
        base.currentWholeArticle = await base.$services.example.fetchByLimit(
          base.projectId,
          base.docs.count.toString(),
          base.currentArticleId,
          isCheckedQuery
        )
        base.currentWholeArticle.items = _.orderBy(base.currentWholeArticle.items, 'order')
        const allArticleIds = await base.$services.example.fetchArticleIds(
          base.projectId,
          base.docs.count.toString()
        )
        base.articleTotal = allArticleIds.length
        base.articleIndex = allArticleIds.indexOf(base.currentArticleId) + 1
      }
    },
    async list(docId) {
      if (docId) {
        this.textLabels = await this.$services.affectiveTextlabel.list(this.projectId, docId)
        this.scales = await this.$services.affectiveScale.list(this.projectId, docId)
      }
    },
    async onDynamicComponentUpdateScale({ formDataKey, value }) {
      const base = this
      const dimensionData = _.get(base.formData.dimensions, formDataKey)
      if (dimensionData && dimensionData.questionId && !dimensionData.isSubmitting) {
        _.set(base.formData.dimensions, `${formDataKey}.isSubmitting`, true)
        this.$forceUpdate()
        await this.$services.affectiveScale
          .create(this.projectId, this.doc.id, dimensionData.questionId, value)
          .then(() => {
            this.list(this.doc.id)
          })
      }
    },
    async onDynamicComponentRemoveLabel({ formDataKey, name, questionId }) {
      const base = this
      const dimensionData = base.originalDimensions.find((dim) => dim.name === name)
      if (dimensionData && questionId && !dimensionData.isSubmitting) {
        _.set(base.formData.dimensions, `${formDataKey}.isSubmitting`, true)
        this.$forceUpdate()
        await this.$services.affectiveTextlabel
          .delete(this.projectId, this.doc.id, questionId)
          .then(() => {
            this.list(this.doc.id)
          })
      }
    },
    async onDynamicComponentAddLabel({ formDataKey, name, value }) {
      const base = this
      const dimensionData = base.originalDimensions.find((dim) => dim.name === name)
      if (dimensionData && dimensionData.name && !dimensionData.isSubmitting && value) {
        _.set(base.formData.dimensions, `${formDataKey}.isSubmitting`, true)
        this.$forceUpdate()
        await this.$services.affectiveTextlabel
          .create(this.projectId, this.doc.id, value, dimensionData.name)
          .then(() => {
            this.list(this.doc.id)
          })
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
      } else {
        this.showErrors()
        this.scrollToFaultyQuestion()
      }
    },
    showErrors() {
      this.originalDimensions.forEach((origDim) => {
        const ref = `dimension_${origDim.formDataKey}`
        if (
          this.$refs[ref] &&
          this.$refs[ref][0] &&
          this.$refs[ref][0].showValidatorErrorMessages
        ) {
          this.$refs[ref][0].showValidatorErrorMessages()
        }
      })
    },
    onConfirmationAlertClose() {
      this.hasClickedConfirmButton = false
    },
    scrollToFaultyQuestion() {
      setTimeout(() => {
        const errorClass = `.v-input.error--text`
        const errorElements = Array.from(document.querySelectorAll(errorClass))
        if (errorElements && errorElements.length) {
          const y = errorElements[0].getBoundingClientRect().top + window.scrollY + -350
          window.scroll({
            top: y,
            behavior: 'smooth'
          })
        }
      }, 50)
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

.dimension-group-list {
  padding: 0;

  &__item {
    > h3 {
      margin-bottom: 15px;
    }

    list-style: none;
    padding: 15px 0;
    margin: 20px 0;

    &:not(:last-of-type) {
      border-bottom: 1px solid #ddd;
    }
  }
}

.dimension-list {
  &__item {
    margin-bottom: 10px;
  }
}
</style>
