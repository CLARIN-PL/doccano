<template>
  <v-data-table
    ref="articleDatatable"
    class="article-datatable"
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
      'items-per-page-options': [50, 100, 1000],
      'items-per-page-text': $t('vuetify.itemsPerPageText'),
      'page-text': $t('dataset.pageText')
    }"
    item-key="id"
    :show-select="isProjectAdmin"
    show-expand
    @toggle-select-all="onSelectAllArticleItems"
    @item-selected="onSelectArticleItems"
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
      <template #[`item.title`]="{ item }">
        <span class="d-flex d-sm-none article-title">{{ item.title | truncate(50) }}</span>
        <span class="d-none d-sm-flex article-title">{{ item.title | truncate(200) }}</span>
      </template>
    <template #expanded-item="{ item }">
        <td :colspan="headers.length + 2" class="expanded-column" >
            <v-data-table
                ref="articleItemsDatatable"
                class="article-items-datatable"
                :value="selectedChildArticleItems"
                :headers="childHeaders"
                :items="item.data"
                :loading-text="$t('generic.loading')"
                :no-data-text="$t('vuetify.noDataAvailable')"
                item-key="id"
                :show-select="isProjectAdmin"
                show-expand
                @item-selected="onSelectChildArticleItems"
            >
                <template #[`item.text`]="articleItem">
                  <span class="d-flex d-sm-none">{{ articleItem.item.text | truncate(50) }}</span>
                  <span class="d-none d-sm-flex">{{ articleItem.item.text | truncate(200) }}</span>
                </template>
                <template #[`item.isConfirmed`]="articleItem">
                  {{ articleItem.item.isConfirmed ? 'checked' : 'unchecked' }}
                </template>
                <template #[`item.action`]="articleItem">
                    <v-btn 
                      small 
                      v-if="showAnnotationButton"
                      color="primary text-capitalize mr-5" 
                      @click="toLabeling(articleItem.item)">
                        {{ $t('dataset.annotate') }}
                    </v-btn>
                </template>
            </v-data-table>
        </td>
    </template>
    <template #[`item.isConfirmed`]="{item}">
      {{ item.isConfirmed ? 'checked' : 'unchecked' }}
    </template>
    <template #[`item.action`]="{ item }">
      <v-btn 
        small
        color="primary text-capitalize mr-5" 
        v-if="showAnnotationButton"
        @click="toLabeling(item.data[0])">
        {{ $t('dataset.startAnnotation') }}
      </v-btn>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import _ from 'lodash'
import { mdiMagnify } from '@mdi/js'
import { DataOptions } from 'vuetify/types'
import { ExampleMetaContent } from '~/domain/models/example/example'
import { ExampleArticleDTO, ExampleDTO, ExampleGroupedDTO } from '~/services/application/example/exampleData'
import { DatatableSelectArticleEventData, DatatableSelectChildArticleEventData } from '~/services/application/example/exampleVuetify'

