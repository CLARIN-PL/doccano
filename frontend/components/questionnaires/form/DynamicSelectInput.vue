<template>
  <div>
    <p>
      {{ question }}
    </p>
    <div>
      <select-input
        v-for="(select, idx) in formData"
        :key="`select-input_${idx}`"
        v-model="select.value"
        :question="select.question"
        :read-only="!!select.value"
        :options="select.options"
        @change="emitFormData"
      />
      <v-btn
        v-if="showAddButton"
        :disabled="formData.length === options.length"
        @click="onClickAddButton"
      >
        {{ $t('questionnaires_main.buttonAddQuestion') }}
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
      default: () => [] as any[]
    }
  },
  data() {
    return {
      formData: [] as any[]
    }
  },
  created() {
    this.setFormData()
  },
  methods: {
    emitFormData() {
      const values = _.flatMap(this.formData, 'value')
      const singleValueKey = '_single-value_'
      const hasFilledEverything = this.required
        ? this.formData.every((fData) => {
            return fData.showTextbox ? fData.value.includes(singleValueKey) : !!fData.value
          }) && values.filter((val) => !!val).length
        : true
      this.$emit('input', values)
      this.$emit('change', { ...this.passedData, hasFilledEverything })
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
      const values: String[] = _.flatMap(this.formData, 'value')
      const options = this.options.filter((opt: any) => {
        const isAdded = values.find((val: String) => val.includes(opt.text))
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