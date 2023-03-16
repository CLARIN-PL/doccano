import { DimensionItem, DimensionItemList } from '~/domain/models/dimension/dimension'

export interface DimensionRepository {
    listAll(): Promise<DimensionItemList>
    list(projectId: string): Promise<DimensionItemList>
    create(projectId: string, name: string, type: string, dimension_meta_data: string): Promise<DimensionItem>
    assign(projectId: string, dimension: number[]): Promise<void>
}
