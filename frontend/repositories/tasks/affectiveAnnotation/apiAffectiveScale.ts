import { AnnotationRepository } from '@/domain/models/tasks/annotationRepository'
import { ScaleItem } from '~/domain/models/tasks/affectiveScale'

export class APIAffectiveScaleRepository extends AnnotationRepository<ScaleItem> {
  constructor() {
    super(ScaleItem)
  }

  protected baseUrl(projectId: string, docId: number): string {
    return `/projects/${projectId}/examples/${docId}/scales`
  }
}
