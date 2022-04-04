export interface CreatePayment {
    storeId: number;
    mallId?: number;
    clientId: number;
    value: number;
    installments: number;
    creditCardId: number;
    storeName: string;
    id_paymentsystem: number;
    cod_external: string;
    cod_marketplace: string;
}

export interface AcceptPayment {
    storeId: number;
    id: number;
    invoiceNumber: string;
    id_paymentsystem: number;
}

export interface RejectPayment {
    storeId: number;
    id: number;
    id_paymentsystem: number;
    cod_external: string;
    cod_marketplace: string;
}

export interface GetAllPaymentsInput {
    mallId?: number;
    clientId: number;
    storeId: number;
    status: string;
    endDateTime: string;
    startDateTime: string;
    search: string;
    limit: number;
    limitByPage: number;
    page: number;
    sortBy: number;
    order: string;
    id_paymentsystem: number;
}

export interface GetPaymentInput {
    mallId?: number;
    cod_payment: string;
}

export interface GetAllPaymentItemsInput {
    clientId: number;
    storeId: number;
    origin: string;
    status: string;
    endDateTime: string;
    startDateTime: string;
    search: string;
    limit: number;
    limitByPage: number;
    page: number;
    sortBy: number;
    order: string;
    id_paymentsystem: number;
}

export interface GetAllPaymentsOutput {
    id: number;
    createdAt: string;
    clientName: string;
    storeName: string;
    installments: number;
    value: number;
    status: string;
    invoiceNumber: string;
    codPayment: string;
}

export interface GetAllPaymentsItemsOutput {
    id: number;
    createdAt: string;
    clientName: string;
    storeName: string;
    installments: number;
    value: number;
    status: string;
}