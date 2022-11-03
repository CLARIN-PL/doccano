<template>
    <v-container class="humor-input widget">
        <v-row >
            <v-col v-if="scaleTypes.length && hasProperScaleTypes">
                <h3 class="widget__title">{{ $t('annotation.humor.question')}}</h3>
                <v-divider />
                <ol class="widget__questions">
                    <li class="widget-questions__item questions-item --visible">
                        <p class="questions-item__text">
                        <h4>
                            {{ $t('annotation.humor.subquestion1')}}
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
                                    :readonly="readOnly"
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
                            {{ $t('annotation.humor.subquestion2')}}
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
                                    :readonly="readOnly"
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
                                {{ $t('annotation.humor.subquestion3.question')}}
                            </h4>
                            <ul class="subquestions">
                                <li v-for="(substatement, idx) in formData.subquestion3"  
                                    :key="`substatement3_${idx}`"
                                    class="subquestions__item" >
                                    <v-checkbox 
                                        v-model="substatement.isChecked" 
                                        :readonly="readOnly"
                                        :disabled="!hasFilledTopQuestions"
                                        :label="$t(`annotation.humor.subquestion3.substatement${(idx+1)}`)"
                                        class="subquestions-item__checkbox"
                                        @change="onLabelChange(substatement, `subquestion3`, idx)" />

                                    <textfield-modal
                                        v-if="substatement.isChecked"
                                        v-model="substatement.answer"
                                        :required="true"
                                        :readonly="readOnly"
                                        :disabled="!hasFilledTopQuestions"
                                        :question="$t(`annotation.humor.subquestion3.substatement${(idx+1)}Question`)"
                                        :full-question="`
                                            ${$t(`annotation.humor.subquestion3.substatement${(idx+1)}Question`)}
                                             (${$t(`annotation.humor.subquestion3.substatement${(idx+1)}`)})`"
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
                                {{ $t('annotation.humor.subquestion4.question')}}
                            </h4>
                                <ul class="subquestions">
                                    <li v-for="(substatement, idx) in formData.subquestion4" 
                                    :key="`substatement4_${idx}`"
                                    class="subquestions__item" >
                                    <p>
                                        <v-checkbox 
                                            v-model="substatement.isChecked" 
                                            :readonly="readOnly"
                                            :disabled="!hasFilledTopQuestions"
                                            :label="$t(`annotation.humor.subquestion4.substatement${(idx+1)}`)" 
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
    readOnly: {
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
                required: (value : any) => !!value || this.$i18n.t('rules.required'),
            },
            formData: {
                subquestion1: 0,
                subquestion2: 0,
                subquestion3: [
                    {
                        isChecked: false,
                        answer: ''
                    }
                ],
                subquestion4: [
                    {
                        isChecked: false,
                    }
                ]
            },
            originalFormData: {
                subquestion1: 0,
                subquestion2: 0,
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
        hasProperScaleTypes() : boolean {
            const scaleLabels = [this.polishAnnotation.humor.subquestion1, this.polishAnnotation.humor.subquestion2]
            const scaleTypeTexts = _.flatMap(this.scaleTypes, 'text')
            return _.intersectionBy(scaleLabels, scaleTypeTexts).length > 0
        },
        scaleValues() : any[] {
            return this.scales.map((scale: any) => {
                const scaleType : any = this.scaleTypes.find((scaleType: any) => scaleType.id === scale.label) || {}
                return {
                    ...scale,
                    ...scaleType,
                    scaleTypeId: scale.label
                }
            })
        },
        textLabelValues() : any[] {
            return this.textLabels.map((textLabel: any) => {
                const substatementQuestion = textLabel.question
                const annotation = _.cloneDeep(this.polishAnnotation.humor) as any
                let substatementKey = ''
                Object.keys(annotation).forEach((subKey: string) => {
                    if(typeof annotation[subKey] === 'object') {
                        Object.keys(annotation[subKey]).every((subKey2: string) => {
                            const isKey = annotation[subKey][subKey2] === textLabel.question
                            if(isKey) {
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
        zeroToTenLabels() : number[] {
            return Array.from(Array(11).keys())
        },
        hasFilledTopQuestions() : boolean {
            return !!this.formData.subquestion1 || 
                !!this.formData.subquestion2; 
        },
    },
    watch: {
        doc() {
            this.formData = _.cloneDeep(this.originalFormData)
            this.$forceUpdate()
        },
        scaleValues: {
            deep: true,
            handler(val) {
                if(val.length) {
                    const keys = ['subquestion1', 'subquestion2']
                    keys.forEach((key)=> {
                        const polishAnnotation : any = _.get(this.polishAnnotation.humor, key)
                        const scaleValue = val.find((scale: any)=> scale.text === polishAnnotation)
                        if(scaleValue) {
                            _.set(this.formData, key, scaleValue.scale)
                        } 
                    })
                } else {
                    this.formData = {
                        ...this.formData, 
                        ...{
                            subquestion1: 0,
                            subquestion2: 0
                        }
                    }
                }
            }
        },
        textLabelValues: {
            deep: true,
            handler(val) {
                if(val.length) {
                    val.forEach((textLabel : any) => {
                        const substatementIndex = textLabel.substatementKey.split('.substatement')[1]
                        const subquestionIndex = textLabel.substatementKey.split(".")[0]
                        const formDataKey = `${subquestionIndex}[${parseInt(substatementIndex)-1}]`
                        const formData = _.get(this.formData, formDataKey)
                        if(formData) {
                            _.set(this.formData, `${formDataKey}.isChecked`, !!textLabel.text)
                            _.set(this.formData, `${formDataKey}.answer`, textLabel.text)
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
    created() {
        this.formData = _.cloneDeep(this.originalFormData)
    },
    mounted() {
        this.isLoaded = true;
    },
    methods: {
        onScaleChange: _.debounce(function (formDataKey: string) {
            // @ts-ignore
            const base = this as any
            const value : number = _.get(base.formData, formDataKey) || 0
            const labelQuestion : string = base.polishAnnotation.humor[formDataKey]
            const scaleLabel : any = base.scaleTypes.find((scaleType: any)=> scaleType.text === labelQuestion)
            if(scaleLabel && base.isLoaded) {
                base.$emit('update:scale', scaleLabel.id, value)
            } 
        }, 100),
        onLabelChange(substatement: any, key: string, index: number) {
            const formDataKey = `${key}[${index}]`
            const labelQuestionKey = `${key}.substatement${index+1}`
            const formData = _.get(this.formData, formDataKey)
            const labelQuestion = _.get(this.polishAnnotation.humor, labelQuestionKey)
            const question = `${labelQuestion}`

            const textLabelValue = this.textLabelValues.find((textLabel : any) => textLabel.question === question)
            let eventName = textLabelValue ? 'update:label' : 'add:label'
            eventName = substatement.isChecked ? eventName : 'remove:label'
            if(!_.isEmpty(formData) && labelQuestion) {
                const answer = formData.answer === undefined ? labelQuestion : formData.answer
                if(eventName === 'add:label' && answer) {
                    this.$emit(eventName, question, answer)
                } else if(eventName === 'update:label' && textLabelValue) {
                    const substatementId = textLabelValue.id
                    this.$emit(eventName, substatementId, answer)
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
.humor-input {
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