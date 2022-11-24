<template>
    <div>
        {{ question }}
        <span v-if="required">*</span>
        <v-slider 
            v-model="sliderValue"
            class="slider"
            :class="{'--has-filled': isClicked }"
            :color="isClicked ? 'primary' : 'grey'"
            :thumb-size="isClicked ? 12 : 0"
            :thumb-color="isClicked ? 'primary' : 'transparent'"
            :track-color="isClicked ? '' : 'grey'"
            ticks="always"
            :min="config.min" 
            :max="config.max+1" 
            :readonly="readOnly || isSubmitting"
            :disabled="readOnly"
            :tick-labels="tickLabels"
            step="1"  
            >
        </v-slider>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        config: {
            type: Object,
            default() {
                return {
                    min: 0,
                    max: 0,
                    minLabel: "",
                    maxLabel: ""
                }
            }
        },
        readOnly: {
            type: Boolean,
            default: false
        },
        question: {
            type: String,
            default: ""
        },
        value: {
            type: Number,
            default: 0
        },
        required: {
            type: Boolean,
            default: false
        },
        isClicked: {
            type: Boolean,
            default: false
        },
        isSubmitting: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            isLoaded: false
        }
    },
    mounted() {
        this.isLoaded = true
    },
    computed: {
        tickLabels() {
            return Array.from(Array(this.config.max+1).keys())
        },
        sliderValue: {
            get() {
                return this.value
            },
            set(val) {
                if(this.isLoaded) {
                    this.$emit('input', val)
                    this.$emit('change', val)
                }
            }
        }
    },
})
</script>