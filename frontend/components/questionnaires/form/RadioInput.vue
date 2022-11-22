<template>
    <div>
        <p>
            {{ question }}
        </p>
        <v-radio-group 
            v-model="input"
        >
            <v-radio
                v-for="(option, idx) in options"
                :key="idx"
                :disabled="readOnly"
                :label="option.text"
                :value="option.value"
            >
            </v-radio>
            <v-text-field v-if="selectedOption.showTextbox" />
        </v-radio-group>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'RadioInput',
    props: {
        question: {
            type: String,
            default: ""
        },
        readOnly: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        },
        value: {
            type: [String, Number],
            default: ""
        },
        options: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        selectedOption() {
            return this.options.find((option)=> option.value === this.input ) || {}
        },
        input: {
            get() {
                return this.value
            },
            set(val) {
                this.$emit("input", val)
            }
        }
    }
})
</script>