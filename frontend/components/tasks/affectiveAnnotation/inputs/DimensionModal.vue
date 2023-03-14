<template>
  <div class="widget">
    <div class="widget__answer" justify="center" align="center">
      <div class="widget__textfield" @click="onDimensionSelectionClick">
        <v-select
          v-model="selected"
          :items="dimensionOptions"
          label="Dimensions"
          readonly
          multiple
          outlined
          required
        >
          <template #selection="{ item, index }">
            <v-chip v-if="index < 3">
              <span>{{ item.text }}</span>
            </v-chip>
            <span v-if="index === 3" class="text-grey text-caption align-self-center">
              (+{{ selected.length - 3 }} others)
            </span>
          </template>
        </v-select>
      </div>
    </div>

    <v-dialog v-model="showDialog" max-width="800" scrollable persistent class="widget-dialog">
      <v-card>
        <v-card-title class="widget-dialog__title pa-5">
          <p class="">Dimensions ({{ selected.length }} selected)</p>
          <small v-if="dialogErrorMessage" class="red--text"> *{{ dialogErrorMessage }} </small>
        </v-card-title>
        <v-card-text class="widget-dialog__text">
          <div
            v-for="(dimensionGroup, idx) in Object.keys(groupedDimensionOptions)"
            :key="`dimension-group_${idx}`"
          >
            <h2 class="checkbox-title">{{ dimensionGroup }}</h2>
            <div class="checkbox-list --col-3">
              <v-checkbox
                v-for="(dimension, dimensionIdx) in groupedDimensionOptions[dimensionGroup]"
                :key="`checkbox-${dimensionGroup}-${dimensionIdx}`"
                v-model="selected"
                multiple
                :label="dimension.text"
                :value="dimension.value"
                class="checkbox-list__item"
              />
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="pa-5">
          <v-spacer />
          <v-btn @click="onClearButtonClick"> Clear </v-btn>
          <v-btn primary color="primary" @click="onSubmitButtonClick"> Close </v-btn>
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
    }
  },

  data() {
    return {
      mdiSend,
      dimensions: [],
      dimensionOptions: [],
      groupedDimensionOptions: {},
      showDialog: false,
      dialogErrorMessage: ''
    }
  },

  computed: {
    selected: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },

  async created() {
    await this.setDimensionList()
    this.setDimensionOptions()
  },
  methods: {
    async setDimensionList() {
      await this.$services.dimension.listAll().then((response) => {
        this.dimensions = response.items
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
          const codename = item.metadata[0].codename
          for (const [key, value] of Object.entries(groupMap)) {
            if (codename.includes(key)) {
              item.group = value
              break
            }
          }

          if (!item.group) {
            item.group = 'Dynamic'
          }
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
  margin-bottom: 30px;
  padding: 10px;

  &.--col-3 {
    grid-template-columns: repeat(3, 1fr);
  }

  .v-input.v-input--selection-controls {
    margin-top: 0 !important;
  }
}
</style>
