export interface CreateTransaction {
    storeId: number;
    mallId: number;
    clientId: number;
    value: number;
    installments: number;
    creditCardId: number;
}

export interface AcceptTransaction {
    storeId: number;
    mallId: number;
    id: number;
    invoiceNumber: string;
}

export interface RejectTransaction {
    storeId: number;
    mallId: number;
    id: number;
}

export interface GetAllTransactionsInput {
    storeId: number;
    mallId: number;
    origin: string;
    status: string;
    endDate: string;
    startDate: string;
    search: string;
    limit: number;
    page: number;
    column: number;
    order: string;
}

export interface GetAllTransactionsOutput {
    id: number;
    createdAt: string;
    clientName: string;
    installments: number;
    value: number;
    status: string;
}