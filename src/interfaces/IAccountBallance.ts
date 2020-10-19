export abstract class AccountBallanceInteface {
    abstract createAccountBallance: (input: IAccountBallanceDTOInput) => Promise<{ message: string, erros: any[] }>;
    abstract getAccountBallance: (input: IAccountBallanceDTOInput) => Promise<{ message: string, erros: any[] }>;
}

export interface IAccountBallanceDTOInput {      
    bankName:number
    clientId:string
    agency:number
    account:number
    socialReason:string
    cnpj:string
    mallId: string
}
