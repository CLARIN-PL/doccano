<template>
    <v-card class="toolbar-article">
        <v-card-text ref="articleBody" class="toolbar-article__body" >
          <ul class="article-list">
            <li v-for="(item, index) in articleItems" :key="'articleItem_'+index"
              :class="{'--active': item.id === currentArticleItem.id }"
              :id="'article-item_'+index"
              class="article-list__item" >
              <p class="item__text">
                {{ item.text }} 
              </p>
            </li>
          </ul>
        </v-card-text>
        <v-progress-linear
          :value="(itemPosition)/articleItems.length*100"
        ></v-progress-linear>
        <v-card-actions class="toolbar-article__footer">
          Annotating: {{ itemPosition }} of {{ articleItems.length }}
        </v-card-actions>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  components: {
  },
  props: {
    project: {
        type: Object,
        required: true,
        default: () => {}
    },
    articleItems: {
      type: Array,
      required: true,
      default: () => []
    },
    currentArticleItem: {
        type: Object,
        required: true,
        default: () => {}
    }
  },
  computed: {
    itemPosition() {
      return this.articleItems.findIndex((item) => item.id === this.currentArticleItem.id ) + 1
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
      if(index >= 0) {
        setTimeout(function() {
            document.getElementById('article-item_' + index).scrollIntoView({
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
    font-size: .75rem; 
    padding: 0; 
    margin: 0; 
    opacity: .5;

    > p {
      margin: 0; 
    }
    
    &.--active {
      opacity: 1;
    }
  }
}
</style>
