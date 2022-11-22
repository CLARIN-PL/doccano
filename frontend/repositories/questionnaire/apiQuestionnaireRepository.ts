import { plainToInstance } from 'class-transformer'
import ApiService from '@/services/api.service'
import { QuestionnaireRepository, SearchOption } from '~/domain/models/questionnaire/questionnaireRepository'
import { QuestionnaireTypeItemList, QuestionnaireItemList, QuestionItemList, AnswerReadItem, AnswerWriteItem } 
from "~/domain/models/questionnaire/questionnaire"

export class APIQuestionnaireRepository implements QuestionnaireRepository {
  constructor(private readonly request = ApiService) {}

  async listTypes({ limit = '10', offset = '0', q = '' }: SearchOption): Promise<QuestionnaireTypeItemList> {
    const url = `/questionnaire_types?limit=${limit}&offset=${offset}&q=${q}`
    const response = await this.request.get(url)
    return plainToInstance(QuestionnaireTypeItemList, response.data)
  }

  async listQuestionnairesByTypeId({ questionnaireTypeId = '1', limit = '10', offset = '0', q = '' }: SearchOption): 
    Promise<QuestionnaireItemList> {
    const url = `/questionnaires/${questionnaireTypeId}?limit=${limit}&offset=${offset}&q=${q}`
    const response = await this.request.get(url)
    return plainToInstance(QuestionnaireItemList, response.data)
  }

  async listQuestionsByQuestionnaireId({ questionnaireId = '1', limit = '10', offset = '0', q = '' }: SearchOption): 
    Promise<QuestionItemList> {
    const url = `/questionnaires/${questionnaireId}/questions?limit=${limit}&offset=${offset}&q=${q}`
    const response = await this.request.get(url)
    return plainToInstance(QuestionItemList, response.data)
  }

  async createAnswer(item: AnswerWriteItem): Promise<AnswerReadItem> {
    const url = `/answer`
    const response = await this.request.post(url, item.toObject())
    return plainToInstance(AnswerReadItem, response.data)
  }

  async updateAnswer(item: AnswerWriteItem): Promise<void> {
    // do something
  }
}
