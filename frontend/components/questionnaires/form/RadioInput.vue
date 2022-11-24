<template>
    <div>
        <p>
            {{ header }}
            {{ question }}

            <span v-if="required">*</span>
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
            <text-input 
                v-if="selectedOption.showTextbox || !!inputText"
                @blur="onBlurTextInput"
                :question="selectedOption.text"
                :required="true"
                v-model="inputText"
             />
        </v-radio-group>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
import TextInput from "~/components/questionnaires/form/TextInput"

export default Vue.extend({
    name: 'RadioInput',
    components: {
        TextInput
    },
    props: {
        question: {
            type: String,
            default: ""
        },
        header: {
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
        isCustom() {
            return this.value && !this.options.find((option)=> option.value === this.value)
        },
        inputText: {
            get() {
                return this.isCustom? this.value : ""
            },
            set(val) {
                this.$emit("input", val)
            }
        },
        input: {
            get() {
                const customOption = this.options.find((option)=> !!option.showTextbox)
                return this.isCustom && customOption ? customOption.value : this.value
            },
            set(val) {
                this.$emit("input", val)
                if(!this.isCustom) {
                    this.$emit("change", val)
                }
            }
        }
    },
    methods: {
        onBlurTextInput(val) {
            this.$emit("change", val)
        }
    }
})
</script>