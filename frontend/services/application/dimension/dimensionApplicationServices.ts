import { DimensionRepository } from '~/domain/models/dimension/dimensionRepository'
import { DimensionItem, DimensionItemList } from '~/domain/models/dimension/dimension'

export class DimensionApplicationService {
  constructor(private readonly repository: DimensionRepository) {}

  public async listAllDimensions(): Promise<DimensionItemList> {
    return await this.repository.listAllDimensions()
  }

  public async list(projectId: string): Promise<DimensionItemList> {
    return await this.repository.list(projectId)
  }

  public async getDimensionMetaData(dimensionId: number): Promise<string> {
    return await this.repository.getDimensionMetaData(dimensionId)
  }

  public async create(projectId: string, name: string, type: string, metadata: string): Promise<DimensionItem> {
    return await this.repository.create(projectId, name, type, metadata)
  }

  public async assignDimensions(projectId: string, dimension: number[]): Promise<void> {
    await this.repository.assignDimensions(projectId, dimension)
  }
}
