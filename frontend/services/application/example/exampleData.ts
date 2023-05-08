import { Expose } from 'class-transformer'
import { ExampleItem,ExampleStateItem, ExampleStateItemList, ExampleMetaItem, ExampleItemList } from '~/domain/models/example/example'

export class ExampleMetadataDTO {
  key: string
  value: string
}

export class ExampleStateDTO {
  id: number
  example: number
  confirmedAt: String
  confirmedBy: number

  constructor(item: ExampleStateItem) {
    this.id = item.id
    this.example = item.example
    this.confirmedAt = item.confirmedAt || item.confirmed_at
    this.confirmedBy = item.confirmedBy || item.confirmed_by
  }
}

export class ExampleDTO {
  id: number
  text: string
  meta: ExampleMetaItem
  annotationApprover: boolean | null
  commentCount: number
  isApproved: boolean
  fileUrl: string
  filename: string
  url: string
  isConfirmed: boolean
  articleId: string 
  type: string 
  order: number | null 
  itemId: string 

  constructor(item: ExampleItem) {
    this.id = item.id
    this.text = item.text
    this.meta = item.meta
    this.annotationApprover = item.annotationApprover ||  item.annotation_approver
    this.commentCount = item.commentCount || item.comment_count
    this.isApproved = !!item.annotationApprover || !!item.annotation_approver
    this.fileUrl = item.fileUrl || item.filename
    this.filename = item.filename || item.upload_name
    this.url = item.url
    this.isConfirmed = item.isConfirmed || item.is_confirmed
    this.articleId = item.articleId || item.article_id
    this.type = item.type
    this.order = item.order
    this.itemId = item.itemId
  }
}

export interface ExampleGroupedDTO {
  [key: string]: ExampleDTO[]
}

export class ExampleArticleDTO {
  id: number
  title: string 
  data: ExampleDTO[]
  itemId: string 
  articleId: string
  isConfirmed: boolean
  [key: string]: any
  
  @Expose({ name: 'publish_datetime' })
  publishDatetime: string 
}

export class ExampleStateListDTO {
  count: number
  next: string | null
  prev: string | null
  items: ExampleStateDTO[] 

  constructor(item: ExampleStateItemList) {
    this.count = item.count
    this.next = item.next
    this.prev = item.prev
    this.items = item.results.map((_ : any ) => new ExampleStateDTO(_))
  }
}


export class ExampleListDTO {
  count: number
  next: string | null
  prev: string | null
  items: ExampleDTO[]

  constructor(item: ExampleItemList) {
    this.count = item.count
    this.next = item.next
    this.prev = item.prev
    this.items = item.results.map((_: any) => new ExampleDTO(_))
  }
}


