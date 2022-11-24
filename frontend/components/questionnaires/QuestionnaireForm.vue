<template>
  <v-row align="center" >
    <div v-if="showGreetingCard">
        <greeting-card @click="onClickGreetingCardButton" />
    </div>
    <div v-else>
        <div ref="header">
        <v-alert
            :value="showWarning"
            color="error"
            dark
            transition="scale-transition"
            dismissible
            @input="onConfirmationAlertClose"
            >
            {{ $t('errors.incompleteAffectiveAnnotation') }}
            </v-alert>
        </div>
    <div v-if="formData.questionnaires.length">
      <v-col>
        <v-window
          v-model="activeQuestionnaire"
          class="elevation-1"
          horizontal
        >
          <v-window-item
            v-for="(questionnaire, qIdx) in formData.questionnaires"
            :key="`questionnaire-window-${qIdx}`"
          >
            <v-card flat>
              <v-card-text>
                <v-row
                  class="mb-4"
                  align="center"
                >
                  <header>
                    <strong class="text-h6">{{ questionnaire.name }}</strong>
                    <p>
                      {{ questionnaire.description }}
                    </p>
                  </header>

                  <ul>
                    <li v-for="(segment, segIdx) in questionnaire.segments" :key="`segment-${segIdx}`">
                      <div v-if="segment.scales">
                        <p>
                          {{ segment.scales.description }}
                          <ul>
                            <li v-for="(segmentScaleValue, segScalIdx) in segment.scales.values" :key="`segmentScaleValue-${segScalIdx}`">
                              {{ segmentScaleValue.value }} - {{ segmentScaleValue.text }}
                            </li>
                          </ul>
                        </p>
                      </div>

                      <div v-if="segment.questions">
                        <ul>
                            <li 
                              v-for="(segmentQuestion, segQuIdx) in segment.questions" 
                              :ref="`question_${segQuIdx}`"
                              :key="`segmentQuestion-${segQuIdx}`">
                              <p v-if="segment.prependIndex">
                                {{ segment.prependIndex+(segQuIdx+1) }}
                              </p>
                              <component 
                                v-model="segmentQuestion.value"
                                @change="onQuestionChange(segmentQuestion, segQuIdx, segIdx, qIdx)"
                                :is="getComponent(segmentQuestion.type)" 
                                :header="segmentQuestion.header"
                                :question="segmentQuestion.text"
                                :options="segmentQuestion.options"
                                :config="segmentQuestion.config"
                                :is-clicked="segmentQuestion.isClicked"
                              />
                            </li>
                        </ul>
                      </div>
                    </li>
                  </ul>
                  <footer v-html="questionnaire.footer">
                  </footer>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-btn v-if="activeQuestionnaire+1 < formData.questionnaires.length" 
                  @click="onClickContinueButton">
                  Continue to the next step 
                </v-btn>
                <v-btn v-else @click="onClickFinishButton">
                  Finish
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-window-item>
        </v-window>
      </v-col>
    </div>
    <div v-else>
      not found
      <v-btn  @click="onClickFinishButton">
        Finish
      </v-btn>
    </div>
    </div>
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  qCategories,
  setQuestionnaireIds,
  mapQuestionnaireTypes
} from "~/utils/questionnaires"
import ScaleInput from "~/components/questionnaires/form/ScaleInput.vue"
import RadioInput from '~/components/questionnaires/form/RadioInput.vue'
import TextInput from '~/components/questionnaires/form/TextInput.vue'
import SliderInput from '~/components/questionnaires/form/SliderInput.vue'
import GreetingCard from '~/components/questionnaires/GreetingCard.vue'


