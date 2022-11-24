<template>
  <div>
    <p>
      {{ header }}
      {{ question }}
      <span v-if="required">*</span>
    </p>
    <v-radio-group v-model="input">
      <v-radio
        v-for="(option, idx) in options"
        :key="idx"
        :disabled="readOnly || isSubmitting"
        :label="option.text"
        :value="option.value"
      >
      </v-radio>
      <text-input
        v-if="selectedOption.showTextbox"
        v-model="inputText"
        :question="selectedOption.text"
        :required="required"
        @blur="onBlurTextInput"
      />
    </v-radio-group>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import TextInput from '~/components/questionnaires/form/TextInput.vue'

export default Vue.extend({
  name: 'RadioInput',
  components: {
    TextInput
  },
  props: {
    question: {
      type: String,
      default: ''
    },
    header: {
      type: String,
      default: ''
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    isSubmitting: {
      type: Boolean,
      default: false
    },
    isClicked: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    value: {
      type: [String, Number],
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    },
    errorMessage: {
      type: String,
      default: ''
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    selectedOption() {
      // @ts-ignore
      return this.options.find((option: any) => option.value === this.input) || {}
    },
    isCustom() {
      // @ts-ignore
      return this.value && !this.options.find((option: any) => option.value === this.value)
    },
    inputText: {
      get() {
        // @ts-ignore
        return this.isCustom ? this.value : ''
      },
      set(val) {
        // @ts-ignore
        const base: any = this
        base.$emit('input', val)
        base.$emit('change', val)
      }
    },
    input: {
      get() {
        const base: any = this
        const customOption: any = base.options.find((option: any) => !!option.showTextbox)
        return base.isCustom && customOption ? customOption.value : base.value
      },
      set(val) {
        const base: any = this
        base.$emit('input', val)
        base.$emit('change', val)
      }
    }
  },
  methods: {
    onBlurTextInput(val: String) {
      this.$emit('change', val)
    }
  }
})
</script>