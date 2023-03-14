<template>
  <v-form ref="sliderForm" v-model="valid">
    <v-row>
      <v-col cols="4" sm="4">
        <v-text-field
          v-model.number="formData.sliderMin"
          :disabled="loading"
          label="Min"
          type="number"
          :rules="[
            rules.required,
            rules.min0,
            rules.maxMargin,
            rules.number,
            rules.mustBeLesserThanMax
          ]"
          outlined
          required
        />
      </v-col>
      <v-col cols="4" sm="4">
        <v-text-field
          v-model.number="formData.sliderMax"
          :disabled="loading"
          type="number"
          label="Max"
          :rules="[
            rules.required,
            rules.min1,
            rules.mustBeBiggerThanMin,
            rules.maxMargin,
            rules.number
          ]"
          outlined
          required
        />
      </v-col>
      <v-col cols="4" sm="4">
        <v-text-field
          v-model.number="formData.sliderStep"
          :disabled="loading"
          type="number"
          label="Step"
          :rules="[rules.required, rules.mustBeWithinMargin, rules.number, rules.min01]"
          outlined
          required
        />
      </v-col>
      <v-col cols="6" sm="6" class="pt-0">
        <v-text-field
          v-model.trim="formData.minValDescription"
          :disabled="loading"
          :counter="50"
          :rules="[rules.maxLength50]"
          label="Min val description"
          outlined
        />
      </v-col>
      <v-col cols="6" sm="6" class="pt-0">
        <v-text-field
          v-model.trim="formData.maxValDescription"
          :disabled="loading"
          :counter="50"
          :rules="[rules.maxLength50]"
          label="Max val description"
          outlined
        />
      </v-col>
      <v-col cols="12" sm="12">
        <v-checkbox
          v-model="formData.withCheckbox"
          :disabled="loading"
          class="dimension-form__checkbox"
          label="With checkbox"
          color="primary"
          :required="formData.withCheckbox"
          :rules="[rules.mustSetCheckboxName]"
        />
      </v-col>
      <v-col cols="12" sm="12">
        <v-select
          v-model="formData.checkboxCodename"
          v-show="Boolean(formData.withCheckbox)"
          :disabled="loading"
          :items="checkboxOptions"
          label="Checkbox codename"
          :required="Boolean(formData.withCheckbox)"
          :rules="[rules.required, rules.mustSetCheckboxName]"
          outlined
        />
      </v-col>
    </v-row>
  </v-form>
</template>
<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: {
    required: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    items: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      valid: false,
      checkboxOptions: [] as any[],
      maxMargin: 20,
      formData: {
        sliderMin: 0,
        sliderMax: 10,
        sliderStep: 1,
        minValDescription: '',
        maxValDescription: '',
        withCheckbox: false,
        checkboxCodename: ''
      }
    }
  },
  computed: {
    rules() {
      const base = this
      return {
        min0: (v: string) => parseInt(v) >= 0 || 'Must be bigger or equal to 0',
        min01: (v: string) => Number(v) >= 0.1 || 'Must be bigger or equal to 0.1',
        min1: (v: string) => parseInt(v) >= 1 || 'Must be bigger or equal to 1',
        maxMargin: () =>
          base.formData.sliderMax - base.formData.sliderMin <= base.maxMargin ||
          'Difference should be lesser or equal to 20',
        number: (v: string) => !Number.isNaN(Number(v)) || 'Must be number',
        integer: (v: string) => Number.isInteger(Number(v)) || 'Must be integer',
        maxLength50: (v: string) => v.length <= 50 || 'Length must be less or equal to 50',
        mustBeWithinMargin: (v: string) =>
          parseInt(v) <= base.formData.sliderMax - base.formData.sliderMin ||
          'Must be within difference of max and min',
        mustBeLesserThanMax: (v: string) =>
          parseInt(v) < base.formData.sliderMax || 'Must be lesser than max',
        mustBeBiggerThanMin: (v: string) =>
          parseInt(v) >= base.formData.sliderMin || 'Must be bigger or equal to min',
        mustSetCheckboxName: () =>
          base.formData.withCheckbox
            ? base.formData.checkboxCodename !== ''
            : true || 'Please set checkbox codename',
        required: (v: string) =>
          String(v) !== 'undefined' || String(v) !== '' || String(v) !== 'null' || 'Required'
      }
    }
  },

  watch: {
    formData: {
      deep: true,
      handler(val) {
        this.$emit('update:slider', val)
      }
    },
    valid(val) {
      this.$emit('input', val)
    }
  },

  created() {
    this.setCheckboxOptions()
  },

  methods: {
    setCheckboxOptions() {
      this.checkboxOptions = this.items
        .filter((item: any) => item.type === 'checkbox')
        .map((item: any) => {
          return {
            value: item.metadata[0].codename,
            text: item.name
          }
        })
    }
  }
})
</script>

<style lang="scss" scoped>
.dimension-form {
  &__checkbox {
    margin-top: 0;
  }
}
</style>
    