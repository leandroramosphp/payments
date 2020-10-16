export abstract class bankAccountInteface {
    abstract createBankAccount: (input: IBankAccountDTOInput) => Promise<{ message: string, erros: any[] }>;
    abstract updateBankAccount: (input: IBankAccountDTOInput) => Promise<{ message: string, erros: any[] }>;
}

export interface IBankAccountDTOInput {  
    bankAccount_id:string 
    storePaymentId: string
    account_number:string
    clientId:string
    cpf:string
    mallId:string
    holderName:string
    bankCode:string
    routingNumber:string
    accountNumber:string
    ein:string  
    type:string  
}
