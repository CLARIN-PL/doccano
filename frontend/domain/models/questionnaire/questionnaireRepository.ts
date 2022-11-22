import { 
  QuestionItemList, 
  QuestionnaireTypeItemList, 
  QuestionnaireItemList, 
  AnswerReadItem, 
  AnswerWriteItem} 
from '~/domain/models/questionnaire/questionnaire'

export type SearchOption = { [key: string]: string | (string | null)[] }

export interface QuestionnaireRepository {
  listTypes({ limit, offset, q }: SearchOption): Promise<QuestionnaireTypeItemList>

  listQuestionnairesByTypeId({ questionnaireTypeId, limit, offset, q }: SearchOption): Promise<QuestionnaireItemList>

  listQuestionsByQuestionnaireId({ questionnaireId, limit, offset, q }: SearchOption): Promise<QuestionItemList>

  createAnswer(item: AnswerWriteItem): Promise<AnswerReadItem>

}
