import { DimensionRepository } from '~/domain/models/dimension/dimensionRepository'
import { DimensionItem, DimensionItemList } from '~/domain/models/dimension/dimension'

export class DimensionApplicationService {
  constructor(private readonly repository: DimensionRepository) {}

  public async listAll(): Promise<DimensionItemList> {
    return await this.repository.listAll()
  }

  public async list(projectId: string): Promise<DimensionItemList> {
    return await this.repository.list(projectId)
  }

  public async create(projectId: string, name: string, type: string, metadata: string): Promise<DimensionItem> {
    return await this.repository.create(projectId, name, type, metadata)
  }

  public async assign(projectId: string, dimension: number[]): Promise<void> {
    await this.repository.assign(projectId, dimension)
  }
}
