import { AnswerReadItem, AnswerWriteItem,  
  QuestionItem, QuestionItemList, QuestionnaireItem, 
  QuestionnaireItemList, QuestionnaireTimeItem, QuestionnaireTimeItemList, 
  QuestionnaireTypeItem, QuestionnaireTypeItemList } from '~/domain/models/questionnaire/questionnaire'


export class QuestionnaireTypeDTO {
    id: number
    name: string
    description: string
  
    constructor(item: QuestionnaireTypeItem) {
      this.id = item.id
      this.name = item.name
      this.description = item.description
    }
}  

export class QuestionnaireDTO {
  id: number
  name: string
  description: string
  language: string
  questionnaireType: number
  timeOfDay: string

  constructor(item: QuestionnaireItem) {
    this.id = item.id
    this.name = item.name
    this.description = item.description
    this.language = item.language
    this.questionnaireType = item.questionnaireType
    this.timeOfDay = item.timeOfDay
  }
}

export class QuestionDTO {
    id: number
    questionText: string
    questionnaire: number
  
    constructor(item: QuestionItem) {
      this.id = item.id
      this.questionText = item.questionText
      this.questionnaire = item.questionnaire
    }
}

export class AnswerReadDTO {
    id: number
    question: number
    answerText: string
  
    constructor(item: AnswerReadItem) {
      this.id = item.id
      this.question = item.question
      this.answerText = item.answerText
    }
}

export class QuestionnaireTimeItemDTO {
  id: number
  questionnaire: number
  finishedBy: number
  finishedAt: String

  constructor(item: QuestionnaireTimeItem) {
    this.id = item.id
    this.questionnaire = item.questionnaire
    this.finishedBy = item.finishedBy
    this.finishedAt = item.finishedAt
  }
}
  
export type AnswerWriteDTO = Pick<
AnswerWriteItem,
  | 'id'
  | 'question'
  | 'answerText'
> & { tags: string[] }


export class QuestionnaireTypeListDTO {
    count: number
    next: string | null
    previous: string | null
    items: QuestionnaireTypeDTO[]
  
    constructor(item: QuestionnaireTypeItemList) {
      this.count = item.count
      this.next = item.next
      this.previous = item.previous
      this.items = item.items.map((_) => new QuestionnaireTypeDTO(_))
    }
  }
  
  export class QuestionnaireTimeItemListDTO {
    count: number
    next: string | null
    previous: string | null
    items: QuestionnaireTimeItemDTO[]
  
    constructor(item: QuestionnaireTimeItemList) {
      this.count = item.count
      this.next = item.next
      this.previous = item.previous
      this.items = item.items.map((_) => new QuestionnaireTimeItemDTO(_))
    }
  }
  
export class QuestionnaireListDTO {
  count: number
  next: string | null
  previous: string | null
  items: QuestionnaireDTO[]

  constructor(item: QuestionnaireItemList) {
    this.count = item.count
    this.next = item.next
    this.previous = item.previous
    this.items = item.items.map((_) => new QuestionnaireDTO(_))
  }
}

export class QuestionListDTO {
  count: number
  next: string | null
  previous: string | null
  items: QuestionDTO[]

  constructor(item: QuestionItemList) {
    this.count = item.count
    this.next = item.next
    this.previous = item.previous
    this.items = item.items.map((_) => new QuestionDTO(_))
  }
}
