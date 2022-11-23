<template>
    <div>
        <small>
            {{ header }}
        </small>
        <p>
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
            ></v-radio>
        </v-radio-group>
    </div>
</template>
<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
    name: 'ScaleInput',
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