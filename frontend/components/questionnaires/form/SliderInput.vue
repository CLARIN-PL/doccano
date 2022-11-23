<template>
    <v-slider 
        v-model="sliderValue"
        class="slider"
        :class="{'--has-filled': isClicked }"
        :color="isClicked ? 'primary' : 'grey'"
        :thumb-size="isClicked ? 12 : 0"
        :thumb-color="isClicked ? 'primary' : 'transparent'"
        :track-color="isClicked ? '' : 'grey'"
        ticks="always"
        :min="min" 
        :max="max+1" 
        :readonly="readOnly || isSubmitting"
        :disabled="readOnly"
        :tick-labels="tickLabels"
        step="1"  
        @change="onSliderChange"
        >
    </v-slider>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    props: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 0
        },
        readOnly: {
            type: Boolean,
            default: false
        },
        value: {
            type: Number,
            default: 0
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
    computed: {
        tickLabels() {
            return Array.from(Array(this.max+1).keys())
        },
        sliderValue: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit('input', val)
            }
        }
    },
    methods: {
        onSliderChange($event) {
            this.$emit('input', $event)
            this.$emit('change', $event)
        }
    }
})
</script>