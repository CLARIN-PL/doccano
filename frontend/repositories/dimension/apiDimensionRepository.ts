import ApiService from '@/services/api.service'
import { DimensionRepository } from '~/domain/models/dimension/dimensionRepository'
import { DimensionItem, DimensionItemList } from '~/domain/models/dimension/dimension'

export class APIDimensionRepository implements DimensionRepository {
  constructor(private readonly request = ApiService) {}

  async listAllDimensions(): Promise<DimensionItemList> {
    const url = `/projects/dimensions`
    const response = await this.request.get(url)
    const dimensions = response.data.map(
      function(item: any) {
        const dimension_meta_data = item.dimension_meta_data
        for (let idx = 0; idx < dimension_meta_data.length; idx++) {
          dimension_meta_data[idx].config.with_checkbox = !!dimension_meta_data[idx].config.with_checkbox
          dimension_meta_data[idx].config.is_multiple_answers = !!dimension_meta_data[idx].config.is_multiple_answers
        }
        return new DimensionItem(item.id, item.name, item.type, dimension_meta_data)
      }
    )
    return new DimensionItemList(dimensions)
  }

  async list(projectId: string): Promise<DimensionItemList> {
    const url = `/projects/${projectId}/dimension-detail`
    const response = await this.request.get(url)
    const dimensions = response.data.map(
      function(item: any) {
        const dimension_meta_data = item.dimension_meta_data
        for (let idx = 0; idx < dimension_meta_data.length; idx++) {
          dimension_meta_data[idx].config.with_checkbox = !!dimension_meta_data[idx].config.with_checkbox
          dimension_meta_data[idx].config.is_multiple_answers = !!dimension_meta_data[idx].config.is_multiple_answers
        }
        return new DimensionItem(item.id, item.name, item.type, dimension_meta_data)
      }
    )
    return new DimensionItemList(dimensions)
  }


  async getDimensionMetaData(dimensionId: number): Promise<string> {
    const url = `/projects/dimensions/${dimensionId}/metadata`
    const response = await this.request.get(url)
    const dimension_meta_data = response.data
    for (let idx = 0; idx < dimension_meta_data.length; idx++) {
      dimension_meta_data[idx].config.with_checkbox = !!dimension_meta_data[idx].config.with_checkbox
      dimension_meta_data[idx].config.is_multiple_answers = !!dimension_meta_data[idx].config.is_multiple_answers
    }
    return dimension_meta_data
  }

  async create(projectId: string, name: string, type: string, dimension_meta_data: string): Promise<DimensionItem> {
    const url = `/projects/${projectId}/dimensions`
    const response = await this.request.post(url, { name, type, dimension_meta_data })
    return new DimensionItem(response.data.id, response.data.name, response.data.type, response.data.metadata)
  }

  async assignDimensions(projectId: string, dimension: number[]) : Promise<void> {
    const url = `projects/${projectId}/assign_dimensions`
    await this.request.post(url, { dimension })
  }
}
