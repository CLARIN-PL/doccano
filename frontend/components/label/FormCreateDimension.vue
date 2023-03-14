<template>
  <v-card>
    <v-card-title class="mb-10">Create New Dimension</v-card-title>
    <v-card-text>
      <v-form ref="form" v-model="valid" class="dimension-form">
        <v-row>
          <v-col cols="12" sm="6">
            <v-row>
              <v-col cols="12" sm="12" class="pb-0">
                <v-text-field
                  v-model.trim="formData.dimensionName"
                  :counter="100"
                  :disabled="loading"
                  label="Dimension Name"
                  :rules="[rules.required, rules.nameDuplicated, rules.maxLength100]"
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
            </v-row>
          </v-col>
          <v-col cols="12" sm="6">
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
              <v-btn
                color="primary"
                :loading="loading"
                :disabled="loading"
                @click="onClickSaveButton"
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
            </slot>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mdiReload } from '@mdi/js'
import SliderForm from './SliderForm.vue'
import CheckboxForm from './CheckboxForm.vue'

import { LabelDTO } from '~/services/application/label/labelData'
import CheckboxInput from '~/components/tasks/dynamicAnnotation/CheckboxInput.vue'
import SliderInput from '~/components/tasks/dynamicAnnotation/SliderInput.vue'

export default Vue.extend({
  components: {
    SliderForm,
    CheckboxForm,
    SliderInput,
    CheckboxInput
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
        dimensionName: '',
        dimensionType: '',
        required: false,
        readOnly: false,
        slider: {
          sliderMin: 0,
          sliderMax: 10,
          sliderStep: 1,
          appendText: '',
          prependText: '',
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
    rules() {
      return {
        required: (v: string) => !!v || 'Required',
        maxLength100: (
          v: string // @ts-ignore
        ) => (v && v.length <= 100) || this.$t('rules.labelNameRules').labelLessThan100Chars,
        nameDuplicated: (
          v: string // @ts-ignore
        ) => !this.isUsedName(v) || this.$t('rules.labelNameRules').duplicated
      }
    }
  },

  mounted() {
    this.resetForm()
  },

  methods: {
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
      refForm.reset()
    },
    async onClickSaveButton() {
      const refForm: any = this.$refs.form
      const valid = await refForm.validate()
      if (valid) {
        this.loading = true
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
            minVal_description: this.formData.slider.appendText,
            maxVal_description: this.formData.slider.prependText
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
        this.$emit('submit', request)
      } else {
        this.loading = false
      }
    },
    onClickSaveAndAddButton() {
      this.resetForm()
    },
    isUsedName(text: string): boolean {
      return this.items.filter((item: any) => item.text === text).length > 0
    }
  }
})
</script>
<style lang="scss" scoped>
.dimension-form {
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
