import { ExampleDTO, ExampleArticleDTO } from '~/services/application/example/exampleData'

export class DatatableSelectArticleEventData {
    item: ExampleArticleDTO 
    items: ExampleArticleDTO[]
    value: boolean
}

export class DatatableSelectChildArticleEventData {
    item: ExampleDTO 
    items: ExampleDTO[]
    value: boolean
}
