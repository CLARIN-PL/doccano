<template>
  <v-tooltip bottom>
    <template #activator="{ on }">
      <v-btn
        v-shortkey.once="['enter']"
        :icon="!text"
        :disabled="disabled"
        v-on="on"
        @shortkey="$emit('click:review')"
        @click="$emit('click:review')"
      >
        <v-icon>
          {{ isReviewd ? mdiCheck : mdiClose }}
        </v-icon>
        <span v-if="showText">
          {{ isReviewd ? text.checked : text.notChecked }}
        </span>
      </v-btn>
    </template>
    <span v-if="isReviewd">{{ $t('annotation.checkedTooltip') }}</span>
    <span v-else>{{ $t('annotation.notCheckedTooltip') }}</span>
  </v-tooltip>
</template>

<script lang="ts">
import Vue from 'vue'
import { mdiClose, mdiCheck } from '@mdi/js'

export default Vue.extend({
  props: {
    isReviewd: {
      type: Boolean,
      default: false,
      required: true
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    showText: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Object,
      default:() => {
        return {
          checked: '',
          notChecked: ''
        }
      }
    }
  },

  data() {
    return {
      mdiClose,
      mdiCheck
    }
  }
})
</script>
