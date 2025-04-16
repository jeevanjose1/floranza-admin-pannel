type COMMON_LIST_PAYLOAD = {
    page:number
}
type COMMON_PAYLOAD = FormData

type COMMON_MUTATION = {
    data?:FormData,
    id:string
}

type SUCCESS  ={
    data:any,
    message:string,
    success:boolean
}

type ERROR  ={
    data:any,
    message:string,
    success:boolean
}

export type {
    COMMON_LIST_PAYLOAD,
    COMMON_PAYLOAD,
    COMMON_MUTATION
}
