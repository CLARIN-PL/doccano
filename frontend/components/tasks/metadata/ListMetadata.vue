<template>
  <v-data-table
    :headers="headers"
    :items="metaArray"
    item-key="key"
    hide-default-footer
    :no-data-text="$t('vuetify.noDataAvailable')"
    disable-pagination
    class="elevation-1"
  >
    <template #[`item.value`]="{ item }">
      <template v-if="isObject(item.value)">
        <ul class="metadata-list" >
          <li v-for="(pair, index) in keyValuePairs(item.value)" :key="index"  
            class="metadata-list__item"  >
            <span class="key">{{ pair.key }}</span>
            <span class="value"> {{ pair.value}}</span>
          </li>
        </ul>
      </template>
      <template v-else>
        <template v-if="item.key.indexOf('im_url') > -1">
          <a :href="item.value" target="_blank"><img :src="item.value" style="height: 250px" /></a>
        </template>
        <template v-else-if="item.key.indexOf('url') > -1">
          <a :href="item.value" target="_blank">{{ item.value }}</a>
        </template>
        <template v-else>
          {{ item.value }}
        </template>
      </template>
    </template>
  </v-data-table>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash' 
import { ExampleMetadataDTO } from '~/services/application/example/exampleData'

export default Vue.extend({
  props: {
    metadata: {
      type: Object,
      default: () => ({}),
      required: true
    }
  },

  data() {
    return {
      headers: [
        {
          text: this.$t('annotation.key'),
          align: 'left',
          value: 'key',
          sortable: false
        },
        {
          text: this.$t('annotation.value'),
          align: 'left',
          value: 'value',
          sortable: false
        }
      ]
    }
  },

  computed: {
    metaArray() {
      const items = []
      for (const [key, value] of Object.entries(this.metadata)) {
        items.push({
          key,
          value
        })
      }
      return items
    }
  },

  methods: {
    keyValuePairs(jsonObj: any) {
      const pairs = [] as ExampleMetadataDTO[]
      Object.keys(jsonObj).forEach((objKey)=> {
        pairs.push({key: objKey, value: jsonObj[objKey]})
      })
      return pairs
    },
    isObject(value: any) {
      return _.isObject(value)
    }
  }
})
</script>
<style lang="scss">
.metadata-list {
  padding: 10px 0;

  &__item {
    list-style: none; 

    &:not(:last-of-type) {
      margin-bottom: 10px; 
    }

    .key {
      display: block;
    }

    .value {
      font-size: 90%;
    }
  }
}
</style>

