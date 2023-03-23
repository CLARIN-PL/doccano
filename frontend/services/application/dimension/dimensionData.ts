import { Expose } from 'class-transformer'
import { DimensionItem } from '~/domain/models/dimension/dimension'

export class DimensionDTO {
  id: number
  name: string
  type: string
  [key: string]: any

  @Expose({ name: 'dimension_metadata' })
  metadata: any

  constructor(item: DimensionItem) {
    this.id = item.id
    this.name = item.name
    this.type = item.type
    this.metadata = item.metadata 
  }
}

export class DimensionListDTO {
  items: DimensionDTO[]
}