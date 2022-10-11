import { AnnotationRepository } from '@/domain/models/tasks/annotationRepository'
import { AffectiveTextlabel } from '~/domain/models/tasks/affectiveTextlabel'

export class APIAffectiveTextlabelRepository extends AnnotationRepository<AffectiveTextlabel> {
  constructor() {
    super(AffectiveTextlabel)
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
