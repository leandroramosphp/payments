export abstract class StoreInteface {
    abstract createStore: (input: IStoreDTOInput) => Promise<{ message: string, erros: any[] }>;
}

export interface IStoreDTOInput {   
    id: string
    storeId: string
    mallId: string
    clientId: string
}
