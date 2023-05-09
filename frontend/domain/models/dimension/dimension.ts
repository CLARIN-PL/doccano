import 'reflect-metadata'

export class DimensionItem {
  [key: string]: any

  constructor(
    public id: number,
    public name: string,
    public type: string,
    public metadata: Object[]
  ) {}

  toObject(): Object {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      metadata: this.metadata || this.dimension_metadata
    }
  }
}

export class DimensionItemList {
  constructor(
    public items: DimensionItem[]
  ) {}

  toObject(): Object {
    return {
      items: this.items
    }
  }
}
