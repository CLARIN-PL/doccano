<template>
  <div>
    <p>
      {{ question }}
    </p>
    <div>
      <select-input
        v-for="(select, idx) in formData"
        @change="emitFormData"
        v-model="select.value"
        :question="select.question"
        :read-only="!!select.value"
        :key="`select-input_${idx}`"
        :options="select.options"
      />
      <v-btn
        v-if="showAddButton"
        @click="onClickAddButton"
        :disabled="formData.length === options.length"
      >
        add
      </v-btn>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import SelectInput from '~/components/questionnaires/form/SelectInput.vue'

export default Vue.extend({
  name: 'DynamicSelectInput',
  components: {
    SelectInput
  },
  props: {
    required: {
      type: Boolean,
      default: true
    },
    showAddButton: {
      type: Boolean,
      default: true
    },
    passedData: {
      type: Object,
      default: () => {}
    },
    question: {
      type: String,
      default: ''
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  created() {
    this.setFormData()
  },
  data() {
    return {
      formData: []
    }
  },
  watch: {
    formData: {
      deep: true,
      handler() {}
    }
  },
  methods: {
    emitFormData() {
      const values = _.flatMap(this.formData, 'value')
      const singleValueKey = '_single-value_'
      const hasFilledEverything = this.required
        ? this.formData.every((fData) => {
            return fData.showTextbox ? fData.value.includes(singleValueKey) : !!fData.value
          })
        : true
      this.$emit('input', values)
      this.$emit('change', { ...this.passedData, hasFilledEverything, value: values })
    },
    setFormData() {
      const option = this.options[0]
      this.formData.push({
        ...option,
        value: '',
        options: this.options
      })
    },
    onClickAddButton() {
      const values = _.flatMap(this.formData, 'value')
      const options = this.options.filter((opt) => {
        const isAdded = values.find((val) => val.includes(opt.text))
        return !isAdded
      })
      this.formData.push({
        ...options[0],
        options,
        value: ''
      })
    }
  }
})
</script>