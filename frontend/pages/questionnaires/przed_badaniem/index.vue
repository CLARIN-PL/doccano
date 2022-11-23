<template>
  <v-row align="center" >
    <div v-if="formData">
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
                              :key="`segmentQuestion-${segQuIdx}`">
                              <p v-if="segment.prependIndex">
                                {{ segment.prependIndex+(segQuIdx+1) }}
                              </p>
                              <component 
                                @change="onQuestionChange(segmentQuestion, segQuIdx, segIdx, qIdx)"
                                :key="segmentQuestion.key"
                                :is="getComponent(segmentQuestion.type)" 
                                :header="segmentQuestion.header"
                                :question="segmentQuestion.text"
                                :options="segmentQuestion.options"
                                :min="segmentQuestion.min"
                                :max="segmentQuestion.max"
                                :min-label="segmentQuestion.minLabel"
                                :max-label="segmentQuestion.maxLabel"
                                :is-clicked="segmentQuestion.isClicked"
                                v-model="segmentQuestion.value"
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
  </v-row>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  qTypes, 
} from "./js/questionnaires"
import {
  qCategories,
  setQuestionnaireIds,
  mapQuestionnaireTypes
} from "~/utils/questionnaires"
import ScaleInput from "~/components/questionnaires/form/ScaleInput.vue"
import RadioInput from '~/components/questionnaires/form/RadioInput.vue'
import TextInput from '~/components/questionnaires/form/TextInput.vue'
import SliderInput from '~/components/questionnaires/form/SliderInput.vue'


export default {
    layout: "questionnaire",
    components: {
      ScaleInput,
      RadioInput,
      TextInput,
      SliderInput
    },
  data() {
    return {
      qCategories,
      qTypes: mapQuestionnaireTypes(qTypes),
      questionnaires: [],
      questions: [],
      activeQuestionnaire: "",
      formData: {}
    }
  },
  computed: {
    ...mapGetters('user', ['getQuestionnaire']),
    toShowId() {
      return this.getQuestionnaire.toShow[0]
    },
    selectedQType() {
      return this.qTypes.find((qType)=> qType.id === this.toShowId)
    }
  },
  fetch() {
    this.list()
  },
  created() {
    this.setQuestionnaireData()
    this.setFormData()
  },
  methods: {
    ...mapActions('user', ['setQuestionnaire']),
    setFormData() {
      this.formData = _.cloneDeep(this.selectedQType)
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
    setQuestionnaireData() {
      // check when data is loaded
      // do something
    },
    onQuestionChange(question, segQuIdx, segIdx, qIdx) {
      let key = _.get(this.formData, `questionnaires[${qIdx}].segments[${segIdx}].questions[${segQuIdx}].key`)
      _.set(this.formData, `questionnaires[${qIdx}].segments[${segIdx}].questions[${segQuIdx}].isClicked`, true)
      _.set(this.formData, `questionnaires[${qIdx}].segments[${segIdx}].questions[${segQuIdx}].key`, key++)

      console.log(question)
      // do something
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
    onClickContinueButton() {
      // make sure all questions are already filled
      this.activeQuestionnaire +=1
    },
    onClickFinishButton() {
      const { toShow, filled } = this.getQuestionnaire
      this.setQuestionnaire({
        toShow: toShow.filter((ts)=> ts !== this.toShowId ),
        inProgress: [],
        filled: filled.concat(this.toShowId),
        isWorkingNow: false
      })
      this.$router.push("/questionnaires")
      // continue to the next questionnaire
      // do something
    }
  }
}
</script>
