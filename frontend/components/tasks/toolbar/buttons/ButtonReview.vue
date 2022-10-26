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
        <v-icon v-if="isReviewd">
          {{ isReviewd ? mdiCheck : mdiClose }}
        </v-icon>
        {{ text }}
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
    text: {
      type: String,
      default: ""
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
