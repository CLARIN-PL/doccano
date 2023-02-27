import { DimensionRepository } from '~/domain/models/dimension/dimensionRepository'
import { DimensionItem, DimensionItemList } from '~/domain/models/dimension/dimension'

export class DimensionApplicationService {
  constructor(private readonly repository: DimensionRepository) {}

  public async list(projectId: string): Promise<DimensionItemList> {
    return await this.repository.list(projectId)
  }

  public async create(projectId: string, name: string, type: string, metadata: string): Promise<DimensionItem> {
    return await this.repository.create(projectId, name, type, metadata)
  }

  public async delete(projectId: string, dimensionId: number): Promise<void> {
    await this.repository.delete(projectId, dimensionId)
  }
}
