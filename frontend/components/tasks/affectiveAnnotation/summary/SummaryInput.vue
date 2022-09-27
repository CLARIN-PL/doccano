<template>
  <v-container class="summary-input">
    <v-row class="summary-input__question" @click="showDialogTags = true">
      Jakimi słowami opisałbyś ten tekst (tagi, słowa kluczowe)? Proszę wpisać 2-10 słów.
    </v-row>
    <v-row class="summary-input__answer" @click="showDialogTags = true">
      <v-text-field
        small
        dense
        readonly
        :value="stringifiedTags"
        :rules="rules"
        hide-details="auto"
      />
    </v-row>
    <v-row class="summary-input__question" @click="showDialogImpressions = true">
      Jakie wrażenia/emocje/odczucia wzbudza w Tobie ten tekst? Proszę wpisać 2-10 słów.
    </v-row>
    <v-row class="summary-input__answer" @click="showDialogImpressions = true">
      <v-text-field
        small
        dense
        readonly
        :value="stringifiedImpressions"
        :rules="rules"
        hide-details="auto"
      />
    </v-row>

    <v-dialog
      v-model="showDialogTags"
      scrollable
      width="600"
      class="summary-dialog"
    >
      <v-card>
        <v-card-title class="summary-dialog__title">
          Jakimi słowami opisałbyś ten tekst (tagi, słowa kluczowe)? Proszę wpisać 2-10 słów.
        </v-card-title>
        <v-card-text  class="summary-dialog__text">
          <seq2seq-box
            :text="text"
            :annotations="tags"
            @delete:annotation="removeTag"
            @update:annotation="updateTag"
            @create:annotation="addTag"
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <v-dialog
      v-model="showDialogImpressions"
      scrollable
      width="600"
      class="summary-dialog"
    >
      <v-card>
        <v-card-title class="summary-dialog__title">
          Jakie wrażenia/emocje/odczucia wzbudza w Tobie ten tekst? Proszę wpisać 2-10 słów.
        </v-card-title>
        <v-card-text  class="summary-dialog__text">
          <seq2seq-box
            :text="text"
            :annotations="impressions"
            @delete:annotation="removeImpression"
            @update:annotation="updateImpression"
            @create:annotation="addImpression"
          />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
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
      type: Array,
      default: () => []
    },
    impressions: {
      type: Array,
      default: () => []
    }
  },

  data() {
    return {
      rules: [
        (value) => {
          if (value) {
            const words_array = value.split(",")
            const count_ok = words_array.length >= 2 && words_array.length <= 10
            return count_ok || "Proszę wpisać 2-10 słów."
          }
          return "Wymagany."
        },
        (value) => {
          const pattern = /^[A-Za-z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż, -]+$/
          return pattern.test(value) || "Nieprawidłowy znak."
        }
      ],
      showDialogTags: false,
      showDialogImpressions: false,
      stringifiedTags: "",
      stringifiedImpressions: ""
    }
  },

  watch: {
    tags() {
      const res = []
      for (let i = 0; i < this.tags.length; i++) {
        res.push(this.tags[i].text)
      }
      this.stringifiedTags = res.join(", ")
    },
    impressions() {
      const res = []
      for (let i = 0; i < this.impressions.length; i++) {
        res.push(this.impressions[i].text)
      }
      this.stringifiedImpressions = res.join(", ")
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

<style lang="scss">
.summary-input {
  word-wrap: normal;
  word-break: break-word;

  &__question {
    font-size: .8rem;
    line-height: 0.95;
  }

  &__answer {
    font-size: .6rem;
    line-height: 0.75;
    margin-bottom: 10px;
  }
}

.summary-dialog {
  &__title {
    font-size: .8rem;
    line-height: 0.95;
    word-break: break-word !important;
  }

  &__text {
    font-size: .6rem;
    line-height: 0.75;
  }
}
</style>
