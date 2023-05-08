import 'reflect-metadata'
import { Expose } from 'class-transformer'

export class ExampleMetaContent {
  article_title: string
  publish_datetime: string
  crawled_datetime: string
  type: string
}

export class ExampleMetaItem {
  meta:  ExampleMetaContent
  [key: string]: any
}

export class ExampleItem {
  id: number
  text: string
  scale: []
  label: []
  itemId: string 
  type: string 
  order: number 
  meta: ExampleMetaItem | any 
  [key: string]: any

  @Expose({ name: 'article_id' })
  articleId: string 

  @Expose({ name: 'annotation_approver' })
  annotationApprover: boolean | null

  @Expose({ name: 'comment_count' })
  commentCount: number

  @Expose({ name: 'filename' })
  fileUrl: string

  @Expose({ name: 'is_confirmed' })
  isConfirmed: boolean

  @Expose({ name: 'upload_name' })
  filename: string


  get url() {
    const l = this.fileUrl.indexOf('media/')
    const r = this.fileUrl.indexOf('media/', l + 1)
    return this.fileUrl.slice(0, l) + this.fileUrl.slice(r)
  }

  toObject(): Object {
    return {
      id: this.id,
      text: this.text,
      meta: this.meta,
      scale: this.scale,
      label: this.label,
      annotation_approver: this.annotationApprover,
      comment_count: this.commentCount
    }
  }
}

export class ExampleStateItem {
  id: number
  example: number
  
  @Expose({ name: "confirmed_at"})
  confirmedAt: String

  @Expose({name: "confirmed_by"})
  confirmedBy: number
}

export class ExampleStateItemList {
  count: number
  next: string | null
  prev: string | null
  results: ExampleStateItem[]
}


export class ExampleItemList {
  count: number
  next: string | null
  prev: string | null
  results: ExampleItem[]
}
