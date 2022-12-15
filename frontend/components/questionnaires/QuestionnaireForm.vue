<template>
  <v-row align="center" justify="center">
    <v-col cols="9">
      <div ref="header">
        <v-alert v-model="showWarning" color="error" dark transition="scale-transition" dismissible>
          {{ $t('errors.incompleteAffectiveAnnotation') }}
        </v-alert>
      </div>
      <div
        v-if="formData.questionnaires && formData.questionnaires.length && isLoaded"
        class="questionnaire-container"
      >
        <v-col>
          <v-window
            v-model="activeQuestionnaire"
            class="questionnaire-window elevation-1"
            horizontal
          >
            <v-window-item
              v-for="(questionnaire, qIdx) in formData.questionnaires"
              :key="`questionnaire-window-${qIdx}`"
            >
              <v-row align="top" justify="center">
                <v-col cols="8">
                  <v-card>
                    <v-card-text>
                      <v-row class="mb-4" align="center">
                        <v-col>
                          <p class="text-caption">
                            {{ questionnaire.description }}
                          </p>
                          <ul class="pa-0">
                            <li
                              v-for="(segment, segIdx) in questionnaire.segments"
                              :key="`segment-${segIdx}`"
                              class="hide-list-style"
                            >
                              <div
                                v-if="segment.scales"
                                class="segment-description-container text-caption"
                              >
                                <p>
                                  {{ segment.scales.description }}
                                </p>
                              </div>

                              <div v-if="segment.questions">
                                <ol
                                  :class="
                                    segment.prependIndex
                                      ? 'segment-question hide-list-style'
                                      : 'segment-question'
                                  "
                                >
                                  <li
                                    v-for="(segmentQuestion, segQuIdx) in segment.questions"
                                    :ref="`question_${qIdx}_${segQuIdx}`"
                                    :key="`segmentQuestion-${segQuIdx}`"
                                  >
                                    <div v-if="segmentQuestion.id" class="question-container">
                                      <span v-if="segment.prependIndex">
                                        {{ segment.prependIndex + (segQuIdx + 1) }}
                                      </span>
                                      <component
                                        :is="getComponent(segmentQuestion.type)"
                                        v-model="segmentQuestion.value"
                                        :header="segmentQuestion.header"
                                        :required="segmentQuestion.required"
                                        :question="segmentQuestion.text"
                                        :options="segmentQuestion.options"
                                        :config="segmentQuestion.config"
                                        :is-clicked="segmentQuestion.isClicked"
                                        :is-submitting="segmentQuestion.isSubmitting"
                                        :error-message="segmentQuestion.errorMessage"
                                        :read-only="segmentQuestion.readOnly"
                                        :passed-data="{
                                          question: segmentQuestion,
                                          formDataKey: getFormDataKey(segQuIdx, segIdx, qIdx)
                                        }"
                                        @change="onQuestionChange"
                                      />
                                    </div>
                                    <p v-else>
                                      {{ $t('questionnaires_main.errorDataMapping') }}
                                    </p>
                                  </li>
                                </ol>
                              </div>

                              <v-divider
                                v-if="segIdx < questionnaire.segments.length - 1"
                                class="mt-10 mb-10"
                              />
                            </li>
                          </ul>
                          <!-- eslint-disable-next-line vue/no-v-html -->
                          <footer v-html="questionnaire.footer" />
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-divider />
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        v-if="activeQuestionnaire + 1 < formData.questionnaires.length"
                        color="primary"
                        @click="onClickContinueButton"
                      >
                        {{ $t('questionnaires_main.buttonFinish') }}
                      </v-btn>
                      <v-btn v-else color="primary" @click="onClickFinishButton">
                        {{ $t('questionnaires_main.buttonFinish') }}
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-col>
                <v-col cols="4" class="sticky-container">
                  <v-card
                    v-if="questionnaire.segments[0].scales"
                    :class="showWarning ? 'sticky-offset' : 'sticky'"
                  >
                    <v-card-text>
                      <div class="segment-description-container text-caption">
                        <ul class="hide-list-style">
                          <li
                            v-for="(segmentScaleValue, segScalIdx) in questionnaire.segments[0]
                              .scales.values"
                            :key="`segmentScaleValue-${segScalIdx}`"
                          >
                            {{ segmentScaleValue.value }} - {{ segmentScaleValue.text }}
                          </li>
                        </ul>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
        </v-col>
      </div>
      <div
        v-else-if="formData.questionnaires && !formData.questionnaires.length && isLoaded"
        class="align-right"
      >
        <v-card>
          <v-card-text>
            {{ $t('questionnaires_main.errorNotFound') }}
          </v-card-text>
          <v-divider />
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="onClickFinishButton">
              {{ $t('questionnaires_main.buttonFinish') }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </div>
      <div v-else-if="!isLoaded">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { qCategories, setQuestionnaireIds, mapQuestionnaireTypes } from '~/utils/questionnaires'
import ScaleInput from '~/components/questionnaires/form/ScaleInput.vue'
import RadioInput from '~/components/questionnaires/form/RadioInput.vue'
import TextInput from '~/components/questionnaires/form/TextInput.vue'
import SliderInput from '~/components/questionnaires/form/SliderInput.vue'
import GreetingCard from '~/components/questionnaires/GreetingCard.vue'

export default {
  components: {
    ScaleInput,
    RadioInput,
    TextInput,
    SliderInput,
    GreetingCard
  },
  layout: 'questionnaire',
  props: {
    qTypes: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      qCategories,
      mappedQTypes: [],
      questionnaires: [],
      questions: [],
      questionnaireStates: [],
      activeQuestionnaire: 0,
      isLoaded: false,
      showWarning: false,
      formData: {
        questionnaires: []
      }
    }
  },
  async fetch() {
    if (this.toShowId) {
      await this.list()
      this.setFormData()
    }
  },
  computed: {
    ...mapGetters('user', ['getQuestionnaire', 'getProject']),
    toShowId() {
      return this.getQuestionnaire.toShow[0]
    }
  },
  created() {
    this.initialize()
  },
  methods: {
    ...mapActions('user', ['setQuestionnaire']),
    setFormData() {
      const selectedQType = this.mappedQTypes.find((qType) => qType.id === this.toShowId)
      const formData = selectedQType ? _.cloneDeep(selectedQType) : { questionnaires: [] }
      this.formData = setQuestionnaireIds(
        [formData],
        this.questionnaires,
        this.questions,
        this.questionnaireStates
      )[0]
      const toFillQuestionnaireId = this.formData.questionnaires.findIndex((q) => !q.isFinished)
      if (~toFillQuestionnaireId) {
        this.activeQuestionnaire = toFillQuestionnaireId
      } else {
        this.setQuestionnaireHistory()
        this.$router.push(this.localePath('/questionnaires'))
      }
    },
    initialize() {
      this.showWarning = false
      this.mappedQTypes = mapQuestionnaireTypes(this.qTypes)
      this.$nextTick(() => {
        this.isLoaded = true
      })
    },
    async list() {
      const typeId = this.toShowId.split('.')[0]
      const limit = 100
      const questionnaires = await this.$services.questionnaire.listQuestionnairesByTypeId({
        questionnaireTypeId: typeId,
        limit
      })
      const promises = _.flatMap(questionnaires.items, 'id').map((q) => {
        return this.$services.questionnaire.listQuestionsByQuestionnaireId({
          questionnaireId: q,
          limit
        })
      })
      const questionnaireStates = await this.$services.questionnaire.listFinishedQuestionnaires({
        questionnaireTypeId: typeId,
        limit
      })
      const responses = await Promise.all(promises)
      const questions = _.flatMap(responses, 'items')

      this.questionnaires = _.cloneDeep(questionnaires.items)
      this.questions = _.cloneDeep(questions)
      this.questionnaireStates = _.cloneDeep(questionnaireStates.items)
    },
    getFormDataKey(segQuIdx, segIdx, qIdx) {
      return `questionnaires[${qIdx}].segments[${segIdx}].questions[${segQuIdx}]`
    },
    async onQuestionChange({ question, formDataKey, hasFilledEverything, isClicked }) {
      if (question && formDataKey) {
        hasFilledEverything = hasFilledEverything ?? true
        isClicked = isClicked ?? hasFilledEverything
        const hasValue =
          typeof question.value !== 'undefined' && question.value !== null && question.value !== ''
        const { key } = question
        _.set(this.formData, `${formDataKey}`, {
          ...question,
          ...{
            key: key + 1,
            isSubmitting: true,
            isClicked
          }
        })
        this.$forceUpdate()

        if (question.id && hasValue) {
          _.set(this.formData, `${formDataKey}.isSubmitting`, true)
          await this.$services.questionnaire.createAnswer({
            answerText: question.value,
            question: question.id
          })
        } else if (question.id && !question.value && !question.required) {
          _.set(
            this.formData,
            `${formDataKey}.errorMessage`,
            'You cannot delete this field once it is filled'
          )
          this.$forceUpdate()
        }
        _.set(this.formData, `${formDataKey}.isSubmitting`, false)
        _.set(this.formData, `${formDataKey}.errorMessage`, '')

        this.$forceUpdate()
      }
    },
    getComponent(questionType) {
      if (questionType === 'scale') {
        return ScaleInput
      } else if (questionType === 'radio') {
        return RadioInput
      } else if (questionType === 'text') {
        return TextInput
      } else if (questionType === 'slider') {
        return SliderInput
      }
    },
    scrollToFaultyQuestion(id, questions = []) {
      const firstErrorIndex = questions.findIndex((question) => !question.isClicked)
      this.showWarning = true
      const component = this.$refs[`question_${id}_${firstErrorIndex}`]
      if (component && component[0]) {
        component[0].scrollIntoView({ behavior: 'smooth' })
      } else {
        this.$refs.header.scrollIntoView({ behavior: 'smooth' })
      }
    },
    async createQuestionnaireFinishedState() {
      const selectedQuestionnaire = this.formData.questionnaires[this.activeQuestionnaire]
      await this.$services.questionnaire.createQuestionnaireFinishedState(selectedQuestionnaire.id)
    },
    onClickContinueButton() {
      const selectedQuestionnaire = this.formData.questionnaires[this.activeQuestionnaire]
      if (selectedQuestionnaire) {
        const questions = _.flatMap(selectedQuestionnaire.segments, 'questions')
        const hasClickedEverything = questions.every((question) =>
          question.required && question.isValid ? question.isClicked : true
        )
        if (hasClickedEverything) {
          this.createQuestionnaireFinishedState()
          this.showWarning = false
          this.activeQuestionnaire += 1
          window.scrollTo({ top: 0, behavior: 'smooth' })
        } else {
          this.scrollToFaultyQuestion(this.activeQuestionnaire, questions)
        }
      }
    },
    setQuestionnaireHistory() {
      const { toShow, filled } = this.getQuestionnaire
      const { completedProjectsCount } = this.getProject
      const specialCombinations = [['4.3', completedProjectsCount]]
      const specialCombinationIds = specialCombinations.map((sc) => sc[0])
      let id = this.toShowId
      if (specialCombinationIds.includes(this.toShowId)) {
        const combination = specialCombinations.find((sc) => sc.join('_').includes(this.toShowId))
        id = combination.join('_')
      }
      this.setQuestionnaire({
        toShow: toShow.filter((ts) => !ts.startsWith(this.toShowId)),
        inProgress: [],
        filled: !filled.includes(id) ? filled.concat(id) : filled,
        isWorkingNow: false
      })
    },
    goToNextQuestionnaire() {
      const { toShow } = this.getQuestionnaire
      if (toShow.length) {
        const toShowId = toShow[0].split('.')[0]
        const { key } = qCategories.find((qc) => String(qc.id) === toShowId)
        this.$router.push(this.localePath(`/questionnaires/${key}`))
      } else {
        this.$router.push(this.localePath('/projects'))
      }
    },
    onClickFinishButton() {
      const selectedQuestionnaire = this.formData.questionnaires[this.activeQuestionnaire]
      if (selectedQuestionnaire) {
        const questions = _.flatMap(selectedQuestionnaire.segments, 'questions')
        const hasClickedEverything = questions.every((question) =>
          question.required && question.isValid ? question.isClicked : true
        )
        if (hasClickedEverything) {
          this.createQuestionnaireFinishedState()
          this.setQuestionnaireHistory()
          this.goToNextQuestionnaire()
        } else {
          this.scrollToFaultyQuestion(questions)
        }
      } else {
        this.setQuestionnaireHistory()
        this.$router.push(this.localePath('/questionnaires'))
      }
    }
  }
}
</script>

<style lang="scss">
.questionnaire-window {
  padding: 20px;
  position: relative;
  z-index: 0;
}

.segment-description-container,
.question-container {
  margin-bottom: 20px;
}

.hide-list-style {
  list-style: none;
  padding-left: 0 !important;
}

.sticky-container {
  z-index: 0;
}

.sticky {
  position: fixed;
  top: 90px;
  min-width: 250px;
  max-width: 270px;
  overflow-x: visible;
  z-index: 1;
}

.sticky-offset {
  position: fixed;
  top: 200px;
  min-width: 250px;
  max-width: 270px;
  overflow-x: visible;
  z-index: 1;
}
</style>
