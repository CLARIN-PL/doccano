import { 
  QuestionItemList, 
  QuestionnaireTypeItemList, 
  QuestionnaireItemList, 
  AnswerReadItem, 
  AnswerWriteItem,
  QuestionnaireTimeItem,
  QuestionnaireTimeItemList} 
from '~/domain/models/questionnaire/questionnaire'

export type SearchOption = { [key: string]: string | (string | null)[] }

export interface QuestionnaireRepository {
  listTypes({ limit, offset, q }: SearchOption): Promise<QuestionnaireTypeItemList>

  listQuestionnairesByTypeId({ questionnaireTypeId, limit, offset, q }: SearchOption): Promise<QuestionnaireItemList>

  listQuestionsByQuestionnaireId({ questionnaireId, limit, offset, q }: SearchOption): Promise<QuestionItemList>

  listFinishedQuestionnaires({limit, offset, q}: SearchOption): Promise<QuestionnaireTimeItemList>

  createAnswer(item: AnswerWriteItem): Promise<AnswerReadItem>

  updateAnswer(item: AnswerWriteItem): Promise<AnswerReadItem>

  createQuestionnaireFinishedState(questionnaireId: number): Promise<QuestionnaireTimeItem>

}
