import 'reflect-metadata'
import { Expose, Type } from 'class-transformer'

export type ProjectType =
  | 'DocumentClassification'
  | 'SequenceLabeling'
  | 'Seq2seq'
  | 'IntentDetectionAndSlotFilling'
  | 'ImageClassification'
  | 'Speech2text'
  | 'ArticleAnnotation'
  | 'AffectiveAnnotation'
  | 'DynamicAnnotation'

export class ProjectReadItem {
  id: number
  name: string
  description: string
  guideline: string
  users: number[]
  tags: Object[]
  dimension: any[]

  @Expose({ name: 'project_type' })
  projectType: ProjectType

  @Expose({ name: 'updated_at' })
  updatedAt: string

  @Expose({ name: 'random_order' })
  randomOrder: boolean

  @Expose({ name: 'collaborative_annotation' })
  collaborative_annotation: boolean

  @Expose({ name: 'single_class_classification' })
  exclusiveCategories: boolean

  @Expose({ name: 'resourcetype' })
  resourceType: string

  @Expose({ name: 'allow_overlapping' })
  allowOverlapping: boolean

  @Expose({ name: 'grapheme_mode' })
  graphemeMode: boolean

  @Expose({ name: 'use_relation' })
  useRelation: boolean

  @Expose({ name: 'is_humor_mode' })
  isHumorMode: boolean

  @Expose({ name: 'is_summary_mode' })
  isSummaryMode: boolean

  @Expose({ name: 'is_others_mode' })
  isOthersMode: boolean

  @Expose({ name: 'is_emotions_mode' })
  isEmotionsMode: boolean

  @Expose({ name: 'is_offensive_mode' })
  isOffensiveMode: boolean

  @Expose({ name: 'is_single_ann_view' })
  isSingleAnnView: boolean

  @Expose({ name: 'is_combination_mode' })
  isCombinationMode: boolean

  @Expose({ name: 'is_text_project' })
  isTextProject: boolean

  @Expose({ name: 'can_define_label' })
  canDefineLabel: boolean

  @Expose({ name: 'can_define_relation' })
  canDefineRelation: boolean

  @Expose({ name: 'can_define_span' })
  canDefineSpan: boolean

  @Expose({ name: 'can_define_category' })
  canDefineCategory: boolean

  get annotationPageLink(): string {
    const mapping = {
      DocumentClassification: 'text-classification',
      SequenceLabeling: 'sequence-labeling',
      Seq2seq: 'sequence-to-sequence',
      IntentDetectionAndSlotFilling: 'intent-detection-and-slot-filling',
      ImageClassification: 'image-classification',
      Speech2text: 'speech-to-text',
      ArticleAnnotation: 'article-annotation',
      AffectiveAnnotation: 'affective-annotation',
      DynamicAnnotation: 'dynamic-annotation'

    }
    const url = `/projects/${this.id}/${mapping[this.projectType]}`
    return url
  }

  get taskNames(): string[] {
    if (this.projectType === 'IntentDetectionAndSlotFilling') {
      return ['DocumentClassification', 'SequenceLabeling']
    }
    return [this.projectType]
  }
}

export class ProjectItemList {
  count: number
  next: string | null
  prev: string | null

  @Type(() => ProjectReadItem)
  @Expose({ name: 'results' })
  items: ProjectReadItem[]
}

export class ProjectWriteItem {
  constructor(
    public id: number,
    public name: string,
    public description: string,
    public guideline: string,
    public project_type: ProjectType,
    public random_order: boolean,
    public collaborative_annotation: boolean,
    public single_class_classification: boolean,
    public allow_overlapping: boolean,
    public grapheme_mode: boolean,
    public use_relation: boolean,
    public is_humor_mode: boolean,
    public is_emotions_mode: boolean,
    public is_summary_mode: boolean,
    public is_offensive_mode: boolean,
    public is_others_mode: boolean,
    public is_single_ann_view: boolean,
    public is_combination_mode: boolean,
    public dimension: any[],
    public tags?: string[],
  ) {}

  get resourceType(): string {
    const mapping = {
      DocumentClassification: 'TextClassificationProject',
      SequenceLabeling: 'SequenceLabelingProject',
      Seq2seq: 'Seq2seqProject',
      IntentDetectionAndSlotFilling: 'IntentDetectionAndSlotFillingProject',
      ImageClassification: 'ImageClassificationProject',
      Speech2text: 'Speech2textProject',
      ArticleAnnotation: 'ArticleAnnotationProject',
      AffectiveAnnotation: 'AffectiveAnnotationProject',
      DynamicAnnotation: 'DynamicAnnotationProject'

    }
    return mapping[this.project_type]
  }

  toObject(): Object {
    const result : any =  {
      id: this.id,
      name: this.name,
      description: this.description,
      guideline: this.guideline,
      project_type: this.project_type,
      random_order: this.random_order,
      collaborative_annotation: this.collaborative_annotation,
      single_class_classification: this.single_class_classification,
      allow_overlapping: this.allow_overlapping,
      grapheme_mode: this.grapheme_mode,
      use_relation: this.use_relation,
      resourcetype: this.resourceType,
      is_humor_mode: this.is_humor_mode,
      is_emotions_mode: this.is_emotions_mode,
      is_summary_mode: this.is_summary_mode,
      is_offensive_mode: this.is_offensive_mode,
      is_others_mode: this.is_others_mode,
      is_single_ann_view: this.is_single_ann_view,
      is_combination_mode: this.is_combination_mode,
      dimension: this.dimension,
    }

    if(result.project_type !== "DynamicAnnotation") {
      result.tags = this.tags? this.tags.map((tag) => ({ text: tag })) : []
    }

    return result
  }
}
