<template>
    <v-container class="offensive-input widget" 
        :class="{'--has-error': hasErrors, '--bordered': showBorders }">
        <v-row >
            <v-col v-if="scaleTypes.length && hasProperScaleTypes">
                <h3 class="widget__title">{{ $t('annotation.offensive.question')}}</h3>
                <v-divider />
                <ol class="widget__questions">
                    <li class="widget-questions__item questions-item --visible">
                        <p class="questions-item__text">
                        <h4>
                            {{ $t('annotation.offensive.subquestion1')}}
                            <span class="red--text"> * </span>
                            <span
                                class="red--text"
                                :class="(showErrors && !formData.subquestion1.isClicked) ? 'd-block' : 'd-none'"
                            >
                                {{ $t('annotation.warningRequired') }}
                            </span>
                        </h4>
                        <div class="questions-item__slider">
                            <span class="slider-text --start">
                                {{ $t('annotation.slider.zero')}}
                            </span>
                                <v-slider 
                                    v-model="formData.subquestion1.value"
                                    class="slider"
                                    :class="{'--has-filled': formData.subquestion1.isClicked }"
                                    :color="formData.subquestion1.isClicked ? 'primary' : 'grey'"
                                    :thumb-size="formData.subquestion1.isClicked ? 12 : 0"
                                    :thumb-color="formData.subquestion1.isClicked ? 'primary' : 'transparent'"
                                    :track-color="formData.subquestion1.isClicked ? '' : 'grey'"
                                    ticks="always"
                                    ticks-size="3"
                                    :readonly="readOnly || formData.subquestion1.isSubmitting"
                                    min="0" 
                                    max="10" 
                                    :disabled="!scaleTypes.length"
                                    :tick-labels="zeroToTenLabels"
                                    step="1"   
                                    @change="onScaleChange('subquestion1')"
                                    />
                            <span class="slider-text --end">
                                {{ $t('annotation.slider.full')}}
                            </span>
                        </div>
                        </p>
                    </li>
                    <li class="widget-questions__item questions-item --visible">
                        <p class="questions-item__text">
                        <h4>
                            {{ $t('annotation.offensive.subquestion2')}}
                            <span class="red--text"> * </span>
                            <span
                                class="red--text"
                                :class="(showErrors && !formData.subquestion2.isClicked) ? 'd-block' : 'd-none'"
                            >
                                {{ $t('annotation.warningRequired') }}
                            </span>
                        </h4>
                        <div class="questions-item__slider">
                            <span class="slider-text --start">
                                {{ $t('annotation.slider.zero')}}
                            </span>
                                <v-slider 
                                    v-model="formData.subquestion2.value"
                                    class="slider"
                                    :class="{'--has-filled': formData.subquestion2.isClicked }"
                                    :color="formData.subquestion2.isClicked ? 'primary' : 'grey'"
                                    :thumb-size="formData.subquestion2.isClicked ? 12 : 0"
                                    :thumb-color="formData.subquestion2.isClicked ? 'primary' : 'transparent'"
                                    :track-color="formData.subquestion2.isClicked ? '' : 'grey'"
                                    ticks="always"
                                    min="0" 
                                    max="10" 
                                    :readonly="readOnly || formData.subquestion2.isSubmitting"
                                    :disabled="!scaleTypes.length"
                                    :tick-labels="zeroToTenLabels"
                                    step="1"  
                                    @change="onScaleChange('subquestion2')"
                                    >
                                </v-slider>
                            <span class="slider-text --end">
                                {{ $t('annotation.slider.full')}}
                            </span>
                        </div>
                        </p>
                    </li>
                    <li class="widget-questions__item questions-item"
                        :class="{'--visible': hasFilledTopQuestions}">
                        <p class="questions-item__text">
                            <h4 :class="{'red--text': !hasValidSubquestion3}">
                                {{ $t('annotation.offensive.subquestion3.question')}}
                            </h4>
                            <ul class="subquestions">
                                <li v-for="(substatement, idx) in formData.subquestion3"  
                                    :key="`substatement3_${idx}`"
                                    class="subquestions__item" >
                                    <v-checkbox 
                                        v-model="substatement.isChecked"
                                        :required="(substatement.isChecked && !substatement.answer)"
                                        :readonly="readOnly"
                                        :disabled="!hasFilledTopQuestions || substatement.isSubmitting"
                                        :label="$t(`annotation.offensive.subquestion3.substatement${(idx+1)}`)"
                                        class="subquestions-item__checkbox"
                                        @change="onLabelChange(substatement, `subquestion3`, idx)" />

                                    <textfield-modal
                                        v-if="substatement.isChecked && substatement.showTextbox"
                                        v-model="substatement.answer"
                                        :required="true"
                                        :readonly="readOnly"
                                        :disabled="!hasFilledTopQuestions || substatement.isSubmitting"
                                        :question="$t(`annotation.offensive.subquestion3.substatement${(idx+1)}Question`)"
                                        :full-question="`
                                            ${$t(`annotation.offensive.subquestion3.substatement${(idx+1)}Question`)}
                                             (${$t(`annotation.offensive.subquestion3.substatement${(idx+1)}`)})`"
                                        :rules="[rules.required]"
                                        class="subquestions-item__textfield"
                                        @submit="onLabelChange(substatement, `subquestion3`, idx)"
                                    />
                                </li>
                            </ul>
                        </p>
                    </li>
                    <li class="widget-questions__item questions-item" 
                        :class="{'--visible': hasFilledTopQuestions}">
                        <p class="questions-item__text">
                            <h4 :class="{'red--text': !hasValidSubquestion4}">
                                {{ $t('annotation.offensive.subquestion4.question')}}
                            </h4>
                                <ul class="subquestions">
                                    <li v-for="(substatement, idx) in formData.subquestion4" 
                                    :key="`substatement4_${idx}`"
                                    class="subquestions__item" >
                                    <p>
                                        <v-checkbox 
                                            v-model="substatement.isChecked"
                                            :required="(substatement.isChecked && !substatement.answer)"
                                            :readonly="readOnly"
                                            :disabled="!hasFilledTopQuestions || substatement.isSubmitting"
                                            :label="$t(`annotation.offensive.subquestion4.substatement${(idx+1)}`)" 
                                            class="subquestions-item__checkbox"
                                            @change="onLabelChange(substatement, `subquestion4`, idx)"
                                        />

                                    <textfield-modal
                                        v-if="substatement.showTextbox && substatement.isChecked"
                                        v-model="substatement.answer"
                                        :required="true"
                                        :readonly="readOnly"
                                        :disabled="!hasFilledTopQuestions || substatement.isSubmitting"
                                        :question="$t(`annotation.offensive.subquestion4.substatement${(idx+1)}Question`)"
                                        :full-question="`
                                            ${$t(`annotation.offensive.subquestion4.substatement${(idx+1)}Question`)}
                                             (${$t(`annotation.offensive.subquestion4.substatement${(idx+1)}`)})`"
                                        :rules="[rules.required]"
                                        class="subquestions-item__textfield"
                                        @submit="onLabelChange(substatement, `subquestion4`, idx)"
                                    />
                                    </p>
                                    </li>
                            </ul>
                        </p>
                    </li>
                </ol>
            </v-col>
            <v-col v-else>
                {{ $t('annotation.noScaleLabels')}}
            </v-col>
        </v-row>
    </v-container>
</template>
<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import polishAnnotation from '@/i18n/pl/projects/annotation.js'
import TextfieldModal from '~/components/tasks/affectiveAnnotation/inputs/TextfieldModal.vue'

export default Vue.extend({
  components: {
    TextfieldModal
  },
  props: {
    project: {
      type: Object,
      default: () => {}
    },
    value: {
      type: Boolean,
      default: false
    },
    doc: {
      type: Object,
      default: () => {}
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    showErrors: {
      type: Boolean,
      default: true
    },
    showBorders: {
      type: Boolean,
      default: false
    },
    scales: {
      type: Array,
      default: () => []
    },
    scaleTypes: {
      type: Array,
      default: () => []
    },
    textLabels: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      polishAnnotation,
      isLoaded: false,
      rules: {
        required: (value: any) => !!value || this.$i18n.t('rules.required')
      },
      formData: {
        subquestion1: {
          value: 0,
          isClicked: false,
          isSubmitting: false
        },
        subquestion2: {
          value: 0,
          isClicked: false,
          isSubmitting: false
        },
        subquestion3: [],
        subquestion4: []
      },
      originalFormData: {
        subquestion1: {
          value: 0,
          isClicked: false,
          isSubmitting: false
        },
        subquestion2: {
          value: 0,
          isClicked: false,
          isSubmitting: false
        },
        subquestion3: [],
        subquestion4: []
      }
    }
  },
  computed: {
    hasProperScaleTypes(): boolean {
      const scaleLabels = [
        this.polishAnnotation.offensive.subquestion1,
        this.polishAnnotation.offensive.subquestion2
      ]
      const scaleTypeTexts = _.flatMap(this.scaleTypes, 'text')
      return _.intersectionBy(scaleLabels, scaleTypeTexts).length > 0
    },
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
        const annotation = _.cloneDeep(this.polishAnnotation.offensive) as any
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
        })
        return {
          ...textLabel,
          substatementQuestion,
          substatementKey
        }
      })
    },
    zeroToTenLabels(): number[] {
      return Array.from(Array(11).keys())
    },
    hasFilledTopQuestions(): boolean {
      return !!this.formData.subquestion1.value || !!this.formData.subquestion2.value
    },
    hasValidSubquestion3(): boolean {
      if (this.showErrors && this.hasFilledTopQuestions) {
        const answersSubquestion3 = this.formData.subquestion3.filter((item:any) => item.isChecked && !!item.answer)
        console.log("Offensive - answersSubquestion3.length", answersSubquestion3.length)
        return answersSubquestion3.length > 0
      }
      return true
    },
    hasValidSubquestion4(): boolean {
      if (this.showErrors && this.hasFilledTopQuestions) {
        const answersSubquestion4 = this.formData.subquestion4.filter((item:any) => item.isChecked)
        console.log("Offensive - answersSubquestion4.length", answersSubquestion4.length)
        return answersSubquestion4.length > 0
      }
      return true
    },
    hasErrors(): boolean {
      if (this.showErrors) {
        if (!this.value) {
          console.log('A')
          return true
        }
        if (!this.formData.subquestion1.isClicked || !this.formData.subquestion2.isClicked) {
          console.log('B')
          return true
        }
        if (!this.hasValidSubquestion3 || !this.hasValidSubquestion4) {
          console.log('C')
          return true
        }
      }
      return false
    }
  },
  watch: {
    doc() {
      this.formData = _.cloneDeep(this.originalFormData)
      this.$forceUpdate()
    },
    formData: {
      deep: true,
      handler(val: any) {
        const scaleKeys = ['subquestion1', 'subquestion2']
        const labelKeys = ['subquestion3', 'subquestion4']
        const hasFilledScales = scaleKeys.some((scaleKey) => {
          return val[scaleKey].isClicked
        })
        const hasFilledAllScalesZeros = scaleKeys.every((scaleKey) => {
          return val[scaleKey].value === 0
        })
        const hasFilledAtLeastOneTextbox = labelKeys.some((labelKey) => {
          return val[labelKey].some((formData: any) => formData.isChecked)
        })
        const hasFilledCheckedTextboxes = val.subquestion3.every((substatement: any) => {
          const hasCheckedAndFilled = substatement.isChecked
            ? substatement.isChecked && !!substatement.answer && substatement.answer !== '-'
            : true
          return hasCheckedAndFilled
        })
        const canConfirm = hasFilledAllScalesZeros
          ? hasFilledScales
          : hasFilledScales && hasFilledAtLeastOneTextbox && hasFilledCheckedTextboxes

        this.isLoaded && this.$emit('input', canConfirm)
      }
    },
    scaleValues: {
      deep: true,
      handler(val) {
        if (val.length) {
          const keys = ['subquestion1', 'subquestion2']
          keys.forEach((key) => {
            const polishAnnotation: any = _.get(this.polishAnnotation.offensive, key)
            const scaleValue = val.find((scale: any) => scale.text === polishAnnotation)
            if (scaleValue) {
              _.set(this.formData, `${key}.value`, scaleValue.scale)
              _.set(this.formData, `${key}.isClicked`, true)
              _.set(this.formData, `${key}.isSubmitting`, false)
            }
          })
        } else {
          this.formData = {
            ...this.formData,
            ...{
              subquestion1: _.cloneDeep(this.originalFormData.subquestion1),
              subquestion2: _.cloneDeep(this.originalFormData.subquestion2)
            }
          }
        }
      }
    },
    textLabelValues: {
      deep: true,
      handler(val) {
        if (val.length) {
          const keys = ['subquestion3', 'subquestion4']
          val.forEach((textLabel: any) => {
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
          keys.forEach((key) => {
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
          })
        } else {
          this.formData = {
            ...this.formData,
            ...{
              subquestion3: _.cloneDeep(this.originalFormData.subquestion3),
              subquestion4: _.cloneDeep(this.originalFormData.subquestion4)
            }
          }
        }
      }
    }
  },
  async created() {
    await this.setOriginalFormData()
    this.$nextTick(() => {
      this.formData = _.cloneDeep(this.originalFormData)
    })
  },
  mounted() {
    this.isLoaded = true
  },
  methods: {
    setOriginalFormData() {
      const keys = ['subquestion3', 'subquestion4']
      const showTextboxIndexes: any = {
        subquestion3: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        subquestion4: [8]
      }
      const annotation: any = this.polishAnnotation.offensive
      keys.forEach((key) => {
        let subquestionLength = 0
        const substatement = Object.keys(annotation[key])
          .reverse()
          .find((annKey) => annKey.includes('substatement'))
        if (substatement) {
          subquestionLength = parseInt(substatement.replace(/^\D+/g, ''))
        }
        for (let i = 0; i < subquestionLength; i++) {
          // @ts-ignore
          this.originalFormData[key].push({
            isSubmitting: false,
            isChecked: false,
            showTextbox: showTextboxIndexes[key].includes(i + 1),
            answer: ''
          })
        }
      })
    },
    onScaleChange: _.debounce(function (formDataKey: string) {
      // @ts-ignore
      const base = this as any
      _.set(base.formData, `${formDataKey}.isClicked`, true)
      const formData: any = _.get(base.formData, formDataKey)
      const labelQuestion: string = base.polishAnnotation.offensive[formDataKey]
      const scaleLabel: any = base.scaleTypes.find(
        (scaleType: any) => scaleType.text === labelQuestion
      )
      if (scaleLabel && base.isLoaded && !formData.isSubmitting) {
        _.set(base.formData, `${formData.isSubmitting}`, true)
        base.$emit('update:scale', scaleLabel.id, formData.value)
      }
    }, 100),
    onLabelChange(substatement: any, key: string, index: number) {
      const formDataKey = `${key}[${index}]`
      const labelQuestionKey = `${key}.substatement${index + 1}`
      const formData = _.get(this.formData, formDataKey)
      const labelQuestion = _.get(this.polishAnnotation.offensive, labelQuestionKey)
      const parentQuestion = _.get(this.polishAnnotation.offensive, key + '.question')
      const question = `${parentQuestion} - ${labelQuestion}`

      const textLabelValue = this.textLabelValues.find(
        (textLabel: any) => textLabel.question === question
      )
      let eventName = textLabelValue ? 'update:label' : 'add:label'
      eventName = substatement.isChecked ? eventName : 'remove:label'
      if (!_.isEmpty(formData) && labelQuestion) {
        const textfieldAnswer = formData.showTextbox && !formData.answer ? '-' : formData.answer
        const answer = formData.showTextbox ? textfieldAnswer : labelQuestion
        if (eventName === 'add:label' && answer) {
          this.$emit(eventName, question, answer)
        } else if (eventName === 'update:label' && textLabelValue) {
          const substatementId = textLabelValue.id
          this.$emit(eventName, substatementId, answer)
        } else if (eventName === 'remove:label' && textLabelValue) {
          const substatementId = textLabelValue.id
          this.$emit(eventName, substatementId)
        }
        _.set(this.formData, formDataKey + '.isSubmitting', !!answer)
      }
    }
  }
})
</script>
<style lang="scss">
.offensive-input {
  overflow-y: auto;

  &.--bordered {
    border: 2px solid #ddd;
    border-radius: 2px;

    &.--has-error {
      border: 2px solid red;
    }
  }
}

.widget {
  font-size: 0.8rem;

  &__title {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 10px;
  }

  &__questions {
    padding: none;
  }
}

.questions-item {
  opacity: 0.3;

  &.--visible {
    opacity: 1;
  }

  &__slider {
    display: flex;

    .v-slider__tick-label {
      font-size: 0.8rem;
    }

    .slider-text {
      color: gray;
      margin-top: 5px;

      &.--start {
        margin-right: 10px;
      }

      &.--end {
        margin-left: 10px;
      }
    }
  }
}

.subquestions {
  list-style-type: none;
  padding: 0;

  &__item {
    .subquestions-item__checkbox {
      .v-label {
        font-size: 0.8rem;
      }

      .v-input__slot {
        margin: 0;
      }
    }
  }
}
</style>