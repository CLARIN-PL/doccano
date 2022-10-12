<template>
    <v-container class="humor-input widget">
        <v-row >
            <v-col>
                <h3 class="widget__title">{{ $t('annotation.humor.question')}}</h3>
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
                                    min="0" 
                                    max="10" 
                                    :tick-labels="zeroToTenLabels"
                                    step="1"   />
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
                                    :tick-labels="zeroToTenLabels"
                                    step="1"  >
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
                                        :disabled="!hasFilledTopQuestions"
                                        :label="$t(`annotation.humor.subquestion3.substatement${(idx+1)}`)"
                                        class="subquestions-item__checkbox" />

                                    <textfield-modal
                                        v-if="substatement.isChecked"
                                        v-model="substatement.reason"
                                        :disabled="!hasFilledTopQuestions"
                                        :question="$t(`annotation.humor.subquestion3.substatement${(idx+1)}Question`)"
                                        :full-question="`
                                            ${$t(`annotation.humor.subquestion3.substatement${(idx+1)}Question`)}
                                             (${$t(`annotation.humor.subquestion3.substatement${(idx+1)}`)})`"
                                        :rules="[rules.required]"
                                        class="subquestions-item__textfield"
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
                                            :disabled="!hasFilledTopQuestions"
                                            :label="$t(`annotation.humor.subquestion4.substatement${(idx+1)}`)" 
                                            class="subquestions-item__checkbox"
                                        />
                                    </p>
                                    </li>
                            </ul>
                        </p>
                    </li>
                </ol>
            </v-col>
        </v-row>
    </v-container>
</template>
<script lang="ts">
import Vue from 'vue'
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
    }
  },
    data() {
        return {
            rules: {
                required: (value : any) => !!value || this.$i18n.t('rules.required'),
            },
            formData: {
                subquestion1: null,
                subquestion2: null,
                subquestion3: [
                    {
                        isChecked: false,
                        reason: ''
                    },
                    {
                        isChecked: false,
                        reason: ''
                    },
                    {
                        isChecked: false,
                        reason: ''
                    },
                    {
                        isChecked: false,
                        reason: ''
                    },
                    {
                        isChecked: false,
                        reason: ''
                    },
                    {
                        isChecked: false,
                        reason: ''
                    },
                    {
                        isChecked: false,
                        reason: ''
                    },
                    {
                        isChecked: false,
                        reason: ''
                    },
                    {
                        isChecked: false,
                        reason: ''
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
        zeroToTenLabels() : number[] {
            return Array.from(Array(11).keys())
        },
        hasFilledTopQuestions() :  boolean {
            return !!this.formData.subquestion1 || 
                !!this.formData.subquestion2; 
        }
    },
    watch: {
        formData: {
            deep: true,
            handler() {
                const data = this.getMappedFormData()
                this.$emit('input', { mode: 'humor', data })
            }
        }
    },
    methods: {
        getMappedFormData() : any {
            const subquestion3 = this.formData.subquestion3.map((subquestion, index)=> {
                const substatement = this.$t(`annotation.humor.subquestion3.substatement${index+1}`)
                const substatementQuestion = this.$t(`annotation.humor.subquestion3.substatement${index+1}Question`)
                const question = `${substatement} - ${substatementQuestion}`
                return [(this.hasFilledTopQuestions && subquestion.isChecked ? subquestion.reason : ''), question]
            })
            const subquestion4 = this.formData.subquestion3.map((subquestion, index)=> {
                const substatement = this.$t(`annotation.humor.subquestion4.substatement${index+1}`)
                return [this.hasFilledTopQuestions && subquestion.isChecked, substatement]
            })
            const data = {
                scale: [
                    [this.formData.subquestion1, this.$t('annotation.humor.subquestion1')],
                    [this.formData.subquestion2, this.$t('annotation.humor.subquestion2')],
                ],
                label: subquestion3.concat(subquestion4)
            }
            return data
        }
    },
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