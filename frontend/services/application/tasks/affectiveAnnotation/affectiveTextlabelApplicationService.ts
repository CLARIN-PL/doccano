import { AnnotationApplicationService } from '../annotationApplicationService'
import { AffectiveTextlabelDTO } from './affectiveTextlabelData'
import { APIAffectiveTextlabelRepository } from '~/repositories/tasks/affectiveAnnotation/apiAffectiveTextlabel'
import { AffectiveTextlabel } from '~/domain/models/tasks/affectiveTextlabel'

export class AffectiveTextlabelApplicationService extends AnnotationApplicationService<AffectiveTextlabel> {
  constructor(readonly repository: APIAffectiveTextlabelRepository) {
    super(new APIAffectiveTextlabelRepository())
  }

  public async list(projectId: string, docId: number): Promise<AffectiveTextlabelDTO[]> {
    const items = await this.repository.list(projectId, docId)
    return items.map((item) => new AffectiveTextlabelDTO(item))
  }

  public async create(projectId: string, docId: number, text: string, question: string): Promise<void> {
    const item = new AffectiveTextlabel(0, text, question, 0)
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
