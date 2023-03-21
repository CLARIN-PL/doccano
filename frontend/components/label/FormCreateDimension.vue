<template>
  <v-card>
    <v-card-title class="mb-10">{{ $t('labels.addDimension') }} </v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6">
          <v-row>
            <v-form ref="form" v-model="valid" class="dimension-form">
              <v-col cols="12" sm="12">
                <v-radio-group
                  v-model="formData.isCreatingNewDimension"
                  @change="setAssignedDimensions"
                >
                  <v-radio :label="$t('labels.createNewDimension')" :value="true"></v-radio>
                  <v-radio
                    :label="$t('labels.assignPredefinedDimension')"
                    :disabled="hasAddedAllPredefinedDimensions"
                    :value="false"
                  ></v-radio>
                </v-radio-group>
              </v-col>
              <template v-if="formData.isCreatingNewDimension">
                <v-col cols="12" sm="12" class="pb-0">
                  <v-text-field
                    v-model.trim="formData.dimensionName"
                    :counter="100"
                    :disabled="loading"
                    :label="$t('labels.dimensionName')"
                    :rules="[
                      rules.required,
                      rules.nameDuplicated,
                      rules.maxLength100,
                      rules.nameStringOnly
                    ]"
                    outlined
                    required
                    @input="$emit('update:text', $event)"
                  />
                </v-col>
                <v-col cols="12" sm="6" class="pt-0">
                  <v-checkbox
                    v-model="formData.required"
                    :disabled="loading"
                    :label="$t('rules.required')"
                    color="primary"
                    required
                    hide-details
                    class="dimension-form__checkbox"
                  />
                </v-col>
                <v-col cols="12" sm="6" class="pt-0">
                  <v-checkbox
                    v-model="formData.readOnly"
                    :disabled="loading"
                    class="dimension-form__checkbox"
                    :label="$t('rules.readOnly')"
                    color="primary"
                    required
                    hide-details
                  />
                </v-col>
                <v-col cols="12" sm="12">
                  <v-select
                    v-model="formData.dimensionType"
                    :disabled="loading"
                    :items="dimensionTypeOptions"
                    :rules="[rules.required]"
                    :label="$t('labels.dimensionType')"
                    outlined
                    required
                  />
                </v-col>
                <v-col cols="12" sm="12" class="dimension-form__detail">
                  <component
                    :is="getDimensionDetailFormComponent(formData.dimensionType)"
                    v-model="isDimensionDetailFormValid"
                    :loading="loading"
                    :required="formData.required"
                    :items="assignedDimensions"
                    v-bind.sync="formData"
                  />
                </v-col>
              </template>
              <template v-else>
                <v-col cols="12" sm="12" class="dimension-form__detail">
                  <dimension-input
                    v-model="formData.dimensions"
                    :assigned-dimensions="assignedDimensions"
                    :required="true"
                  />
                </v-col>
              </template>
            </v-form>
          </v-row>
        </v-col>
        <v-col v-if="formData.isCreatingNewDimension" cols="12" sm="6">
          <div class="dimension-form__preview" :class="{ '--preview': formData.dimensionType }">
            <component
              :is="getDimensionDetailPreviewComponent(formData.dimensionType)"
              :name="formData.dimensionName"
              :items="assignedDimensions"
              :use-value="true"
              :value="formData.dimensionType === 'slider' ? 0 : false"
              :playground="true"
              :config="formData[formData.dimensionType]"
              :required="formData.required"
              :read-only="loading || formData.readOnly"
            />
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" sm="12" class="pt-10">
          <v-spacer />
          <slot :valid="valid">
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="loading"
              @click="onClickSaveButton"
              >{{ $t('labels.save') }}</v-btn
            >
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="loading"
              outlined
              @click="onClickSaveAndAddButton"
            >
              {{ $t('labels.saveAndAddAnother') }}
            </v-btn>
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="loading"
              outlined
              @click="onClickClearButton"
            >
              {{ $t('overview.clear') }}
            </v-btn>
          </slot>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import { mdiReload } from '@mdi/js'
import SliderForm from './SliderForm.vue'
import CheckboxForm from './CheckboxForm.vue'

