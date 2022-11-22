import 'reflect-metadata'
import { Expose, Type } from 'class-transformer'

export class QuestionnaireTypeItem {
  id: number
  name: string
  description: string
}

export class QuestionnaireItem {
    id: number
    name: string
    description: string
    language: string
    
    @Expose({ name: 'questionnaire_type' })
    questionnaireType: number

    @Expose({ name: 'time_of_day' })
    timeOfDay: string
}

export class QuestionItem {
    id: number
    questionnaire: number
    
    @Expose({ name: 'question_text' })
    questionText: string
}

export class AnswerReadItem {
  id: number
  question: number
  
  @Expose({ name: 'answer_text' })
  answerText: string
}

export class AnswerWriteItem {
    constructor(
        public id: number,
        public question: number,
        public answerText: string,
    ) {}
  
    toObject(): Object {
      return {
        id: this.id,
        question: this.question,
        answer_text: this.answerText,
      }
    }
}

export class QuestionnaireTypeItemList {
    count: number
    next: string | null
    previous: string | null
  
    @Type(() => QuestionnaireTypeItem)
    @Expose({ name: 'results' })
    items: QuestionnaireTypeItem[]
  }


export class QuestionItemList {
    count: number
    next: string | null
    previous: string | null
  
    @Type(() => QuestionItem)
    @Expose({ name: 'results' })
    items: QuestionItem[]
}

export class QuestionnaireItemList {
    count: number
    next: string | null
    previous: string | null
  
    @Type(() => QuestionnaireItem)
    @Expose({ name: 'results' })
    items: QuestionnaireItem[]
}
  
  

