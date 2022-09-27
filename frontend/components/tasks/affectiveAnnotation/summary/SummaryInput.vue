<template>
  <div>
    <p>
      Jakimi słowami opisałbyś ten tekst (tagi, słowa kluczowe)? Proszę wpisać 2-10 słów.
    </p>
    <seq2seq-box
      :text="text"
      :annotations="tags"
      @delete:annotation="removeTag"
      @update:annotation="updateTag"
      @create:annotation="addTag"
    />
    <p>
      Jakie wrażenia/emocje/odczucia wzbudza w Tobie ten tekst? Proszę wpisać 2-10 słów.
    </p>
    <seq2seq-box
      :text="text"
      :annotations="impressions"
      @delete:annotation="removeImpression"
      @update:annotation="updateImpression"
      @create:annotation="addImpression"
    />
  </div>
</template>

<script>
import Seq2seqBox from '~/components/tasks/seq2seq/Seq2seqBox'

export default {
  components: {
    Seq2seqBox
  },

  props: {
    text: {
      type: String,
      default: ""
    },
    tags: {
      type: String,
      default: ""
    },
    impressions: {
      type: String,
      default: ""
    }
  },

  methods: {
    removeTag(annotationId) {
      this.$emit('remove:tag', annotationId)
    },
    updateTag(annotationId, text) {
      if (text.length > 0) {
        this.$emit('update:tag', annotationId, text)
      } else {
        this.removeTag(annotationId)
      }
    },
    addTag(text) {
      this.$emit('add:tag', text)
    },
    removeImpression(annotationId) {
      this.$emit('remove:impression', annotationId)
    },
    updateImpression(annotationId, text) {
      if (text.length > 0) {
        this.$emit('update:impression', annotationId, text)
      } else {
        this.removeImpression(annotationId)
      }
    },
    addImpression(text) {
      this.$emit('add:impression', text)
    }
  }
}
</script>

<style>
p {
  font-size: 0.8rem;
  margin-top: 10px;
  margin-bottom: 0;
  line-height: 0.9;
  word-wrap: normal;
  word-break: break-word;
}
</style>