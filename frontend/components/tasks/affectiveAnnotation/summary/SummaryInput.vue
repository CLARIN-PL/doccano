<template>
  <div>
    <textfield-with-seq-2-seq
      :text="text"
      question="Jakimi słowami opisałbyś ten tekst (tagi, słowa kluczowe)? Proszę wpisać 2-10 słów."
      :answers="tags"
      :rules-textfield="rules"
      @remove="removeTag"
      @update="updateTag"
      @add="addTag"
    />
    <textfield-with-seq-2-seq
      :text="text"
      question="Jakie wrażenia/emocje/odczucia wzbudza w Tobie ten tekst? Proszę wpisać 2-10 słów."
      :answers="impressions"
      :rules-textfield="rules"
      @remove="removeImpression"
      @update="updateImpression"
      @add="addImpression"
    />
  </div>
</template>

<script>
import TextfieldWithSeq2Seq from '~/components/tasks/affectiveAnnotation/inputs/TextfieldWithSeq2Seq.vue'

export default {
  components: {
    TextfieldWithSeq2Seq
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
      ]
    }
  },

  methods: {
    validateText(field, value) {
      let flagOk = true
      const pattern = /^[A-Za-z0-9ĄĆĘŁŃÓŚŹŻąćęłńóśźż, -]+$/
      let arrayToCheck = []
      if (field==="tags") {
        arrayToCheck = this.tags
      }
      if (field==="impressions") {
        arrayToCheck = this.impressions
      }
      if (!pattern.test(value)) {
        flagOk = false
        alert("Nieprawidłowy znak.")
      }
      if (arrayToCheck.length >= 10) {
        flagOk = false
        alert("Osiągnięto maksymalną liczbę.")
      }
      for (let i = 0; i < arrayToCheck.length; i++) {
        if (arrayToCheck[i].text === value) {
          flagOk = false
          alert("Słowo zostało już napisane.")
          break
        }
      }
      return flagOk
    },
    removeTag(annotationId) {
      this.$emit('remove:tag', annotationId)
    },
    updateTag(annotationId, text) {
      if (text.length > 0) {
        const passingValidation = this.validateText("tags", text)
        if (passingValidation) {
          this.$emit('update:tag', annotationId, text)
        }
      } else {
        this.removeTag(annotationId)
      }
    },
    addTag(text) {
      const passingValidation = this.validateText("tags", text)
      if (passingValidation) {
        this.$emit('add:tag', text)
      }
    },
    removeImpression(annotationId) {
      this.$emit('remove:impression', annotationId)
    },
    updateImpression(annotationId, text) {
      if (text.length > 0) {
        const passingValidation = this.validateText("impressions", text)
        if (passingValidation) {
          this.$emit('update:impression', annotationId, text)
        }
      } else {
        this.removeImpression(annotationId)
      }
    },
    addImpression(text) {
      const passingValidation = this.validateText("impressions", text)
      if (passingValidation) {
        this.$emit('add:impression', text)
      }
    }
  }
}
</script>
