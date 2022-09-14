import { Expose } from 'class-transformer'
import { ExampleArticleItem, ExampleItem, ExampleItemList } from '~/domain/models/example/example'

export class ExampleMetadataDTO {
  key: string
  value: string
}

export class ExampleMetaContentDTO {
  article_title: string
  publish_datetime: string
  crawled_datetime: string
  type: string
}

export class ExampleMetaDTO {
  meta:  ExampleMetaContentDTO
}

export class ExampleChildArticleDTO {
  id: number
  text: string
  meta: ExampleMetaDTO 
  annotationApprover: boolean | null
  commentCount: number
  isApproved: boolean
  fileUrl: string
  filename: string
  url: string
  isConfirmed: boolean
  articleId: string 
  type: string 
  order: number
  itemId: string 

  constructor(item: ExampleArticleItem) {
    this.id = item.id
    this.text = item.text
    this.meta = item.meta
    this.annotationApprover = item.annotationApprover
    this.commentCount = item.commentCount
    this.isApproved = !!item.annotationApprover
    this.fileUrl = item.fileUrl
    this.filename = item.filename
    this.url = item.url
    this.isConfirmed = item.isConfirmed
    this.articleId = item.articleId
    this.type = item.type
    this.order = item.order
    this.itemId = item.itemId
  }
}


export class ExampleDTO {
  id: number
  text: string
  meta: object
  annotationApprover: boolean | null
  commentCount: number
  isApproved: boolean
  fileUrl: string
  filename: string
  url: string
  isConfirmed: boolean

  constructor(item: ExampleItem) {
    this.id = item.id
    this.text = item.text
    this.meta = item.meta
    this.annotationApprover = item.annotationApprover
    this.commentCount = item.commentCount
    this.isApproved = !!item.annotationApprover
    this.fileUrl = item.fileUrl
    this.filename = item.filename
    this.url = item.url
    this.isConfirmed = item.isConfirmed
  }
}

export interface ExampleGroupedDTO {
  [key: string]: ExampleDTO[]
}

export class ExampleArticleDTO {
  id: number
  title: string 
  data: ExampleChildArticleDTO[]
  itemId: string 
  articleId: string
  
  @Expose({ name: 'publish_datetime' })
  publishDatetime: string 
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
    this.items = item.items.map((_) => new ExampleDTO(_))
  }
}