export default {
    layout: "questionnaire",
    components: {
      ScaleInput,
      RadioInput,
      TextInput,
      SliderInput,
      GreetingCard,
    },
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
      activeQuestionnaire: 0,
      showWarning: false,
      showGreetingCard: false,
      formData: {}
    }
  },
  computed: {
    ...mapGetters('user', ['getQuestionnaire']),
    toShowId() {
      return this.getQuestionnaire.toShow[0]
    },
    selectedQType() {
      return this.mappedQTypes.find((qType)=> qType.id === this.toShowId)
    }
  },
  fetch() {
    this.list()
  },
  created() {
    this.initialize()
    this.setFormData()
  },
  methods: {
    ...mapActions('user', ['setQuestionnaire']),
    setFormData() {
      this.formData = this.selectedQType ? _.cloneDeep(this.selectedQType) : { questionnaires: [] }
    },
    initialize() {
        this.showWarning = false
        this.showGreetingCard = false
        this.mappedQTypes = mapQuestionnaireTypes(this.qTypes)
    },
    async list() {
      const typeId = this.toShowId.split(".")[0]
      const questionnaires = await this.$services.questionnaire.listQuestionnairesByTypeId({questionnaireTypeId: typeId, limit: 50})
      const promises = _.flatMap(questionnaires.items, 'id').map((q)=> {
        return this.$services.questionnaire.listQuestionsByQuestionnaireId({questionnaireId: q, limit: 100 })
      })
      const responses = await Promise.all(promises)
      const questions = _.flatMap(responses, 'items')

      this.questionnaires = _.cloneDeep(questionnaires.items)
      this.questions = _.cloneDeep(questions)
      this.formData = setQuestionnaireIds([this.formData], this.questionnaires, this.questions)[0]
    },
    onQuestionClick(segQuIdx, segIdx, qIdx) {
      const formDataKey = `questionnaires[${qIdx}].segments[${segIdx}].questions[${segQuIdx}]`
      _.set(this.formData, `${formDataKey}.isClicked`, true)
    },
    async onQuestionChange(question, segQuIdx, segIdx, qIdx) {
      const formDataKey = `questionnaires[${qIdx}].segments[${segIdx}].questions[${segQuIdx}]`
      const formData = _.get(this.formData, `${formDataKey}`)
      const { key } = formData
      _.set(this.formData, `${formDataKey}`, {
        ...formData,
        ...{
          key: key+1,
          isSubmitting: true,
          isClicked: true
        }
      })
      this.$forceUpdate()
      if(question.id) {
        await this.$services.questionnaire.createAnswer({
          answerText: question.value,
          question: question.id
        })
        _.set(this.formData, `${formDataKey}.isValid`, true)
      } else {
        _.set(this.formData, `${formDataKey}.isValid`, false)
      }
      _.set(this.formData, `${formDataKey}.isSubmitting`, false)
    },
    getComponent(questionType) {
      if(questionType === "scale") {
        return ScaleInput
      } else if(questionType === 'radio') {
        return RadioInput
      } else if(questionType === 'text') {
        return TextInput
      } else if(questionType === 'slider') {
        return SliderInput
      }
    },
    onConfirmationAlertClose() {
      this.showWarning = false
    },
    onClickGreetingCardButton() {
      this.showGreetingCard = false
      this.showWarning = false
      this.activeQuestionnaire +=1
    },
    onClickContinueButton() {
      const selectedQuestionnaire = this.formData.questionnaires[this.activeQuestionnaire]
      if(selectedQuestionnaire) {
        const questions = _.flatMap(selectedQuestionnaire.segments, 'questions')
        const hasClickedEverything = questions.every((question)=> question.required ? question.isClicked : true)
        if(hasClickedEverything) {
            this.showGreetingCard = true
        } else {
            const firstErrorIndex = questions.findIndex((question)=> !question.isClicked )
            this.showWarning = true
            if(this.$refs[`question_${firstErrorIndex}`][0]) {
                this.$refs[`question_${firstErrorIndex}`][0].scrollIntoView({ behavior: 'smooth' });
            } else {
                this.$refs.header.scrollIntoView({behavior: 'smooth'})
            }
        }
      }
    },
    onClickFinishButton() {
      const selectedQuestionnaire = this.formData.questionnaires[this.activeQuestionnaire]
      if(selectedQuestionnaire) {
        const questions = _.flatMap(selectedQuestionnaire.segments, 'questions')
        const hasClickedEverything = questions.every((question)=> question.required ? question.isClicked : true)
        if(hasClickedEverything) {
            const { toShow, filled } = this.getQuestionnaire
            this.setQuestionnaire({
                toShow: toShow.filter((ts)=> ts !== this.toShowId ),
                inProgress: [],
                filled: !filled.includes(this.toShowId) ? filled.concat(this.toShowId) : filled,
                isWorkingNow: false
            })
            this.$router.push("/questionnaires")
        } else {
            this.showWarning = true
      }
      } else {
            const { toShow, filled } = this.getQuestionnaire
            this.setQuestionnaire({
                toShow: toShow.filter((ts)=> ts !== this.toShowId ),
                inProgress: [],
                filled: !filled.includes(this.toShowId) ? filled.concat(this.toShowId) : filled,
                isWorkingNow: false
            })
            this.$router.push("/questionnaires")
      }
    }
  }
}
</script>
