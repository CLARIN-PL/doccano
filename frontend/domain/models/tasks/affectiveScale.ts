import { AnnotationModel } from './interface'

export class ScaleItem implements AnnotationModel {
  constructor(public id: number, public label: number, public scale: number, public user: number) {}

  static valueOf({ id, label, scale, user }: { id: number; label: number; scale: number; user: number }) {
    return new ScaleItem(id, label, scale, user)
  }

  toObject() {
    return {
      id: this.id,
      label: this.label,
      scale: this.scale,
      user: this.user
    }
  }
}
