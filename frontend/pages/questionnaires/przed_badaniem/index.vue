<template>
  <v-row align="center" >
    <div v-if="selectedQType">
      <v-col>
        <v-window
          v-model="activeQuestionnaire"
          class="elevation-1"
          horizontal
        >
          <v-window-item
            v-for="(questionnaire, index) in selectedQType.questionnaires"
            :key="`questionnaire-window-${index}`"
          >
            <v-card flat>
              <v-card-text>
                <v-row
                  class="mb-4"
                  align="center"
                >
                  <header>
                    <strong class="text-h6">{{ questionnaire.title }}</strong>
                    <p>
                      {{ questionnaire.description }}
                    </p>
                  </header>

                  <ul>
                    <li v-for="(segment, idx) in questionnaire.segments" :key="`segment-${idx}`">
                      <div v-if="segment.scales">
                        <p>
                          {{ segment.scales.description }}
                          <ul>
                            <li v-for="(segmentScaleValue, idx) in segment.scales.values" :key="`segmentScaleValue-${idx}`">
                              {{ segmentScaleValue.value }} - {{ segmentScaleValue.text }}
                            </li>
                          </ul>
                        </p>
                      </div>

                      <div v-if="segment.questions">
                        <ul>
                            <li 
                              v-for="(segmentQuestion, idx) in segment.questions" 
                              :key="`segmentQuestion-${idx}`">
                              <component 
                                @change="onQuestionChange(segmentQuestion, idx)"
                                :is="getComponent(segmentQuestion.type)" 
                                :question="segmentQuestion.text"
                                :options="segmentQuestion.options"
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
                <v-btn v-if="activeQuestionnaire+1 < selectedQType.questionnaires.length" 
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
  mapQuestionnaireTypes
} from "~/utils/questionnaires"
import ScaleInput from "~/components/questionnaires/form/ScaleInput.vue"


export default {
    name: "PrzedBadaniem",
    layout: "questionnaire",
    components: {
      ScaleInput
    },
  data() {
    return {
      qCategories,
      qTypes: mapQuestionnaireTypes(qTypes),
      activeQuestionnaire: ""
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
    this.getQuestionsList()
  },
  created() {
    this.setQuestionnaireData()
  },
  methods: {
    ...mapActions('user', ['setQuestionnaire', 'setIsWorkingOnQuestionnaire']),
    getQuestionsList() {
      // 
    },
    setQuestionnaireData() {
      // check when data is loaded
      // do something
    },
    onQuestionChange(question, index) {
      console.log(question, index)
      // do something
    },
    getComponent(questionType) {
      if(questionType === "scale") {
        return ScaleInput
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
        filled: filled.concat(this.toShowId)
      })
      this.setIsWorkingOnQuestionnaire(false)
      this.$router.push("/questionnaires")
      // continue to the next questionnaire
      // do something
    }
  }
}
</script>
