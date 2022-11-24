
export class qType {
    id: String
    name: String
    count: Number
}

export class qCategory {
    id: String
    name: String
    key: String
    types: qType[]
}