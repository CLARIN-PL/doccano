import { AnnotationApplicationService } from '../annotationApplicationService'
import { AffectiveScaleDTO } from './affectiveScaleData'
import { ScaleItem } from '~/domain/models/tasks/affectiveScale'

export class AffectiveScaleApplicationService extends AnnotationApplicationService<ScaleItem> {
  public async list(projectId: string, docId: number): Promise<AffectiveScaleDTO[]> {
    const items = await this.repository.list(projectId, docId)
    return items.map((item) => new AffectiveScaleDTO(item))
  }

  public async create(projectId: string, docId: number, labelId: number, scale: number): Promise<void> {
    const item = new ScaleItem(0, labelId, scale, 0)
    await this.repository.create(projectId, docId, item)
  }

  public async clear(projectId: string, docId: number): Promise<void> {
    await this.repository.clear(projectId, docId)
  }
}
