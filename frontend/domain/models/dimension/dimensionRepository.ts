import { DimensionItem, DimensionItemList } from '~/domain/models/project/dimension'

export interface DimensionRepository {
    list(projectId: string): Promise<DimensionItemList>
    create(projectId: string, name: string, type: string, metadata: string): Promise<DimensionItem>
    delete(projectId: string, dimensionId: number): Promise<void>
}
