import { AnnotationApplicationService } from '../annotationApplicationService'
import { AffectiveSummaryDTO } from './summaryData'
import { APIAffectiveSummaryRepository } from '~/repositories/tasks/affectiveAnnotation/apiAffectiveSummary'
import { AffectiveSummaryLabel } from '~/domain/models/tasks/affectiveSummary'

export class AffectiveSummaryApplicationService extends AnnotationApplicationService<AffectiveSummaryLabel> {
  constructor(readonly repository: APIAffectiveSummaryRepository) {
    super(new APIAffectiveSummaryRepository())
  }

  public async list(projectId: string, docId: number): Promise<AffectiveSummaryDTO[]> {
    const items = await this.repository.list(projectId, docId)
    return items.map((item) => new AffectiveSummaryDTO(item))
  }

  public async create(projectId: string, docId: number, text: string, question: string): Promise<void> {
    const item = new AffectiveSummaryLabel(0, text, question, 0)
    await this.repository.create(projectId, docId, item)
  }

  public async changeText(
    projectId: string,
    docId: number,
    annotationId: number,
    text: string,
    question: string
  ): Promise<void> {
    await this.repository.update(projectId, docId, annotationId, text, question)
  }
}
