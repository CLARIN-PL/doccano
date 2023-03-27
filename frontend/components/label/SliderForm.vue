<template>
  <v-form ref="sliderForm" v-model="valid">
    <v-row>
      <v-col cols="4" sm="4">
        <v-text-field
          v-model.number="formData.sliderMin"
          :disabled="loading"
          :label="$t('labels.min')"
          type="number"
          :rules="[
            rules.required,
            rules.min0,
            rules.integer,
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
          :label="$t('labels.max')"
          :rules="[
            rules.required,
            rules.min1,
            rules.integer,
            rules.mustBeBiggerOrEqualThanMin,
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
          :label="$t('labels.step')"
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
          :rules="[rules.maxLength50, rules.nameStringOnly]"
          :label="$t('labels.minValDescription')"
          outlined
        />
      </v-col>
      <v-col cols="6" sm="6" class="pt-0">
        <v-text-field
          v-model.trim="formData.maxValDescription"
          :disabled="loading"
          :counter="50"
          :rules="[rules.maxLength50, rules.nameStringOnly]"
          :label="$t('labels.maxValDescription')"
          outlined
        />
      </v-col>
      <v-col cols="12" sm="12">
        <v-checkbox
          v-model="formData.withCheckbox"
          :disabled="loading"
          class="dimension-form__checkbox"
          :label="$t('labels.withCheckbox')"
          color="primary"
          :required="formData.withCheckbox"
          :rules="[rules.mustSetCheckboxName]"
        />
      </v-col>
      <v-col cols="12" sm="12">
        <v-select
          v-show="Boolean(formData.withCheckbox)"
          v-model="formData.checkboxCodename"
          :disabled="loading"
          :items="checkboxOptions"
          :label="$t('labels.checkboxCodename')"
          :required="Boolean(formData.withCheckbox)"
          :error-messages="
            formData.withCheckbox && !formData.checkboxCodename ? $t('rules.required') : ''
          "
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
      maxStringLength: 50,
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
        min0: (v: string) =>
          parseInt(v) >= 0 || this.$t('rules.mustBeBiggerOrEqualTo', { value: 0 }),
        min01: (v: string) =>
          Number(v) >= 0.1 || this.$t('rules.mustBeBiggerOrEqualTo', { value: 0.1 }),
        min1: (v: string) =>
          parseInt(v) >= 1 || this.$t('rules.mustBeBiggerOrEqualTo', { value: 1 }),
        nameStringOnly: (
          v: string // @ts-ignore
        ) => {
          const pattern = /^[A-Za-z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż,().! -]+$/
          return v ? pattern.test(v) : true || this.$i18n.t('annotation.warningInvalidChar')
        },
        maxMargin: () =>
          base.formData.sliderMax / base.formData.sliderStep <= base.maxMargin ||
          this.$t('rules.diffMustBeLesserOrEqualTo', { value: base.maxMargin }),
        number: (v: string) => !Number.isNaN(Number(v)) || this.$i18n.t('rules.mustBeNumber'),
        integer: (v: string) => Number.isInteger(Number(v)) || this.$i18n.t('rules.mustBeInteger'),
        maxLength50: (v: string) =>
          v.length <= base.maxStringLength ||
          this.$i18n.t('rules.lengthMustBeLesserOrEqualTo', { value: 50 }),
        mustBeWithinMargin: (v: string) =>
          parseInt(v) <= base.formData.sliderMax - base.formData.sliderMin ||
          this.$i18n.t('rules.mustBeWithinDifferenceOfMaxAndMin'),
        mustBeLesserThanMax: (v: string) =>
          parseInt(v) < base.formData.sliderMax || this.$i18n.t('rules.mustBeLesserThanMax'),
        mustBeBiggerOrEqualThanMin: (v: string) =>
          parseInt(v) >= base.formData.sliderMin ||
          this.$i18n.t('rules.mustBeBiggerOrEqualThanMin'),
        mustSetCheckboxName: () =>
          base.formData.withCheckbox
            ? base.formData.checkboxCodename !== ''
            : true || this.$t('rules.checkboxCodenameRequired'),
        required: (v: string) =>
          String(v) !== 'undefined' ||
          String(v) !== '' ||
          String(v) !== 'null' ||
          base.$t('rules.required')
      }
    }
  },

  watch: {
    formData: {
      deep: true,
      handler(val) {
        this.$refs.sliderForm.validate()
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
        .filter(
          (item: any) => item.type === 'checkbox' && !item.metadata[0].config.is_multiple_answers
        )
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
    