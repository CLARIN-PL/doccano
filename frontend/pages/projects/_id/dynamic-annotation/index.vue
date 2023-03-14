<template>
  <layout-text v-if="example.id">
    <template #header>
      <toolbar-laptop
        :doc-id="example.id"
        :enable-auto-labeling.sync="enableAutoLabeling"
        :guideline-text="project.guideline"
        :is-reviewd="example.isConfirmed"
        :total="totalExample"
        class="d-none d-sm-block"
        @click:clear-label="clearTeacherList(project.id, example.id)"
        @click:review="confirm(project.id)"
      >
        <button-label-switch class="ms-2" @change="labelComponent = $event" />
      </toolbar-laptop>
      <toolbar-mobile :total="totalExample" class="d-flex d-sm-none" />
    </template>
    <template #content>
      <v-card
        v-shortkey="shortKeys"
        @shortkey="annotateOrRemoveLabel(project.id, example.id, $event.srcKey)"
      >
        <v-card-title>
          <component
            :is="labelComponent"
            :labels="labels"
            :annotations="teacherList"
            :single-label="project.singleClassClassification"
            @add="annotateLabel(project.id, example.id, $event)"
            @remove="removeTeacher(project.id, example.id, $event)"
          />
        </v-card-title>
        <v-divider />
        <v-card-text class="title highlight" style="white-space: pre-wrap" v-text="example.text" />
      </v-card>
      <v-card>
        <v-card-text>
          <ul>
            <li v-for="(dimension, dimensionIdx) in dimensions" :key="`dimension-${dimensionIdx}`">
              <component
                :is="dimension.component"
                v-model="dimension.value"
                :question="dimension.question"
                :extra-question="dimension.extraQuestion"
                :settings="dimension.settings"
                :read-only="dimension.readOnly"
              />
            </li>
          </ul>
        </v-card-text>
      </v-card>
    </template>
    <template #sidebar>
      <annotation-progress :progress="progress" />
      <list-metadata :metadata="example.meta" class="mt-4" />
    </template>
  </layout-text>
</template>

<script>
import { mapGetters } from 'vuex'
import { toRefs, useContext, useFetch, ref, watch } from '@nuxtjs/composition-api'
import LabelGroup from '@/components/tasks/textClassification/LabelGroup'
import LabelSelect from '@/components/tasks/textClassification/LabelSelect'
import LayoutText from '@/components/tasks/layout/LayoutText'
import ListMetadata from '@/components/tasks/metadata/ListMetadata'
import ToolbarLaptop from '@/components/tasks/toolbar/ToolbarLaptop'
import ToolbarMobile from '@/components/tasks/toolbar/ToolbarMobile'
import ButtonLabelSwitch from '@/components/tasks/toolbar/buttons/ButtonLabelSwitch'
import CheckboxInput from '@/components/tasks/dynamicAnnotation/CheckboxInput.vue'
import SliderInput from '@/components/tasks/dynamicAnnotation/SliderInput.vue'
import { useExampleItem } from '@/composables/useExampleItem'
import { useLabelList } from '@/composables/useLabelList'
import { useProjectItem } from '@/composables/useProjectItem'
import { useTeacherList } from '@/composables/useTeacherList'
import AnnotationProgress from '@/components/tasks/sidebar/AnnotationProgress.vue'
import TextfieldModal from '~/components/tasks/affectiveAnnotation/inputs/TextfieldModal.vue'

export default {
  components: {
    AnnotationProgress,
    ButtonLabelSwitch,
    LabelGroup,
    LabelSelect,
    LayoutText,
    ListMetadata,
    ToolbarLaptop,
    ToolbarMobile,
    CheckboxInput,
    SliderInput,
    TextfieldModal
  },
  layout: 'workspace',

  validate({ params, query }) {
    return /^\d+$/.test(params.id) && /^\d+$/.test(query.page)
  },

  setup() {
    const { app, params, query } = useContext()
    const projectId = params.value.id
    const { state: projectState, getProjectById } = useProjectItem()
    const { state: exampleState, confirm, getExample, updateProgress } = useExampleItem()
    const {
      state: teacherState,
      annotateLabel,
      annotateOrRemoveLabel,
      autoLabel,
      clearTeacherList,
      getTeacherList,
      removeTeacher
    } = useTeacherList(app.$services.textClassification)
    const enableAutoLabeling = ref(false)
    const { state: labelState, getLabelList, shortKeys } = useLabelList(app.$services.categoryType)
    const labelComponent = ref('label-group')

    getLabelList(projectId)
    getProjectById(projectId)
    updateProgress(projectId)

    const { fetch } = useFetch(async () => {
      await getExample(projectId, query.value)
      if (enableAutoLabeling.value) {
        try {
          await autoLabel(projectId, exampleState.example.id)
        } catch (e) {
          enableAutoLabeling.value = false
          alert(e.response.data.detail)
        }
      } else {
        await getTeacherList(projectId, exampleState.example.id)
      }
    })
    watch(query, fetch)

    return {
      ...toRefs(labelState),
      ...toRefs(projectState),
      ...toRefs(teacherState),
      ...toRefs(exampleState),
      confirm,
      annotateLabel,
      annotateOrRemoveLabel,
      clearTeacherList,
      enableAutoLabeling,
      labelComponent,
      removeTeacher,
      shortKeys
    }
  },

  data() {
    return {
      dimensions: [
        {
          question: 'slider title',
          type: 'slider',
          component: SliderInput,
          settings: {
            showCheckbox: false
          },
          value: 0,
          readOnly: false
        },
        {
          question: 'slider title',
          type: 'slider',
          component: SliderInput,
          extraQuestion: 'test',
          settings: {
            showCheckbox: true
          },
          value: 0,
          readOnly: false
        },
        {
          question: 'checkbox title',
          type: 'checkbox',
          component: CheckboxInput,
          settings: {
            showTextfield: false
          },
          value: 0,
          readOnly: false
        },
        {
          question: 'checkbox title',
          type: 'checkbox_with_text',
          component: CheckboxInput,
          settings: {
            showTextfield: true
          },
          value: 0,
          readOnly: false
        },
        {
          question: 'textbox title',
          type: 'textfield',
          component: 'textfield-modal',
          value: 0,
          readOnly: false,
          settings: {
            showCheckbox: true
          }
        },
        {
          question: 'textbox title',
          type: 'textfield',
          component: TextfieldModal,
          value: 0,
          readOnly: false,
          settings: {
            showCheckbox: true
          }
        }
      ]
    }
  },

  computed: {
    ...mapGetters('projects', ['currentDimensions'])
  },

  mounted() {
    const dims = this.currentDimensions
    console.log('dimensions:', dims)
  }
}
</script>
