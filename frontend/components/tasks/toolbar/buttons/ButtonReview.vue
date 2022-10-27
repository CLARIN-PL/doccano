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
          {{ isReviewd ? mdiClose : mdiCheck }}
        </v-icon>
        <span v-if="showText">
          {{ isReviewd ? text.notChecked : text.checked }}
        </span>
      </v-btn>
    </template>
    <span v-if="isReviewd">{{ $t('annotation.notCheckedTooltip') }}</span>
    <span v-else>{{ $t('annotation.checkedTooltip') }}</span>
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
          checked: 'Mark as confirmed',
          notChecked: 'Mark as not confirmed'
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
