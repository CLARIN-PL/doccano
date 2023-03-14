<template>
  <div class="dimension-list">
    <v-data-table
      :value="value"
      :headers="headers"
      :items="items"
      :search="search"
      :single-expand="true"
      :expanded.sync="expandedItems"
      :loading-text="$t('generic.loading')"
      :no-data-text="$t('vuetify.noDataAvailable')"
      :footer-props="{
        showFirstLastPage: true,
        'items-per-page-text': $t('vuetify.itemsPerPageText'),
        'page-text': $t('dataset.pageText')
      }"
      item-key="id"
      show-expand
      class="dimension-list__table"
      @input="$emit('input', $event)"
    >
      <template #top>
        <v-text-field
          v-model="search"
          :prepend-inner-icon="mdiMagnify"
          :label="$t('generic.search')"
          single-line
          hide-details
          filled
        />
      </template>

      <template #expanded-item="{ item }">
        <td :colspan="headers.length + 2" class="expanded-column">
          <v-card class="expanded-card">
            <v-card-title>{{ item.type }}</v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <ul v-if="item.metadata && item.metadata.length" class="metadata-list">
                    <li
                      v-for="(pair, idx) in keyValuePairs(item.metadata[0])"
                      :key="`metadata_${idx}`"
                      class="metadata-list__item"
                    >
                      <v-row v-if="pair.key !== 'config'">
                        <v-col cols="6">
                          <span class="metadata-pair --key">
                            {{ pair.key }}
                          </span>
                        </v-col>
                        <v-col cols="6">
                          <span class="metadata-pair --value">
                            {{ pair.value }}
                          </span>
                        </v-col>
                      </v-row>
                      <div v-else class="value-container">
                        <v-row>
                          <v-col cols="12">
                            <span class="metadata-pair --header">Value</span>
                          </v-col>
                        </v-row>
                        <v-row
                          v-for="(pairVal, pairValIdx) in keyValuePairs(pair.value)"
                          :key="`metadata_pairValue_${pairValIdx}`"
                        >
                          <v-col cols="6">
                            <span class="metadata-pair --key">
                              {{ pairVal.key }}
                            </span>
                          </v-col>
                          <v-col cols="6">
                            <!-- eslint-disable-next-line vue/no-v-html -->
                            <span
                              class="metadata-pair --value"
                              v-html="getParsedValue(pairVal.value, pairVal.key)"
                            >
                            </span>
                          </v-col>
                        </v-row>
                      </div>
                    </li>
                  </ul>
                </v-col>
                <v-spacer />
                <v-col v-if="item.metadata && item.metadata.length" cols="4">
                  <h3>Preview</h3>
                  <br />
                  <component
                    :is="getComponent(item)"
                    :name="item.name"
                    :items="items"
                    :config="getItemConfig(item)"
                    :required="item.metadata ? item.metadata[0].required : false"
                    :read-only="item.metadata ? item.metadata[0].readOnly : false"
                    :preview="true"
                  />
                </v-col>
                <v-spacer />
              </v-row>
            </v-card-text>
          </v-card>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mdiPencil, mdiMagnify, mdiDelete, mdiEye } from '@mdi/js'
import { objectKeysSnakeToCamel } from '~/utils/stringHelpers'
import { DimensionDTO } from '~/services/application/dimension/dimensionData'
import { ExampleMetadataDTO } from '~/services/application/example/exampleData'
import SliderInput from '~/components/tasks/dynamicAnnotation/SliderInput.vue'
import CheckboxInput from '~/components/tasks/dynamicAnnotation/CheckboxInput.vue'

export default Vue.extend({
  components: { SliderInput, CheckboxInput },
  props: {
    isLoading: {
      type: Boolean,
      default: false,
      required: true
    },
    items: {
      type: Array as PropType<DimensionDTO[]>,
      default: () => [],
      required: true
    },
    value: {
      type: Array as PropType<DimensionDTO[]>,
      default: () => [],
      required: true
    }
  },

  data() {
    return {
      search: '',
      expandedItems: [] as DimensionDTO[],
      mdiPencil,
      mdiMagnify,
      mdiDelete,
      mdiEye
    }
  },

  computed: {
    headers() {
      return [
        { text: this.$t('generic.name'), value: 'name' },
        { text: 'Type', value: 'type' },
        { text: 'Group', value: 'group' }
      ]
    }
  },

  methods: {
    getComponent(item: DimensionDTO) {
      if (item.type === 'slider') {
        return SliderInput
      } else if (item.type === 'checkbox') {
        return CheckboxInput
      }
    },
    getParsedValue(value: string, key: string) {
      let result = value
      if (key === 'options' && value.includes(';')) {
        result = value.split(';').join('</li><li class="metadata-options__item">')
        result = `<ul class="metadata-options"><li class="metadata-options__item">${result}</li></ul>`
      }
      return result
    },
    getItemConfig(item: DimensionDTO) {
      let config = { config: {} }
      if (item.metadata && item.metadata[0]) {
        config = { ...config, ...objectKeysSnakeToCamel(item.metadata[0]) }
        if (item.metadata[0].config) {
          config.config = objectKeysSnakeToCamel(item.metadata[0].config)
        }
      }
      return config.config
    },
    keyValuePairs(jsonObj: any) {
      const pairs = [] as ExampleMetadataDTO[]
      if (jsonObj) {
        Object.keys(jsonObj).forEach((objKey) => {
          pairs.push({ key: objKey, value: jsonObj[objKey] })
        })
      }
      return pairs
    }
  }
})
</script>
<style lang="scss" scoped>
.dimension-list {
  &__table {
    .expanded-column {
      padding: 0;
    }

    .expanded-card {
      border-radius: 0;
      background-color: #fafafa;
    }
  }
}

.expanded-card {
  .metadata-pair {
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.75rem;

    &.--key {
      color: #222;
    }

    &.--value {
      color: #777;
      font-weight: bold;
    }

    &.--header {
      color: #222;
      font-weight: bold;
    }
  }
}

.metadata-list {
  &__item {
    list-style-type: none;
  }
}

.metadata-options {
  padding: 0;

  &__item {
    list-style-type: none;
  }
}

.value-container {
  margin-top: 10px;
  margin-bottom: 10px;
  .col {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>