export abstract class ClientInteface {
    abstract createClient: (input: IClientDTOInput) => Promise<{ message: string, erros: any[] }>;
}

export interface IClientDTOInput {
    clientId: string
    mallId: string
}