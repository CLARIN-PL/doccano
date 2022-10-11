import { AffectiveSummaryLabel } from '~/domain/models/tasks/affectiveSummary'

export class AffectiveSummaryDTO {
  id: number
  text: string
  question: string
  user: number

  constructor(item: AffectiveSummaryLabel) {
    this.id = item.id
    this.text = item.text
    this.question = item.question
    this.user = item.user
  }
}
