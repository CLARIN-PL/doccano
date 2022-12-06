import { plainToInstance } from 'class-transformer'
import { ExampleDTO, ExampleListDTO, ExampleStateListDTO } from './exampleData'
import { ExampleRepository, SearchOption } from '~/domain/models/example/exampleRepository'
import { ExampleItem } from '~/domain/models/example/example'

export class ExampleApplicationService {
  constructor(private readonly repository: ExampleRepository) {}

  public async list(projectId: string, options: SearchOption): Promise<ExampleListDTO> {
    try {
      const item = await this.repository.list(projectId, options)
      return new ExampleListDTO(item)
    } catch (e: any) {
      throw new Error(e.response.data.detail)
    }
  }

  public async fetchOne(
    projectId: string,
    page: string,
    q: string,
    isChecked: string
  ): Promise<ExampleListDTO> {
    const offset = (parseInt(page, 10) - 1).toString()
    const options: SearchOption = {
      limit: '1',
      offset,
      q,
      isChecked
    }
    return await this.list(projectId, options)
  }

  public async fetchByLimit(
    projectId: string,
    count: string,
    q: string,
    isChecked: string
  ): Promise<ExampleListDTO> {
    const options: SearchOption = {
      limit: count,
      offset: '0',
      q,
      isChecked
    }
    return await this.list(projectId, options)
  }

  public async fetchArticleIds(projectId: string, count: string): Promise<Array<string>> {
    try {
      const item = await this.repository.articleIds(projectId, count)
      return item
    } catch (e: any) {
      throw new Error(e.response.data.detail)
    }
  }

  public async create(projectId: string, item: ExampleDTO): Promise<ExampleDTO> {
    try {
      const doc = this.toModel(item)
      const response = await this.repository.create(projectId, doc)
      return new ExampleDTO(response)
    } catch (e: any) {
      throw new Error(e.response.data.detail)
    }
  }

  public async update(projectId: string, item: ExampleDTO): Promise<void> {
    try {
      const doc = this.toModel(item)
      await this.repository.update(projectId, doc)
    } catch (e: any) {
      throw new Error(e.response.data.detail)
    }
  }

  public bulkDelete(projectId: string, items: ExampleDTO[]): Promise<void> {
    const ids = items.map((item) => item.id)
    return this.repository.bulkDelete(projectId, ids)
  }

  public async findById(projectId: string, exampleId: number): Promise<ExampleDTO> {
    const response = await this.repository.findById(projectId, exampleId)
    return new ExampleDTO(response)
  }

  public async confirm(projectId: string, exampleId: number): Promise<void> {
    await this.repository.confirm(projectId, exampleId)
  }

  public async annotateStartStates(projectId: string, exampleId: number): Promise<void> {
    await this.repository.annotateStartStates(projectId, exampleId)
  }

  public async listStates(projectId: string, exampleId: number): Promise<ExampleStateListDTO> {
    try {
      const item = await this.repository.listStates(projectId, exampleId)
      return new ExampleStateListDTO(item)
    } catch (e: any) {
      throw new Error(e.response.data.detail)
    }
  }

  private toModel(item: ExampleDTO): ExampleItem {
    // Todo: annotationApprover, commentCount, fileUrl and isConfirmed
    // is not copied correctly.
    return plainToInstance(ExampleItem, item)
  }
}
