<template>
  <v-card>
    <v-card-title v-if="isProjectAdmin">
      <v-row >
        <v-col cols="12" align="right" >
          <v-btn 
            color="ms-4 my-1 mb-2 primary text-capitalize" 
            v-if="!showTableAnnButton"
            @click="toLabeling">
            {{ $t('home.startAnnotation') }}
          </v-btn>
        </v-col>
        <v-col cols="5">
          <action-menu
            @upload="$router.push('dataset/import')"
            @download="$router.push('dataset/export')"
          />
          <v-btn
            class="text-capitalize ms-2"
            :disabled="!canDelete"
            outlined
            @click.stop="dialogDelete = true"
          >
            {{ $t('generic.delete') }}
          </v-btn>
        </v-col>
        <v-col cols="7" align="right">
          <action-menu-util
            button-color=""
            class="mr-2"
            :items="annotationConfirmationOptions"
            :text="$t('dataset.annotationConfirmationStatus')"
            @view-all="isConfirmed = ''"
            @view-confirmed="isConfirmed = true"
            @view-not-confirmed="isConfirmed = false"
          />
          <v-btn
            :disabled="!item.count"
            class="text-capitalize"
            color="error"
            @click="dialogDeleteAll = true"
          >
            {{ $t('generic.deleteAll') }}
          </v-btn>
          <v-dialog v-model="dialogDelete">
            <form-delete
              :selected="selected"
              :item-key="itemKey"
              @cancel="dialogDelete = false"
              @remove="remove"
            />
          </v-dialog>
          <v-dialog v-model="dialogDeleteAll">
            <form-delete-bulk @cancel="dialogDeleteAll = false" @remove="removeAll" />
          </v-dialog>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-title v-else>
      <action-menu-util
        button-color=""
        :items="annotationConfirmationOptions"
        :text="$t('dataset.annotationConfirmationStatus')"
        @view-all="isConfirmed = ''"
        @view-confirmed="isConfirmed = true"
        @view-not-confirmed="isConfirmed = false"
      />
      <v-spacer />
      <v-btn 
        color="ms-4 my-1 mb-2 primary text-capitalize" 
        v-if="!showTableAnnButton"
        @click="toLabeling">
        {{ $t('home.startAnnotation') }}
      </v-btn>
    </v-card-title>
    <image-list
      v-if="isImageTask"
      v-model="selected"
      :items="item.items"
      :is-loading="isLoading"
      :total="item.count"
      @update:query="updateQuery"
      @click:labeling="movePage"
    />
    <audio-list
      v-else-if="isAudioTask"
      v-model="selected"
      :items="item.items"
      :is-loading="isLoading"
      :total="item.count"
      @update:query="updateQuery"
      @click:labeling="movePage"
    />
    <article-list
      v-else-if="isArticleTask"
      v-model="selected"
      :project="project"
      :items="item.items"
      :is-loading="isLoading"
      :show-annotation-button="showTableAnnButton"
      :total="item.count"
      @update:query="updateQuery"
      @click:labeling="movePage"
    />
    <document-list
      v-else
      v-model="selected"
      :project="project"
      :items="item.items"
      :is-loading="isLoading"
      :total="item.count"
      @update:query="updateQuery"
      @click:labeling="movePage"
    />
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import _ from 'lodash'
import ArticleList from '@/components/example/ArticleList.vue'
import DocumentList from '@/components/example/DocumentList.vue'
import FormDelete from '@/components/example/FormDelete.vue'
import FormDeleteBulk from '@/components/example/FormDeleteBulk.vue'
import ActionMenuUtil from '~/components/utils/ActionMenu.vue'
import ImageList from '~/components/example/ImageList.vue'
import AudioList from '~/components/example/AudioList.vue'
import { ExampleListDTO, ExampleDTO } from '~/services/application/example/exampleData'
import ActionMenu from '~/components/example/ActionMenu.vue'
import { ProjectDTO } from '~/services/application/project/projectData'

