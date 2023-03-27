import { DimensionItem, DimensionItemList } from '~/domain/models/dimension/dimension'

export interface DimensionRepository {
    list(projectId: string): Promise<DimensionItemList>
    listAllDimensions(): Promise<DimensionItemList>
    getDimensionMetaData(dimensionId: number): Promise<string>
    assignDimensions(projectId: string, dimensionIds: number[]): Promise<void>
    create(projectId: string, name: string, type: string, dimension_meta_data: string): Promise<DimensionItem>
}
