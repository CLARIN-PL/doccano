export class LabelItem {
  id: number
  text: string
  [key: string]: any

  toObject() {
    return {
      id: this.id,
      text: this.text,
      prefix_key: this.prefix_key,
      suffix_key: this.suffix_key,
      background_color: this.background_color,
      text_color: this.text_color
    }
  }
}

export class DocTypeItem extends LabelItem {}
export class SpanTypeItem extends LabelItem {}
