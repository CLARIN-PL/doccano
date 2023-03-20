import { DimensionItem, DimensionItemList } from '~/domain/models/dimension/dimension'

export interface DimensionRepository {
    listAllDimensions(): Promise<DimensionItemList>
    list(projectId: string): Promise<DimensionItemList>
    create(projectId: string, name: string, type: string, dimension_meta_data: string): Promise<DimensionItem>
    assignDimensions(projectId: string, dimension: number[]): Promise<void>
    getDimensionMetaData(dimensionId: number): Promise<string>
}
