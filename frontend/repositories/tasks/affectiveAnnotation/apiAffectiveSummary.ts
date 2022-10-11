import { AnnotationRepository } from '@/domain/models/tasks/annotationRepository'
import { AffectiveSummaryLabel } from '~/domain/models/tasks/affectiveSummary'

export class APIAffectiveSummaryRepository extends AnnotationRepository<AffectiveSummaryLabel> {
  constructor() {
    super(AffectiveSummaryLabel)
  }

  public async update(projectId: string, docId: number, annotationId: number, text: string, question: string) {
    const url = this.baseUrl(projectId, docId) + `/${annotationId}`
    const payload = { text, question }
    await this.request.patch(url, payload)
  }

  protected baseUrl(projectId: string, docId: number): string {
    return `/projects/${projectId}/examples/${docId}/texts`
  }
}
