export interface CreateTransaction {
    storeId: number;
    mallId: number;
    clientId: number;
    value: number;
    installments: number;
    creditCardId: number;
}

export interface AcceptTransaction {
}

export interface RejectTransaction {
}

export interface GetAllTransactions {
}