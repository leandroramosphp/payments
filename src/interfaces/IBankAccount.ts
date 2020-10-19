export abstract class bankAccountInteface {
    abstract createBankAccount: (input: IBankAccountDTOInput) => Promise<{ message: string, erros: any[] }>;
    abstract updateBankAccount: (input: IBankAccountDTOInput) => Promise<{ message: string, erros: any[] }>;
}

export interface IBankAccountDTOInput {  
    clientId:string
    storePaymentId: string
    bankAccountId: string           
    bankName: string
    routingNumber: string
    accountNumber:string
    mallId: string
}
