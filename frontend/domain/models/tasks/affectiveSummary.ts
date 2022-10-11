import { AnnotationModel } from './interface'

export class AffectiveSummaryLabel implements AnnotationModel {
  constructor(public id: number, public text: string, public question: string, public user: number) {}

  static valueOf({id, text, question, user}: {id: number; text: string; question: string, user: number}) {
    return new AffectiveSummaryLabel(id, text, question, user)
  }

  toObject() {
    return {
      id: this.id,
      text: this.text,
      question: this.question,
      user: this.user
    }
  }
}
