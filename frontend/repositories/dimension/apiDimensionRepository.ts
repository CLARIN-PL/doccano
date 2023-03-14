import ApiService from '@/services/api.service'
import { DimensionRepository } from '~/domain/models/dimension/dimensionRepository'
import { DimensionItem, DimensionItemList } from '~/domain/models/dimension/dimension'

export class APIDimensionRepository implements DimensionRepository {
  constructor(private readonly request = ApiService) {}

  async listAll(): Promise<DimensionItemList> {
    const url = `/projects/dimensions`
    const response = await this.request.get(url)
    const dimensions = response.data.map(
      (item: any) => new DimensionItem(item.id, item.name, item.type, item.dimension_metadata)
    )
    return new DimensionItemList(dimensions)
  }

  async list(projectId: string): Promise<DimensionItemList> {
    const url = `/projects/${projectId}/dimension-detail`
    const response = await this.request.get(url)
    const dimensions = response.data.map(
      (item: any) => new DimensionItem(item.id, item.name, item.type, item.dimension_meta_data)
    )
    return new DimensionItemList(dimensions)
  }

  async create(projectId: string, name: string, type: string, dimension_meta_data: string): Promise<DimensionItem> {
    const url = `/projects/${projectId}/dimensions`
    const response = await this.request.post(url, { name, type, dimension_meta_data })
    return new DimensionItem(response.data.id, response.data.name, response.data.type, response.data.metadata)
  }

  async delete(projectId: string, dimensionId: number): Promise<void> {
    const url = `/projects/${projectId}/dimensions/${dimensionId}`
    await this.request.delete(url)
  }
}
