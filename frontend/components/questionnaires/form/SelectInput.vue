<template>
  <div>
    <p>
      {{ header }}
      {{ question }}
      <span v-if="required">*</span>
    </p>
    {{ input }}
    <v-select
      v-model="input"
      :items="options"
      :disabled="readOnly || isSubmitting"
      placeholder="Wybierz opcję"
      dense
      outlined
    />
    <text-input
      v-if="selectedOption.showTextbox"
      v-model="inputText"
      :read-only="isSubmitting"
      :question="selectedOption.question || selectedOption.text"
      :full-question="selectedOption.question || selectedOption.text"
      :required="required"
      @submit="onTextInputSubmit"
    />
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import TextInput from '~/components/questionnaires/form/TextInput.vue'

export default Vue.extend({
  name: 'SelectInput',
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
    passedData: {
      type: Object,
      default: () => {}
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
  data() {
    return {
      input: '',
      inputText: ''
    }
  },
  computed: {
    selectedOption() {
      const base: any = this
      const key = '_single-value_'
      const value = base.value.includes(key) ? base.value.split(key)[0] : base.value
      const option = base.options.find((option: any) => option.value === value) || {}
      return option
    }
  },
  watch: {
    input() {
      this.inputText = ''
      const key = '_single-value_'
      if (!this.selectedOption.showTextbox) {
        const value = this.inputText ? `${this.input}${key}${this.inputText}` : this.input
        this.$emit('input', value)
        this.$emit('change', { ...this.passedData, value })
      }
    },
    value() {
      const base: any = this
      const key = '_single-value_'
      this.inputText = base.value.includes(key) ? base.value.split(key)[1] : ''
      this.input = base.value.includes(key) ? base.value.split(key)[0] : base.value
    }
  },
  methods: {
    onTextInputSubmit(val: any) {
      this.inputText = val
      const key = '_single-value_'
      const value = this.inputText ? `${this.input}${key}${this.inputText}` : this.input
      this.$emit('input', value)
      this.$emit('change', { ...this.passedData, value })
    }
  }
})
</script>