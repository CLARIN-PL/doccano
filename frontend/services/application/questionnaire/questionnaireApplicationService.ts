import { QuestionnaireListDTO, QuestionListDTO, QuestionnaireTypeListDTO, AnswerWriteDTO, AnswerReadDTO } from './questionnaireData'
import { QuestionnaireRepository, SearchOption } from '~/domain/models/questionnaire/questionnaireRepository'
import { AnswerWriteItem } from '~/domain/models/questionnaire/questionnaire'

export class QuestionnaireApplicationService {
  constructor(private readonly repository: QuestionnaireRepository) {}

  public async listTypes(options: SearchOption): Promise<QuestionnaireTypeListDTO> {
    try {
      const items = await this.repository.listTypes(options)
      return new QuestionnaireTypeListDTO(items)
    } catch (e: any) {
      throw new Error(e.response.data.detail)
    }
  }

  public async listQuestionnairesByTypeId(options: SearchOption): Promise<QuestionnaireListDTO> {
    try {
      const items = await this.repository.listQuestionnairesByTypeId(options)
      return new QuestionnaireListDTO(items)
    } catch (e: any) {
      throw new Error(e.response.data.detail)
    }
  }

  public async listQuestionsByQuestionnaireId(options: SearchOption): Promise<QuestionListDTO> {
    try {
      const items = await this.repository.listQuestionsByQuestionnaireId(options)
      return new QuestionListDTO(items)
    } catch (e: any) {
      throw new Error(e.response.data.detail)
    }
  }

  public async createAnswer(item: AnswerWriteDTO): Promise<AnswerReadDTO> {
    try {
      const answer = this.toWriteModel(item)
      const response = await this.repository.createAnswer(answer)
      return new AnswerReadDTO(response)
    } catch (e: any) {
      throw new Error(e.response.data.detail)
    }
  }

  public async updateAnswer(item: AnswerWriteDTO): Promise<AnswerReadDTO> {
    try {
      const answer = this.toWriteModel(item)
      const response = await this.repository.updateAnswer(answer)
      return new AnswerReadDTO(response)
    } catch (e: any) {
      throw new Error(e.response.data.detail)
    }
  }

  private toWriteModel(item: AnswerWriteDTO): AnswerWriteItem {
    return new AnswerWriteItem(
        item.id,
        item.question,
        item.answerText,
    )
  }
}
