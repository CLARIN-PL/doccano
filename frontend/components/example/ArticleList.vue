<template>
  <v-data-table
    ref="articleDatatable"
    :value="selectedArticleItems"
    :headers="headers"
    :items="groupedItems"
    :single-expand="true"
    :expanded.sync="expandedItems"
    :options.sync="options"
    :server-items-length="total"
    :search="search"
    :loading="isLoading"
    :loading-text="$t('generic.loading')"
    :no-data-text="$t('vuetify.noDataAvailable')"
    :footer-props="{
      showFirstLastPage: true,
      'items-per-page-options': [10, 50, 100],
      'items-per-page-text': $t('vuetify.itemsPerPageText'),
      'page-text': $t('dataset.pageText')
    }"
    item-key="id"
    show-select
    show-expand
    @item-selected="selectChildItems"
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
    <template #expanded-item="{ item, index }">
        <td colspan="1">
            {{index}}
        </td>
        <td :colspan="headers.length + 1" class="expanded-column" >
            <v-data-table
                ref="articleItemsDatatable"
                :value="item.data"
                :headers="childHeaders"
                :items="item.data"
                :loading-text="$t('generic.loading')"
                :no-data-text="$t('vuetify.noDataAvailable')"
                item-key="id"
                show-select
                @input="$emit('input', $event)"
            >
                <template>
                    
                </template>
                <template #[`item.action`]="{ item }">
                    <v-btn small color="primary text-capitalize mr-5" @click="toLabeling(item)">
                        {{ $t('dataset.annotate') }}
                    </v-btn>
                </template>
            </v-data-table>
        </td>
    </template>
    <template #[`item.action`]="{ item }">
      <v-btn small color="primary text-capitalize mr-5" @click="toLabeling(item.data[0])">
        {{ $t('dataset.startAnnotation') }}
      </v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mdiMagnify } from '@mdi/js'
import { DataOptions } from 'vuetify/types'
import { ExampleDTO } from '~/services/application/example/exampleData'

export default Vue.extend({
  props: {
    isLoading: {
      type: Boolean,
      default: false,
      required: true
    },
    items: {
      type: Array as PropType<ExampleDTO[]>,
      default: () => [],
      required: true
    },
    value: {
      type: Array as PropType<ExampleDTO[]>,
      default: () => [],
      required: true
    },
    total: {
      type: Number,
      default: 0,
      required: true
    }
  },

  data() {
    return {
      search: this.$route.query.q,
      options: {} as DataOptions,
      selectedArticleItems: [],
      expandedItems: [],
      isExpanded: false,
      mdiMagnify
    }
  },

  computed: {
    groupedItems() {
        console.log(this.items)
        const groupsByArticleIdDict = _.groupBy(this.items, 'article_id')
        let groupsByArticleIdList = []
        Object.keys(groupsByArticleIdDict).forEach((key, index)=> {
            const firstItem = groupsByArticleIdDict[key][0]
            firstItem.meta.meta = firstItem.meta.meta || {}
            groupsByArticleIdList.push({
                id: index,
                article_id: key,
                title: firstItem.meta.meta.article_title,
                publishDatetime: firstItem.meta.meta.publish_datetime,
                data: groupsByArticleIdDict[key]
            })
        })
        groupsByArticleIdList = groupsByArticleIdList.map((group)=> {
            group.data = group.data.map((data, index)=> {
                data.order = data.order || index
                return data
            })
            return group
        })
        return groupsByArticleIdList
    },
    childHeaders() {
        return [
            {
                text: this.$t('dataset.text'),
                value: 'text',
                sortable: false
            },
            {
                text: this.$t('dataset.type'),
                value: 'type',
                sortable: false
            },
            {
                text: this.$t('dataset.order'),
                value: 'order',
                sortable: false
            },
            {
                text: this.$t('dataset.action'),
                value: 'action',
                sortable: false
            },
        ]
    },
    headers() {
      return [
        {
          text: this.$t('dataset.title'),
          value: 'title',
          sortable: false
        },
        {
          text: this.$t('dataset.publishDatetime'),
          value: 'publishDatetime',
          sortable: false
        },
        {
          text: this.$t('dataset.action'),
          value: 'action',
          sortable: false
        }
      ]
    }
  },

  watch: {
    options: {
      handler() {
        this.$emit('update:query', {
          query: {
            limit: this.options.itemsPerPage.toString(),
            offset: ((this.options.page - 1) * this.options.itemsPerPage).toString(),
            q: this.search
          }
        })
      },
      deep: true
    },
    search() {
      this.$emit('update:query', {
        query: {
          limit: this.options.itemsPerPage.toString(),
          offset: '0',
          q: this.search
        }
      })
      this.options.page = 1
    }
  },

  methods: {
    selectChildItems(item, isSelected) {
        if(isSelected) {
            this.selectedArticleItems = [...this.selectedArticleItems, ...item.data]
        } else {
            this.selectedArticleItems = this.selectedArticleItems.filter((selItem) => selItem.id !== item.id )
        }
    },
    toLabeling(item: ExampleDTO) {
    const index = this.items.indexOf(item)
      const offset = (this.options.page - 1) * this.options.itemsPerPage
      const page = (offset + index + 1).toString()
      this.$emit('click:labeling', { page, q: this.search })
    }
  }
})
</script>
<style lang="scss">
.expanded-column {
    padding: 0 !important; 
    border-radius: 0;
}
</style>