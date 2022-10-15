<template>
    <v-container class="offensive-input widget">
        <v-row >
            <v-col v-if="scaleTypes.length">
                <h3 class="widget__title">{{ $t('annotation.offensive.question')}}</h3>
                <ol class="widget__questions">
                    <li class="widget-questions__item questions-item --visible">
                        <p class="questions-item__text">
                        <h4>
                            {{ $t('annotation.offensive.subquestion1')}}
                        </h4>
                        <div class="questions-item__slider">
                            <span class="slider-text --start">
                                {{ $t('annotation.slider.zero')}}
                            </span>
                                <v-slider 
                                    v-model="formData.subquestion1"
                                    class="slider"
                                    :class="{'--has-filled': formData.subquestion1 }"
                                    ticks="always"
                                    min="0" 
                                    max="10" 
                                    :disabled="!scaleTypes.length"
                                    :tick-labels="zeroToTenLabels"
                                    step="1"   
                                    @input="onScaleChange('subquestion1')"
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
                        </h4>
                        <div class="questions-item__slider">
                            <span class="slider-text --start">
                                {{ $t('annotation.slider.zero')}}
                            </span>
                                <v-slider 
                                    v-model="formData.subquestion2"
                                    class="slider"
                                    :class="{'--has-filled': formData.subquestion2 }"
                                    ticks="always"
                                    min="0" 
                                    max="10" 
                                    :disabled="!scaleTypes.length"
                                    :tick-labels="zeroToTenLabels"
                                    step="1"  
                                    @input="onScaleChange('subquestion2')"
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
                            <h4>
                                {{ $t('annotation.offensive.subquestion3.question')}}
                            </h4>
                            <ul class="subquestions">
                                <li v-for="(substatement, idx) in formData.subquestion3"  
                                    :key="`substatement3_${idx}`"
                                    class="subquestions__item" >
                                    <v-checkbox 
                                        v-model="substatement.isChecked" 
                                        :disabled="!hasFilledTopQuestions"
                                        :label="$t(`annotation.offensive.subquestion3.substatement${(idx+1)}`)"
                                        class="subquestions-item__checkbox"
                                        @change="onLabelChange(substatement, `subquestion3`, idx)" />

                                    <textfield-modal
                                        v-if="substatement.isChecked"
                                        v-model="substatement.answer"
                                        :disabled="!hasFilledTopQuestions"
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
                            <h4>
                                {{ $t('annotation.offensive.subquestion4.question')}}
                            </h4>
                                <ul class="subquestions">
                                    <li v-for="(substatement, idx) in formData.subquestion4" 
                                    :key="`substatement4_${idx}`"
                                    class="subquestions__item" >
                                    <p>
                                        <v-checkbox 
                                            v-model="substatement.isChecked" 
                                            :disabled="!hasFilledTopQuestions"
                                            :label="$t(`annotation.offensive.subquestion4.substatement${(idx+1)}`)" 
                                            class="subquestions-item__checkbox"
                                            @change="onLabelChange(substatement, `subquestion4`, idx)"
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
    doc: {
        type: Object,
        default: () => {}
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
                required: (value : any) => !!value || this.$i18n.t('rules.required'),
            },
            formData: {
                subquestion1: null,
                subquestion2: null,
                subquestion3: [
                    {
                        isChecked: false,
                        answer: ''
                    },
                    {
                        isChecked: false,
                        answer: ''
                    },
                    {
                        isChecked: false,
                        answer: ''
                    },
                    {
                        isChecked: false,
                        answer: ''
                    },
                    {
                        isChecked: false,
                        answer: ''
                    },
                    {
                        isChecked: false,
                        answer: ''
                    },
                    {
                        isChecked: false,
                        answer: ''
                    },
                    {
                        isChecked: false,
                        answer: ''
                    },
                    {
                        isChecked: false,
                        answer: ''
                    }
                ],
                subquestion4: [
                    {
                        isChecked: false,
                    },
                    {
                        isChecked: false,
                    },
                    {
                        isChecked: false,
                    },
                    {
                        isChecked: false,
                    },
                    {
                        isChecked: false,
                    },
                    {
                        isChecked: false,
                    },
                    {
                        isChecked: false,
                    },
                    {
                        isChecked: false,
                    },
                ]
            }
        }
    },
    computed: {
        scaleValues() {
            return this.scales.map((scale: any) => {
                const scaleType = this.scaleTypes.find((scaleType: any) => scaleType.id === scale.label)
                return {
                    ...scale,
                    ...(scaleType || {}),
                    scaleTypeId: scale.label
                }
            })
        },
        textLabelValues() {
            return this.textLabels.map((textLabel: any) => {
                const substatements = textLabel.question.split('##')
                const substatementQuestion = substatements.length > 1 ? substatements[1] : substatements[0]
                const substatementKey = substatements.length > 1 ? substatements[0] : ''
                return {
                    ...textLabel,
                    substatementQuestion,
                    substatementKey
                }
            })
        },
        zeroToTenLabels() : number[] {
            return Array.from(Array(11).keys())
        },
        hasFilledTopQuestions() :  boolean {
            return !!this.formData.subquestion1 || 
                !!this.formData.subquestion2; 
        },
    },
    watch: {
        scaleValues: {
            deep: true,
            handler(val) {
                const keys = ['subquestion1', 'subquestion2']
                keys.forEach((key)=> {
                    const polishAnnotation : any = this.polishAnnotation.offensive[key]
                    const scaleValue = val.find((scale)=> scale.text === polishAnnotation)
                    if(scaleValue) {
                        this.formData[key] = scaleValue.scale
                    } 
                })
            }
        },
        textLabelValues: {
            deep: true,
            handler(val) {
                val.forEach((textLabel : any) => {
                    const substatementIndex = textLabel.substatementKey.split('.substatement')[1] || 0
                    const subquestionIndex = textLabel.substatementKey.split(".")[0]
                    const formDataKey = `${subquestionIndex}[${parseInt(substatementIndex)-1}]`
                    const formData = _.get(this.formData, formDataKey)
                    if(formData) {
                        _.set(this.formData, `${formDataKey}.isChecked`, !!textLabel.text)
                        _.set(this.formData, `${formDataKey}.answer`, textLabel.text)
                     }
                })                
            }
        }
    },
    mounted() {
        this.isLoaded = true;
    },
    methods: {
        onScaleChange: _.debounce(function (formDataKey: string) {
            const value = this.formData[formDataKey] || 0
            const labelQuestion = this.polishAnnotation.offensive[formDataKey]
            const scaleLabel = this.scaleTypes.find((scaleType: any)=> scaleType.text === labelQuestion)
            if(scaleLabel && this.isLoaded) {
                this.$emit('update:scale', scaleLabel.id, value)
            } 
        }, 100),
        onLabelChange(substatement: any, key: string, index: number) {
            const formDataKey = `${key}[${index}]`
            const labelQuestionKey = `${key}.substatement${index+1}`
            const formData = _.get(this.formData, formDataKey)
            const labelQuestion = _.get(this.polishAnnotation.offensive, labelQuestionKey)
            const question = `${labelQuestionKey}##${labelQuestion}`

            const textLabelValue = this.textLabelValues.find((textLabel : any) => textLabel.question === question)
            let eventName = textLabelValue ? 'update:label' : 'add:label'
            eventName = substatement.isChecked ? eventName : 'remove:label'
            if(!_.isEmpty(formData) && labelQuestion) {
                const answer = formData.answer === undefined ? `${labelQuestionKey}##1` : formData.answer
                if(eventName === 'add:label' && answer) {
                    this.$emit(eventName, question, answer)
                } else if(eventName === 'update:label' && textLabelValue) {
                    const substatementId = textLabelValue.id
                    this.$emit(eventName, substatementId, formData.answer)
                } else if(eventName === 'remove:label' && textLabelValue) {
                    const substatementId = textLabelValue.id
                    this.$emit(eventName, substatementId)
                }
            } 
        }
    }
})
</script>
<style lang="scss">
.offensive-input {
    max-height: 400px;
    overflow-y: auto;
}

.widget {
    font-size: .8rem;

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
    opacity: .3;

    &.--visible {
        opacity: 1;
    }

    &__slider {
        display: flex;

        .v-slider__tick-label {
            font-size: .8rem;
        }

        .slider {
            .v-slider__thumb {
                opacity: .8;
                background-color: white !important;
                border: 1px solid #ddd !important; 
            }

            &.--has-filled {
                .v-slider__thumb {
                    opacity: 1;
                    background-color: #1976d2 !important;
                    border-color: #1976d2 !important;
                }
            }
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
                font-size: .8rem;
            }

            .v-input__slot {
                margin: 0
            }
        }
    }
}
</style>