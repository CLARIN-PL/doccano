import { AffectiveTextlabel } from '~/domain/models/tasks/affectiveTextlabel'

export class AffectiveTextlabelDTO {
  id: number
  text: string
  question: string
  user: number

  constructor(item: AffectiveTextlabel) {
    this.id = item.id
    this.text = item.text
    this.question = item.question
    this.user = item.user
  }
}
