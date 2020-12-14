export interface GetBankAccounts {
    storeId: number;
    mallId: number;
}

export interface DisableBankAccount {
    id: number;
    storeId: number;
    mallId: number;
}

export interface CreateBankAccount {
    storeId: number;
    bankAccountToken: string;
    mallId: number;
    id_payment: string;
}

export interface BankAccountDataInput {
    id: string;
    holder_name: string;
    bank_name: string;
    bank_code: string;
    routing_number: string;
    account_number: string;
    taxpayer_id: string;
    type: string;
}

export interface BankAccountDataOutput {
    id: number;
    holderName: string;
    bankName: string;
    bankCode: string;
    routingNumber: string;
    accountNumber: string;
    cnpj: string;
    type: string;
}