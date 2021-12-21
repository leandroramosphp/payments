export interface GetBankAccounts {
    storeId: number;
    id_paymentsystem: number;
}

export interface DisableBankAccount {
    id: number;
    storeId: number;
    cod_external: string;
    cod_marketplace: string;
    id_paymentsystem: number;
}

export interface CreateBankAccount {
    storeId: number;
    bankAccountToken: string;
    cod_external: string;
    cod_marketplace: string;
    id_paymentsystem: number;
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