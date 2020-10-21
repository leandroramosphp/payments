export abstract class TransactionInteface {
    abstract createTransaction: (input: ITransactionDTOInput) => Promise<{ message: string, erros: any[] }>;
    abstract updateTransaction: (input: ITransactionDTOInput) => Promise<{ message: string, erros: any[] }>;
}

export interface ITransactionDTOInput {  
    clientId:string
    valueCard: string
    valueMoneri?: string
    mallId:string
    amount: string
    portion: string
    description: string
}
