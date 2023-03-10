import { DimensionItem, DimensionItemList } from '~/domain/models/dimension/dimension'

export interface DimensionRepository {
    list(projectId: string): Promise<DimensionItemList>
    create(projectId: string, name: string, type: string, dimension_meta_data: string): Promise<DimensionItem>
    delete(projectId: string, dimensionId: number): Promise<void>
}
