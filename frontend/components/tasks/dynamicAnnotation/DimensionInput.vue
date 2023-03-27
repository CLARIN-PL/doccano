<template>
  <div class="widget">
    <div class="widget__answer" justify="center" align="center">
      <div class="widget__textfield" @click="onDimensionSelectionClick">
        <v-select
          v-model="selected"
          :items="dimensionOptions"
          :label="$t('overview.dimensions')"
          readonly
          multiple
          outlined
          :required="required"
          :rules="rules"
        >
          <template #selection="{ item, index }">
            <v-chip v-if="index < 3">
              <span>{{ item.text }}</span>
            </v-chip>
            <span v-if="index === 3" class="text-grey text-caption align-self-center">
              (+{{ selected.length - 3 + ' ' + $t('overview.others') }})
            </span>
          </template>
        </v-select>
      </div>
    </div>

    <v-dialog v-model="showDialog" max-width="800" scrollable persistent class="widget-dialog">
      <v-card>
        <v-card-title class="widget-dialog__title pa-5">
          <p class="">
            {{ $t('overview.dimensions') }} ({{ selected.length }} {{ $t('overview.selected') }})
          </p>
          <br />
          <small v-if="dialogErrorMessage" class="red--text"> *{{ dialogErrorMessage }} </small>
        </v-card-title>
        <v-card-text class="widget-dialog__text">
          <v-checkbox
            v-model="selectAll"
            :label="$t('generic.all')"
            :value="true"
            @change="onSelectAllChange"
          />
          <div
            v-for="(dimensionGroup, idx) in Object.keys(groupedDimensionOptions)"
            :key="`dimension-group_${idx}`"
          >
            <h2 class="checkbox-title">{{ dimensionGroup || $t('overview.dimensions') }}</h2>
            <div class="checkbox-list --col-3">
              <v-checkbox
                v-for="(dimension, dimensionIdx) in groupedDimensionOptions[dimensionGroup]"
                :key="`checkbox-${dimensionGroup}-${dimensionIdx}`"
                v-model="selected"
                :hint="dimension.type"
                persistent-hint
                multiple
                :label="dimension.text"
                :value="dimension.value"
                class="checkbox-list__item"
              >
                {{ dimension.type }}
              </v-checkbox>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="pa-5">
          <v-spacer />
          <v-btn @click="onClearButtonClick">{{ $t('overview.clear') }}</v-btn>
          <v-btn primary color="primary" @click="onSubmitButtonClick">
            {{ $t('overview.close') }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mdiSend } from '@mdi/js'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    readOnly: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => []
    },
    assignedDimensions: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      mdiSend,
      selectAll: false,
      dimensions: [],
      dimensionOptions: [],
      excludedDimensions: ['DIM_OTH10', 'DIM_OTH11'],
      groupedDimensionOptions: {},
      showDialog: false,
      dialogErrorMessage: ''
    }
  },

  computed: {
    rules() {
      const rules = []
      if (this.required) {
        rules.push(() => Boolean(this.selected.length) || this.$t('rules.required'))
      }
      return rules
    },
    selected: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },

  watch: {
    assignedDimensions: {
      deep: true,
      handler() {
        this.setDimensionList()
      }
    }
  },

  async created() {
    await this.setDimensionList()
    this.setDimensionOptions()
  },
  methods: {
    async setDimensionList() {
      await this.$services.dimension.listAllDimensions().then((response) => {
        let dimensions = response.items
        if (this.assignedDimensions.length) {
          dimensions = _.differenceBy(dimensions, this.assignedDimensions, 'name')
        }
        dimensions = dimensions.filter((dim) => {
          let isExcluded = false
          if (dim.metadata && dim.metadata.length) {
            const { codename } = dim.metadata[0]
            isExcluded = this.excludedDimensions.includes(codename)
          }
          return !isExcluded
        })
        this.dimensions = _.cloneDeep(dimensions)
      })
    },
    setDimensionOptions() {
      this.dimensionOptions = this.dimensions.map((item) => {
        const groupMap = {
          DIM_OTH: 'Others',
          DIM_OF: 'Offensive',
          DIM_HUM: 'Humor',
          DIM_EMO: 'Emotions'
        }
        if (item.metadata && item.metadata.length) {
          const { codename } = item.metadata[0]
          const groupMapKey = Object.keys(groupMap).find((key) => codename.includes(key))
          item.group = groupMap[groupMapKey] || 'Dynamic'
        }

        return {
          value: item.id,
          text: item.name,
          type: item.type,
          group: item.group
        }
      })

      this.groupedDimensionOptions = _.groupBy(this.dimensionOptions, 'group')
    },
    onSelectAllChange(val) {
      if (val) {
        this.selected = this.dimensionOptions.map((dim) => dim.value)
      } else {
        this.$emit('input', [])
      }
    },
    onClearButtonClick() {
      this.$emit('input', [])
    },
    onSubmitButtonClick() {
      const hasFilledText = this.required ? this.selected.length : true
      if (hasFilledText) {
        this.showDialog = false
        this.dialogErrorMessage = ''
      } else {
        this.dialogErrorMessage = this.$t('rules.required')
        this.showDialog = false
      }
    },
    onDimensionSelectionClick() {
      this.showDialog = !this.readOnly
    }
  }
}
</script>

<style lang="scss">
.widget {
  word-wrap: normal;
  word-break: break-word;

  &__question,
  &__category {
    font-size: 0.8rem;
    line-height: 0.95;
  }

  &__category {
    padding: 0 !important;
  }

  &__answer {
    font-size: 0.6rem;
    line-height: 0.75;
    margin-bottom: 10px;
  }

  &__checkbox {
    padding: 0 0 0 10px !important;

    label.v-label {
      font-size: 0.8rem;
      line-height: 0.95;
    }
  }

  &__textfield {
    .v-input {
      font-size: 0.8rem;
    }
  }
}

.widget-dialog {
  &__title {
    font-size: 0.8rem;
    line-height: 0.95;
  }

  &__text {
    font-size: 0.7rem;
    line-height: 0.85;
    max-width: 780px;

    .v-input__append-outer {
      margin-top: 0;
    }
  }

  &__warning {
    color: red;
  }
}

.checkbox-title {
  margin-bottom: 10px;
}

.checkbox-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  border: 2px solid #ddd;
  border-radius: 2px;
  margin-bottom: 40px;
  padding: 10px 15px;

  &.--col-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  .v-input.v-input--selection-controls {
    margin-top: 0 !important;
  }

  .v-messages__message {
    padding-left: 35px;
  }
}
</style>
