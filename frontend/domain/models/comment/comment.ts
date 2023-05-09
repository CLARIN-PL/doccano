import 'reflect-metadata'
import { Expose, Type } from 'class-transformer'

export class CommentItem {
  id: number
  user: number
  username: string
  example: number
  text: string
  [key: string]: any

  by(userId: number) {
    return this.user === userId
  }

  toObject(): Object {
    return {
      id: this.id,
      user: this.user,
      username: this.username,
      document: this.example,
      text: this.text,
      created_at: this.created_at 
    }
  }
}

export class CommentItemList {
  count: number
  next: string | null
  prev: string | null
  [key: string]: any

  @Type(() => CommentItem)
  @Expose({ name: 'results' })
  items: CommentItem[]
}