export default Vue.extend({
  components: {
    ActionMenu,
    ActionMenuUtil,
    AudioList,
    ArticleList,
    DocumentList,
    ImageList,
    FormDelete,
    FormDeleteBulk
  },

  layout: 'project',

  validate({ params, query }) {
    // @ts-ignore
    return /^\d+$/.test(params.id) && /^\d+|$/.test(query.limit) && /^\d+|$/.test(query.offset)
  },

  data() {
    return {
      dialogDelete: false,
      dialogDeleteAll: false,
      project: {} as ProjectDTO,
      item: { items: [] as ExampleDTO[] } as ExampleListDTO,
      selected: [] as ExampleDTO[],
      isLoading: false,
      isProjectAdmin: false,
      isConfirmed: '',
    }
  },

  async fetch() {
    await this.loadData()
  },

  computed: {
    annotationConfirmationOptions() : any[] {
      return [
        {
          title: this.$t('dataset.viewAllStatus'),
          event: 'view-all'
        },
        {
          title: this.$t('dataset.viewConfirmedStatus'),
          event: 'view-confirmed'
        },
        {
          title: this.$t('dataset.viewNotConfirmedStatus'),
          event: 'view-not-confirmed'
        },
      ]
    },
    canDelete(): boolean {
      return this.selected.length > 0
    },
    projectId(): string {
      return this.$route.params.id
    },
    showTableAnnButton() : boolean {
      return this.isArticleTask && this.isProjectAdmin && !this.project.isSingleAnnView
    },
    isArticleTask(): boolean {
      const articleTasks = ['ArticleAnnotation', 'AffectiveAnnotation']
      return articleTasks.includes(this.project.projectType)
    },
    isImageTask(): boolean {
      return this.project.projectType === 'ImageClassification'
    },
    isAudioTask(): boolean {
      return this.project.projectType === 'Speech2text'
    },
    hasUnannotatedItem() : boolean {
      return !!this.item.items.find((item: any) => !item.isConfirmed)
    },
    itemKey(): string {
      if (this.isImageTask || this.isAudioTask) {
        return 'filename'
      } else {
        return 'text'
      }
    },
  },

  watch: {
    isConfirmed() {
      this.loadData()
    },
    '$route.query': _.debounce(function () {
      // @ts-ignore
      this.$fetch()
    }, 1000)
  },

  async created() {
    this.project = await this.$services.project.findById(this.projectId)
    this.isProjectAdmin = await this.$services.member.isProjectAdmin(this.projectId)
  },

  methods: {
    async toLabeling() {
      const item : undefined | ExampleDTO = this.hasUnannotatedItem ? 
        this.item.items.find((item: any) => !item.isConfirmed)
        : this.item.items[0]
      const index = item ? this.item.items.indexOf(item) : 0
      const page = ( index + 1).toString()
      await this.startAnnotation()
      this.movePage({ page })
    },
    startAnnotation() {
      const item = this.hasUnannotatedItem ? 
        this.item.items.find((item: any) => !item.isConfirmed)
        : this.item.items[0]
      !item.isConfirmed && this.$services.example.annotateStartStates(this.projectId, item.id)
    },
    async loadData() {
      this.isLoading = true
      const query = {...this.$route.query, ...{
        isChecked: this.isConfirmed
      }}
      this.item = await this.$services.example.list(this.projectId, query)
      this.isLoading = false
    },
    async remove() {
      await this.$services.example.bulkDelete(this.projectId, this.selected)
      this.$fetch()
      this.dialogDelete = false
      this.selected = []
    },
    async removeAll() {
      await this.$services.example.bulkDelete(this.projectId, [])
      this.$fetch()
      this.dialogDeleteAll = false
      this.selected = []
    },
    updateQuery(query: object) {
      this.$router.push(query)
    },
    movePage(query: object) {
      this.updateQuery({
        path: this.localePath(this.project.pageLink),
        query
      })
    },
  }
})
</script>

<style scoped>
::v-deep .v-dialog {
  width: 800px;
}
</style>
