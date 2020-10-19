export abstract class TransactionInteface {
    abstract createTransaction: (input: ITransactionDTOInput) => Promise<{ message: string, erros: any[] }>;
    abstract updateTransaction: (input: ITransactionDTOInput) => Promise<{ message: string, erros: any[] }>;
}

export interface ITransactionDTOInput {  
    transaction_id:string 
    clientId:string
    cardId:string
    cpf:string
    id:string
    amount:number
    mallId:string
    transactionBrand:string
    first4Digits:string
    last4Digits:string
    expirationMonth:string
    expirationYear:string
    holderName:string  
}
