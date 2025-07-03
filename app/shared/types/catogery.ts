type CATOGERY_LIST_PAYLOAD = {
    page:number
}
type CATOGERY_PAYLOAD = FormData

type CATOGERY_MUTATION = {
    data:FormData,
    id:string
}

export type {
    CATOGERY_LIST_PAYLOAD,
    CATOGERY_PAYLOAD,
    CATOGERY_MUTATION
}
