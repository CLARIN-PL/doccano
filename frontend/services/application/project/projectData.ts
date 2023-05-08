import { ProjectReadItem, ProjectType, ProjectItemList } from '~/domain/models/project/project'

export class ProjectDTO {
  id: number
  name: string
  description: string
  guideline: string
  projectType: ProjectType
  updatedAt: string
  enableRandomOrder: boolean
  enableShareAnnotation: boolean
  singleClassClassification: boolean
  pageLink: string
  tags: Object[] | string[]
  dimension: Object[] | string[]
  canDefineLabel: boolean
  canDefineRelation: boolean
  isTextProject: boolean
  allowOverlapping: boolean
  graphemeMode: boolean
  hasCategory: boolean
  hasSpan: boolean
  taskNames: string[]
  useRelation: boolean
  isHumorMode: boolean
  isOthersMode: boolean
  isSummaryMode: boolean
  isOffensiveMode: boolean
  isEmotionsMode: boolean
  affectiveProjectMode?: string
  isSingleAnnView: boolean
  isCompleted?: boolean
  isCombinationMode: boolean

  constructor(item: ProjectReadItem) {
    this.id = item.id
    this.name = item.name
    this.description = item.description
    this.guideline = item.guideline
    this.projectType = item.projectType || item.project_type
    this.updatedAt = item.updatedAt || item.updated_at
    this.enableRandomOrder = item.randomOrder || item.random_order
    this.enableShareAnnotation = item.collaborative_annotation
    this.singleClassClassification = item.exclusiveCategories || item.single_class_classification
    this.pageLink = item.annotationPageLink
    this.tags = item.tags
    this.canDefineLabel = item.canDefineLabel || item.can_define_label
    this.canDefineRelation = item.canDefineRelation || item.can_define_relation
    this.isTextProject = item.isTextProject || item.is_text_project
    this.allowOverlapping = item.allowOverlapping || item.allow_overlapping
    this.graphemeMode = item.graphemeMode || item.grapheme_mode
    this.hasCategory = item.canDefineCategory || item.can_define_category
    this.hasSpan = item.canDefineSpan || item.can_define_span
    this.taskNames = item.taskNames
    this.useRelation = item.useRelation || item.use_relation
    this.isHumorMode = item.isHumorMode || item.is_humor_mode
    this.isOthersMode = item.isOthersMode || item.is_others_mode
    this.isSummaryMode = item.isSummaryMode || item.is_summary_mode
    this.isOffensiveMode = item.isOffensiveMode || item.is_offensive_mode
    this.isEmotionsMode = item.isEmotionsMode || item.is_emotions_mode
    this.isSingleAnnView = item.isSingleAnnView || item.is_single_ann_view
    this.isCombinationMode = item.isCombinationMode || item.is_combination_mode
    this.dimension = item.dimension
  }
}

export type ProjectWriteDTO = Pick<
  ProjectDTO,
  | 'id'
  | 'name'
  | 'description'
  | 'guideline'
  | 'projectType'
  | 'enableRandomOrder'
  | 'enableShareAnnotation'
  | 'singleClassClassification'
  | 'allowOverlapping'
  | 'graphemeMode'
  | 'useRelation'
  | 'affectiveProjectMode'
  | 'isHumorMode'
  | 'isOthersMode'
  | 'isSummaryMode'
  | 'isOffensiveMode'
  | 'isEmotionsMode'
  | 'isSingleAnnView'
  | 'isCompleted'
  | 'isCombinationMode'
  | 'dimension'
> & { tags: string[] }

export class ProjectListDTO {
  count: number
  next: string | null
  prev: string | null
  items: ProjectDTO[]

  constructor(item: ProjectItemList) {
    this.count = item.count
    this.next = item.next
    this.prev = item.prev
    this.items = item.items.map((_) => new ProjectDTO(_))
  }
}
