import { ExampleDTO, ExampleArticleDTO, ExampleChildArticleDTO } from '~/services/application/example/exampleData'

export class DatatableSelectArticleEventData {
    item: ExampleArticleDTO 
    items: ExampleArticleDTO[]
    value: boolean
}

export class DatatableSelectChildArticleEventData {
    item: ExampleChildArticleDTO 
    items: ExampleChildArticleDTO[]
    value: boolean
}
