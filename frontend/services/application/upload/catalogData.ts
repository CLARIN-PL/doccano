import { Catalog } from '~/domain/models/upload/catalog'

export class CatalogDTO {
  name: string
  example: string
  acceptTypes: string
  properties: object
  taskId: string
  displayName: string

  constructor(item: Catalog) {
    this.name = item.name
    this.example = item.example
    this.acceptTypes = item.acceptTypes || item.accept_types
    this.properties = item.properties
    this.displayName = item.displayName || item.display_name
    this.taskId = item.taskId || item.task_id
  }
}
