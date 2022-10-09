<template>
    <v-container class="offensive-input widget">
        <v-row >
            <v-col>
                <h3 class="widget__title">{{ $t('annotation.offensive.question')}}</h3>
                <ol class="widget__questions">
                    <li class="widget-questions__item questions-item">
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
                                    ticks="always"
                                    min="0" max="10" 
                                    :tick-labels="zeroToTenLabels"
                                    step="1"   />
                            <span class="slider-text --end">
                                {{ $t('annotation.slider.full')}}
                            </span>
                        </div>
                        </p>
                    </li>
                    <li class="widget-questions__item questions-item">
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
                    <li class="widget-questions__item questions-item">
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
                                        :label="$t(`annotation.offensive.subquestion3.substatement${(idx+1)}`)"
                                        class="subquestions-item__checkbox" />
                                    <v-text-field  
                                        v-if="substatement.isChecked"
                                        outlined
                                        :required="substatement.isChecked"
                                        autofocus
                                        :label="
                                            $t(`annotation.offensive.subquestion3.substatement${(idx+1)}Question`)"
                                        v-model.trim="substatement.reason" 
                                        :rules="[rules.required]"
                                        class="subquestions-item__textfield" />
                                </li>
                            </ul>
                        </p>
                    </li>
                    <li class="widget-questions__item questions-item">
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
                                            :label="$t(`annotation.offensive.subquestion4.substatement${(idx+1)}`)" 
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

export default Vue.extend({
    data() {
        return {
            rules: {
                required: (value : any) => !!value || this.$i18n.t('rules.required'),
            },
            formData: {
                subquestion1: 0,
                subquestion2: 0,
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
        zeroToTenLabels() {
            return Array.from(Array(10).keys())
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

    &__slider {
        display: flex;

        .v-slider__tick-label {
            font-size: .8rem;
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