import CheckboxInput from '~/components/tasks/dynamicAnnotation/CheckboxInput.vue'
import SliderInput from '~/components/tasks/dynamicAnnotation/SliderInput.vue'
import DimensionInput from '~/components/tasks/dynamicAnnotation/DimensionInput.vue'

export default Vue.extend({
  components: {
    SliderForm,
    CheckboxForm,
    SliderInput,
    CheckboxInput,
    DimensionInput
  },

  data() {
    return {
      valid: false,
      loading: false,
      assignedDimensions: [] as any[],
      allDimensions: [] as any[],
      isDimensionDetailFormValid: false,
      dimensionTypeOptions: [
        {
          value: 'slider',
          text: 'Slider'
        },
        {
          value: 'checkbox',
          text: 'Checkbox'
        }
      ],
      formData: {
        dimensions: [] as any[],
        dimensionName: '',
        dimensionType: '',
        isCreatingNewDimension: true,
        required: false,
        readOnly: false,
        slider: {
          sliderMin: 0,
          sliderMax: 10,
          sliderStep: 1,
          minValDescription: '',
          maxValDescription: '',
          withCheckbox: false,
          checkboxCodename: ''
        },
        checkbox: {
          isMultipleAnswers: false,
          minAnswerNumber: 1,
          maxAnswerNumber: 1,
          options: []
        }
      },
      mdiReload
    }
  },

  computed: {
    projectId() {
      return this.$route.params.id
    },
    hasAddedAllPredefinedDimensions(): boolean {
      const base: any = this
      return _.differenceBy(base.allDimensions, base.assignedDimensions, 'name').length === 0
    },
    rules() {
      const base: any = this
      return {
        required: (v: string) => !!v || base.$t('rules.required'),
        nameStringOnly: (
          v: string // @ts-ignore
        ) => {
          const pattern = /^[A-Za-z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż, -]+$/
          return pattern.test(v) || base.$i18n.t('annotation.warningInvalidChar')
        },
        maxLength100: (
          v: string // @ts-ignore
        ) => (v && v.length <= 100) || base.$t('rules.labelNameRules').labelLessThan100Chars,
        nameDuplicated: (
          v: string // @ts-ignore
        ) => !base.isUsedName(v) || base.$t('rules.labelNameRules').duplicated
      }
    }
  },

  async created() {
    const base: any = this
    await base.setDimensionList()
  },

  mounted() {
    if (this.$refs.form) {
      // @ts-ignore
      this.$refs.form.resetValidation()
    }
  },

  methods: {
    async setAssignedDimensions() {
      const base = this as any
      await base.$services.dimension.list(base.projectId).then((response: any) => {
        base.assignedDimensions = response.items
      })
    },
    async setDimensionList() {
      const base = this as any
      await base.$services.dimension.listAllDimensions().then((response: any) => {
        base.allDimensions = response.items
      })
      base.setAssignedDimensions()
    },
    getDimensionDetailPreviewComponent() {
      const base = this as any
      if (base.formData.dimensionType === 'slider') {
        return SliderInput
      } else if (base.formData.dimensionType === 'checkbox') {
        return CheckboxInput
      }
    },
    getDimensionDetailFormComponent() {
      const base = this as any
      if (base.formData.dimensionType === 'slider') {
        return SliderForm
      } else if (base.formData.dimensionType === 'checkbox') {
        return CheckboxForm
      }
    },
    resetForm() {
      const base: any = this
      const refForm: any = base.$refs.form
      refForm && refForm.resetValidation()
      base.formData = {
        ...base.formData,
        ...{
          dimensions: [],
          dimensionName: '',
          dimensionType: '',
          isCreatingNewDimension: true,
          required: false,
          readOnly: false,
          slider: {
            sliderMin: 0,
            sliderMax: 10,
            sliderStep: 1,
            minValDescription: '',
            maxValDescription: '',
            withCheckbox: false,
            checkboxCodename: ''
          },
          checkbox: {
            isMultipleAnswers: false,
            minAnswerNumber: 1,
            maxAnswerNumber: 1,
            options: []
          }
        }
      }
    },
    getCreateDimensionFormRequest(): any {
      const base = this as any
      const dynamicGroups = base.assignedDimensions.filter((item: any) => item.group === 'Dynamic')
      const request = {
        name: base.formData.dimensionName,
        type: base.formData.dimensionType,
        dimension_meta_data: [
          {
            codename: `DIM_DYN_${dynamicGroups.length + 1}`,
            config: {},
            required: Number(base.formData.required),
            readonly: Number(base.formData.readOnly)
          }
        ]
      }
      if (base.formData.dimensionType === 'slider') {
        request.dimension_meta_data[0].config = {
          slider_min: base.formData.slider.sliderMin,
          slider_max: base.formData.slider.sliderMax,
          slider_step: base.formData.slider.sliderStep,
          with_checkbox: Number(base.formData.slider.withCheckbox),
          minVal_description: base.formData.slider.minValDescription,
          maxVal_description: base.formData.slider.maxValDescription
        }
        if (base.formData.slider.withCheckbox) {
          // @ts-ignore
          request.dimension_meta_data[0].config.checkbox_codename =
            base.formData.slider.checkboxCodename
        }
      } else if (base.formData.dimensionType === 'checkbox') {
        request.dimension_meta_data[0].config = {
          is_multiple_answers: Number(base.formData.checkbox.isMultipleAnswers),
          min_answer_number: base.formData.checkbox.minAnswerNumber,
          max_answer_number: base.formData.checkbox.maxAnswerNumber,
          options: base.formData.checkbox.options.map((opt: any) => {
            return opt.text
          })
        }
      }
      return request
    },
    async createDimension(redirect = true) {
      const base = this as any
      const valid = await base.validateForm()
      if (valid) {
        const request = base.getCreateDimensionFormRequest()
        base.loading = true
        base.$emit('submit:create', { request, redirect })
        base.resetForm()
        base.loading = false
      } else {
        base.loading = false
      }
    },
    async addExistingDimension(redirect = true) {
      const base = this as any
      const valid = await base.validateForm()
      if (valid) {
        const request = { dimension: base.formData.dimensions }
        base.loading = true
        base.$emit('submit:add', { request, redirect })
        base.resetForm()
        base.loading = false
      } else {
        console.error('Failed to add dimension')
        base.loading = false
      }
    },
    onClickSaveButton() {
      const base = this as any
      if (base.formData.isCreatingNewDimension) {
        base.createDimension(true)
      } else {
        base.addExistingDimension(true)
      }
    },
    async validateForm() {
      const base = this as any
      let valid = true
      const refForm: any = base.$refs.form
      if (refForm) {
        valid = await refForm.validate()
      }
      if (base.formData.isCreatingNewDimension) {
        const request = base.getCreateDimensionFormRequest()
        // hacky, v-form validation doesnt work with multiple nested elements
        if (request.type === 'slider') {
          const additionalCheck = request.dimension_meta_data[0].config.with_checkbox
            ? !!request.dimension_meta_data[0].config.checkbox_codename
            : true
          valid = valid && additionalCheck
        } else if (request.type === 'checkbox') {
          const additionalCheck = request.dimension_meta_data[0].config.is_multiple_answers
            ? request.dimension_meta_data[0].config.min_answer_number <=
                request.dimension_meta_data[0].config.max_answer_number &&
              request.dimension_meta_data[0].config.min_answer_number <=
                request.dimension_meta_data[0].config.options.length &&
              request.dimension_meta_data[0].config.max_answer_number <=
                request.dimension_meta_data[0].config.options.length &&
              request.dimension_meta_data[0].config.options.filter((opt: any) => !!opt).length &&
              !request.dimension_meta_data[0].config.options.find((opt: any) => !opt)
            : true
          valid = valid && additionalCheck
        }
      }
      return valid
    },
    onClickClearButton() {
      // @ts-ignore
      this.resetForm()
    },
    onClickSaveAndAddButton() {
      const base = this as any
      if (base.formData.isCreatingNewDimension) {
        base.createDimension(false)
      } else {
        base.addExistingDimension(false)
      }
    },
    isUsedName(text: string): boolean {
      const base = this as any
      return base.assignedDimensions.filter((item: any) => item.name === text).length > 0
    }
  }
})
</script>
<style lang="scss" scoped>
.dimension-form {
  width: 100%;

  &__checkbox {
    margin-top: 0;
  }

  &__detail {
    padding-top: 20px;
  }

  &__preview {
    padding: 10px;

    &.--preview {
      border: 1px solid #ddd;
    }
  }
}
</style>
