export abstract class ClientInteface {
    abstract createClient: (input: IClientDTOInput) => Promise<{ message: string, erros: any[] }>;
}

export interface IClientDTOInput {   
    id: string
    clientId: string
    mallId: string
}
