import { plainToInstance } from 'class-transformer'
import ApiService from '@/services/api.service'
import { ExampleRepository, SearchOption } from '~/domain/models/example/exampleRepository'
import { ExampleItem, ExampleItemList, ExampleStateItemList } from '~/domain/models/example/example'

export class APIExampleRepository implements ExampleRepository {
  constructor(private readonly request = ApiService) {}

  async list(
    projectId: string,
    { limit = '10', offset = '0', q = '', isChecked = '' }: SearchOption
  ): Promise<ExampleItemList> {
    let result = Promise.resolve({count: 0, next: null, prev: null, items: []})
    if (String(projectId) !== "undefined") {
      const url = `/projects/${projectId}/examples?limit=${limit}&offset=${offset}&q=${q}&confirmed=${isChecked}`
      const response = await this.request.get(url)
      result =  response.data
    }
    return result
  }

  async fetchArticleIds(projectId: string, limit = '999999'): Promise<Array<string>> {
    let results = Promise.resolve([])
    if (String(projectId) !== "undefined") {
      const url = `/projects/${projectId}/article_ids?limit=${limit}&offset=0`
      const response = await this.request.get(url)
      results = response.data.results.map((i: any) => i.article_id)
    }
    return results
  }

  async create(projectId: string, item: ExampleItem): Promise<ExampleItem> {
    const url = `/projects/${projectId}/examples`
    const response = await this.request.post(url, item.toObject())
    return plainToInstance(ExampleItem, response.data)
  }

  async update(projectId: string, item: ExampleItem): Promise<ExampleItem> {
    const url = `/projects/${projectId}/examples/${item.id}`
    const response = await this.request.patch(url, item.toObject())
    return plainToInstance(ExampleItem, response.data)
  }

  async bulkDelete(projectId: string, ids: number[]): Promise<void> {
    const url = `/projects/${projectId}/examples`
    await this.request.delete(url, { ids })
  }

  async deleteAll(projectId: string): Promise<void> {
    const url = `/projects/${projectId}/examples`
    await this.request.delete(url)
  }

  async findById(projectId: string, exampleId: number): Promise<ExampleItem> {
    const url = `/projects/${projectId}/examples/${exampleId}`
    const response = await this.request.get(url)
    return plainToInstance(ExampleItem, response.data)
  }

  async listStates(projectId: string, exampleId: number): Promise<ExampleStateItemList> {
    let result = Promise.resolve({count: 0, next: null, prev: null, items: []})
    if (String(projectId) !== "undefined" && String(exampleId) !== "undefined") {
      const url = `/projects/${projectId}/examples/${exampleId}/states`
      const response = await this.request.get(url)
      result = response.data
    }
    return result
  }

  async confirm(projectId: string, exampleId: number): Promise<void> {
    const url = `/projects/${projectId}/examples/${exampleId}/states`
    await this.request.post(url, {})
  }

  async annotateStartStates(projectId: string, exampleId: number): Promise<void> {
    const url = `/projects/${projectId}/examples/${exampleId}/annotate_start_states`
    await this.request.post(url, {})
  }
}
