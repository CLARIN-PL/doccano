<template>
  <v-card>
    <v-card-title class="mb-10">Add Dimension</v-card-title>
    <v-card-text>
      <v-row>
        <v-col cols="12" sm="6">
          <v-row>
            <v-form ref="form" v-model="valid" class="dimension-form">
              <v-col cols="12" sm="12">
                <v-radio-group v-model="formData.isCreatingNewDimension">
                  <v-radio label="Create new dimension" :value="true"></v-radio>
                  <v-radio
                    label="Add predefined dimensions"
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
                    label="Dimension Name"
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
                    label="Required"
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
                    label="Read only"
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
                    label="Dimension type"
                    outlined
                    required
                  />
                </v-col>
                <v-col cols="12" sm="12" class="dimension-form__detail">
                  <component
                    v-model="isDimensionDetailFormValid"
                    :is="getDimensionDetailFormComponent(formData.dimensionType)"
                    :loading="loading"
                    :required="formData.required"
                    :items="items"
                    v-bind.sync="formData"
                  />
                </v-col>
              </template>
              <template v-else>
                <v-col cols="12" sm="12" class="dimension-form__detail">
                  <dimension-input
                    v-model="formData.dimensions"
                    :assigned-dimensions="items"
                    :required="true"
                    question="Dimensions"
                  />
                </v-col>
              </template>
            </v-form>
          </v-row>
        </v-col>
        <v-col cols="12" sm="6" v-if="formData.isCreatingNewDimension">
          <div class="dimension-form__preview" :class="{ '--preview': formData.dimensionType }">
            <component
              :is="getDimensionDetailPreviewComponent(formData.dimensionType)"
              :name="formData.dimensionName"
              :items="items"
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
            <v-btn color="primary" :loading="loading" :disabled="loading" @click="onClickSaveButton"
              >Save</v-btn
            >
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="loading"
              outlined
              @click="onClickSaveAndAddButton"
            >
              Save and add another
            </v-btn>
            <v-btn
              color="primary"
              :loading="loading"
              :disabled="loading"
              outlined
              @click="onClickClearButton"
            >
              Clear
            </v-btn>
          </slot>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import _ from 'lodash'
import { mdiReload } from '@mdi/js'
import SliderForm from './SliderForm.vue'
import CheckboxForm from './CheckboxForm.vue'

import { LabelDTO } from '~/services/application/label/labelData'
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

  props: {
    items: {
      type: Array as PropType<LabelDTO[]>,
      default: () => [],
      required: true
    }
  },

  data() {
    return {
      valid: false,
      loading: false,
      dimensions: [] as any[],
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
    hasAddedAllPredefinedDimensions(): boolean {
      return _.differenceBy(this.dimensions, this.items, 'name').length === 0
    },
    rules() {
      return {
        required: (v: string) => !!v || 'Required',
        nameStringOnly: (
          v: string // @ts-ignore
        ) => {
          const pattern = /^[A-Za-z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż, -]+$/
          return pattern.test(v) || this.$i18n.t('annotation.warningInvalidChar')
        },
        maxLength100: (
          v: string // @ts-ignore
        ) => (v && v.length <= 100) || this.$t('rules.labelNameRules').labelLessThan100Chars,
        nameDuplicated: (
          v: string // @ts-ignore
        ) => !this.isUsedName(v) || this.$t('rules.labelNameRules').duplicated
      }
    }
  },

  async created() {
    await this.setDimensionList()
  },

  mounted() {
    if (this.$refs.form) {
      // @ts-ignore
      this.$refs.form.resetValidation()
    }
  },

  methods: {
    async setDimensionList() {
      await this.$services.dimension.listAll().then((response) => {
        this.dimensions = response.items
      })
    },
    getDimensionDetailPreviewComponent() {
      if (this.formData.dimensionType === 'slider') {
        return SliderInput
      } else if (this.formData.dimensionType === 'checkbox') {
        return CheckboxInput
      }
    },
    getDimensionDetailFormComponent() {
      if (this.formData.dimensionType === 'slider') {
        return SliderForm
      } else if (this.formData.dimensionType === 'checkbox') {
        return CheckboxForm
      }
    },
    resetForm() {
      const refForm: any = this.$refs.form
      refForm && refForm.resetValidation()
      this.formData = {
        ...this.formData,
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
      const dynamicGroups = this.items.filter((item) => item.group === 'Dynamic')
      const request = {
        name: this.formData.dimensionName,
        type: this.formData.dimensionType,
        dimension_meta_data: [
          {
            codename: `DIM_DYN_${dynamicGroups.length + 1}`,
            config: {},
            required: Number(this.formData.required),
            readonly: Number(this.formData.readOnly)
          }
        ]
      }
      if (this.formData.dimensionType === 'slider') {
        request.dimension_meta_data[0].config = {
          slider_min: this.formData.slider.sliderMin,
          slider_max: this.formData.slider.sliderMax,
          slider_step: this.formData.slider.sliderStep,
          with_checkbox: Number(this.formData.slider.withCheckbox),
          minVal_description: this.formData.slider.minValDescription,
          maxVal_description: this.formData.slider.maxValDescription
        }
        if (this.formData.slider.withCheckbox) {
          // @ts-ignore
          request.dimension_meta_data[0].config.checkbox_codename =
            this.formData.slider.checkboxCodename
        }
      } else if (this.formData.dimensionType === 'checkbox') {
        request.dimension_meta_data[0].config = {
          is_multiple_answers: Number(this.formData.checkbox.isMultipleAnswers),
          min_answer_number: this.formData.checkbox.minAnswerNumber,
          max_answer_number: this.formData.checkbox.maxAnswerNumber,
          options: this.formData.checkbox.options.map((opt: any) => {
            return opt.text
          })
        }
      }
      return request
    },
    async createDimension(redirect = true) {
      const valid = await this.validateForm()
      if (valid) {
        const request = this.getCreateDimensionFormRequest()
        this.loading = true
        this.$emit('submit:create', { request, redirect })
        this.resetForm()
        this.loading = false
      } else {
        console.error('Failed to create dimension')
        this.loading = false
      }
    },
    async addExistingDimension(redirect = true) {
      const valid = await this.validateForm()
      if (valid) {
        const request = { dimension: this.formData.dimensions }
        this.loading = true
        this.$emit('submit:add', { request, redirect })
        this.resetForm()
        this.loading = false
      } else {
        console.error('Failed to add dimension')
        this.loading = false
      }
    },
    onClickSaveButton() {
      if (this.formData.isCreatingNewDimension) {
        this.createDimension(true)
      } else {
        this.addExistingDimension(true)
      }
    },
    async validateForm() {
      let valid = true
      const refForm: any = this.$refs.form
      if (refForm) {
        valid = await refForm.validate()
      }
      if (this.formData.isCreatingNewDimension) {
        const request = this.getCreateDimensionFormRequest()
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
      this.resetForm()
    },
    onClickSaveAndAddButton() {
      if (this.formData.isCreatingNewDimension) {
        this.createDimension(false)
      } else {
        this.addExistingDimension(false)
      }
    },
    isUsedName(text: string): boolean {
      return this.items.filter((item: any) => item.name === text).length > 0
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