export default Vue.extend({
  props: {
    isLoading: {
      type: Boolean,
      default: false,
      required: true
    },
    showAnnotationButton: {
      type: Boolean,
      default: true,
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
      search: this.$route.query.q || '',
      options: {} as DataOptions,
      selectedArticleItems: [] as ExampleArticleDTO[],
      selectedChildArticleItems: [] as ExampleDTO[],
      expandedItems: [] as ExampleArticleDTO[],
      isExpanded: false,
      isProjectAdmin: false,
      mdiMagnify
    }
  },

  computed: {
    projectId() {
      return this.$route.params.id
    },
    groupedItems() {
        const groupsByArticleIdDict = _.groupBy(this.items, 'articleId') as ExampleGroupedDTO
        const groupsByArticleIdList = [] as ExampleArticleDTO[]
        Object.keys(groupsByArticleIdDict).forEach((key: string, index: number)=> {
            const firstItem = groupsByArticleIdDict[key][0] as ExampleDTO
            firstItem.meta.meta = firstItem.meta.meta || {} as ExampleMetaContent
            groupsByArticleIdList.push({
                itemId: `${key}_article_${index}`,
                id: index,
                articleId: key,
                title: firstItem.meta.meta.article_title,
                publishDatetime: firstItem.meta.meta.publish_datetime,
                data: groupsByArticleIdDict[key] as ExampleDTO[]
            })
        })
        const articleList : ExampleArticleDTO[] = groupsByArticleIdList
          .map((group: ExampleArticleDTO)=> {
            group.isConfirmed = group.data.every((data: ExampleDTO) => data.isConfirmed === true)
            group.data = group.data.map((data: ExampleDTO, index: number)=> {
                data.itemId = `${data.articleId}_articleItem_${index}`
                return data
            })
            group.data = _.sortBy(group.data, 'order')
            return group
        })
        return articleList
    },
    childHeaders() {
      const adminHeaders = [
            {
                text: this.$t('dataset.action'),
                value: 'action',
                sortable: false
            }
      ]
      const headers = [
            {
                text: this.$t('dataset.text'),
                value: 'text',
                sortable: true
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
                text: this.$t('comments.comments'),
                value: 'commentCount',
                sortable: false
            },
            {
              text: this.$t('dataset.status'),
              value: 'isConfirmed',
              sortable: false
            },
        ]
        return this.isProjectAdmin ? headers.concat(adminHeaders) : headers
    },
    headers() {
      const adminHeaders = [
        {
          text: this.$t('dataset.action'),
          value: 'action',
          sortable: false
        }
      ]
      const headers = [
        {
          text: this.$t('dataset.title'),
          value: 'title',
          sortable: false
        },
        {
          text: this.$t('dataset.status'),
          value: 'isConfirmed',
          sortable: false
        },
        {
          text: this.$t('dataset.publishDatetime'),
          value: 'publishDatetime',
          sortable: false
        },
      ]
      return this.isProjectAdmin ? headers.concat(adminHeaders) : headers
    }
  },
  async created() {
    this.isProjectAdmin = await this.$services.member.isProjectAdmin(this.projectId)
  },
  watch: {
    items: {
      handler() {
        const childIds = _.flatMap(this.items, 'itemId') as string[]
        const articleIds = _.flatMap(this.items, 'articleId') as string[]
        this.selectedChildArticleItems = this.selectedChildArticleItems
          .filter((selItem)=> childIds.includes(selItem.itemId)) as ExampleDTO[]
        this.selectedArticleItems = this.selectedArticleItems
          .filter((selItem)=> articleIds.includes(selItem.itemId)) as ExampleArticleDTO[]
      },
      deep: true,
    },
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
    onSelectArticleItems({item, value} : DatatableSelectArticleEventData) {
      if(value) {
        const hasExist : boolean = this.selectedArticleItems
          .some((selItem) => selItem.itemId === item.itemId )
        if(!hasExist && item) {
          this.selectedArticleItems.push(item)
        }
      } else {
        this.selectedArticleItems = this.selectedArticleItems
          .filter((selItem)=> selItem.itemId !== item.itemId)
      }
      this.selectedChildArticleItems = _.flatMap(this.selectedArticleItems, 
        ({ data }) => data ) as ExampleDTO[]
      this.$nextTick(()=> {
        this.$emit('input', this.selectedChildArticleItems) 
      })
    },
    onSelectAllArticleItems({ items, value } : DatatableSelectArticleEventData) {
      this.selectedArticleItems = value ? items : [] as ExampleArticleDTO[]; 
      this.selectedChildArticleItems = _.flatMap(this.selectedArticleItems, 
        ({ data }) => data ) as ExampleDTO[]
      this.$nextTick(()=> {
        this.$emit('input', this.selectedChildArticleItems) 
      })
    },
    onSelectChildArticleItems({item, value} : DatatableSelectChildArticleEventData) {
      if(value) {
        const hasExist : boolean = this.selectedChildArticleItems
          .some((selItem) => selItem.itemId === item.itemId )
        if(!hasExist && item) {
          this.selectedChildArticleItems.push(item)
        }
        const parent : undefined | ExampleArticleDTO = this.groupedItems
          .find((selItem) =>  selItem.articleId === item.articleId)
        if(parent) {
          const hasParentExist : boolean = this.selectedArticleItems
            .some((selItem) => selItem.itemId === parent.itemId) 
          !hasParentExist && this.selectedArticleItems.push(parent)
        }
      } else {
        this.selectedChildArticleItems = this.selectedChildArticleItems
          .filter((selItem) => selItem.itemId !== item.itemId )
        const hasAnotherChild = this.selectedChildArticleItems
          .some((selItem) => selItem.articleId === item.articleId )
        if(!hasAnotherChild) {
          this.selectedArticleItems = this.selectedArticleItems
            .filter((selItem) => selItem.articleId !== item.articleId )
        }
      }
      this.$nextTick(()=> {
        this.$emit('input', this.selectedChildArticleItems) 
      })
    },
    toLabeling(item: ExampleDTO) {
      const index = this.items.indexOf(item)
      const offset = (this.options.page - 1) * this.options.itemsPerPage
      const page = (offset + index + 1).toString()
      this.$emit('click:labeling', { page, q: this.search, isChecked: false })
    }
  }
})
</script>
<style lang="scss">
.article-datatable {
  .article-title {
    font-weight: 500;
    font-size: .875rem;
  }

  .expanded-column {
    padding: 0 !important; 
  }
}

.article-items-datatable {
  &.v-data-table {
    border-radius: 0; 
  }
  
  &.theme--light.v-data-table {
    background-color: #f5f5f5;

    tbody tr {
      &:nth-of-type(2n+1) {
        background-color: #ddd;
      }
    }   
  }

  .v-data-table__expand-icon {
    opacity: 0; 
    visibility: hidden;
  }

  th[role="columnheader"] {
    .v-simple-checkbox {
      display: none; 
    }
  }
}
</style>