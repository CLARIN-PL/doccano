<template>
    <v-card class="toolbar-article">
        <v-card-text ref="articleBody" class="toolbar-article__body" >
          <ul class="article-list">
            <li v-for="(item, index) in articleItems" 
              :id="'article-item_'+index"
              :key="'articleItem_'+index"
              :class="[item.id === currentArticleItem.id ? '--active' : '--inactive', 
                      `--${item.type}`]"
              class="article-list__item" >
              <p class="item__text">
                {{ item.text }} 
              </p>
            </li>
          </ul>
        </v-card-text>
        <v-progress-linear
          class="mt-5"
          :value="(itemPosition)/articleItems.length*100"
        ></v-progress-linear>
        <v-card-actions class="toolbar-article__footer">
          Annotating {{ itemPosition }} / {{ articleItems.length }} texts
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { ExampleDTO } from '~/services/application/example/exampleData'


export default Vue.extend({
  props: {
    project: {
        type: Object,
        required: true,
        default: () => {}
    },
    articleItems: {
      type: Array,
      required: true,
      default: () => [] as ExampleDTO[]
    }, 
    currentArticleItem: {
        type: Object,
        required: true,
        default: () => ExampleDTO,
    }
  },
  computed: {
    itemPosition() : number {
      return this.articleItems.findIndex((item : any) => item.id 
        === this.currentArticleItem.id ) + 1
    }
  },
  watch: {
    itemPosition() {
      this.setScrollPosition()
    }
  },
  methods: {
    setScrollPosition() {
      const index = this.itemPosition - 1
      const articleItem = document.getElementById('article-item_' + index)
      if(index >= 0 && articleItem) {
        setTimeout(function() {
            articleItem.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
            });
        }, 100);
      }
    }
  }
})
</script>
<style lang="scss">
.toolbar-article {
  padding: 10px; 

  &__body {
    display: block;
    max-height: 400px; 
    overflow-x: auto; 
    padding: 0; 
    line-height: 1.25; 
  }

  &__footer {
    padding: 10px;
  }
}

.article-list {
  list-style-type: none;
  padding: 0 !important; 
  margin: 0; 

  &__item {
    font-size: .625rem; 
    padding: 0; 
    margin: 0; 
    opacity: .5;
    text-indent: 1em;
    text-align: justify;

    > p {
      margin: .25rem 0; 
    }
    
    &.--active {
      opacity: 1;
      border: 1px solid #5097DD; 
      padding: 5px;
      text-indent: calc(1em - 6px); 
    }

    &.--title {
      text-align: center;
      font-weight: bold;
      margin-bottom: .5rem;
    }

    &.--title, 
    &.--subheader {
      text-indent: 0;
    }

  }
}
</style>
