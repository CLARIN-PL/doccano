import 'reflect-metadata'

export class DimensionItem {
  constructor(
    public id: number,
    public name: string,
    public type: string,
    public metadata: string
  ) {}

  toObject(): Object {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      metadata: this.metadata
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
