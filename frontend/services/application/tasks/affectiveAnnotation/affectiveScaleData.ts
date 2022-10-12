import { ScaleItem } from '~/domain/models/tasks/affectiveScale'

export class AffectiveScaleDTO {
  id: number
  label: number
  scale: number
  user: number

  constructor(item: ScaleItem) {
    this.id = item.id
    this.label = item.label
    this.scale = item.scale
    this.user = item.user
  }
}
