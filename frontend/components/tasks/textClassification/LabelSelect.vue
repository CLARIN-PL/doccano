<template>
  <label-select-single
    v-if="singleLabel"
    :read-only="readOnly"
    :annotations="annotations"
    :labels="labels"
    @add="$emit('add', $event)"
    @remove="$emit('remove', $event)"
  />
  <label-select-multi
    v-else
    :read-only="readOnly"
    :annotations="annotations"
    :labels="labels"
    @add="$emit('add', $event)"
    @remove="$emit('remove', $event)"
  />
</template>

<script>
import LabelSelectSingle from './singleLabel/LabelSelect.vue'
import LabelSelectMulti from './multiLabel/LabelSelect.vue'

export default {
  components: {
    LabelSelectSingle,
    LabelSelectMulti
  },

  props: {
    labels: {
      type: Array,
      default: () => [],
      required: true
    },
    annotations: {
      type: Array,
      default: () => [],
      required: true
    },
    singleLabel: {
      type: Boolean,
      default: false,
      required: true
    },
    readOnly: {
      type: Boolean,
      default: false,
    }
  }
}
</script>
