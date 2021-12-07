export interface CreatePayment {
    storeId: number;
    mallId: number;
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
    mallId: number;
    id: number;
    invoiceNumber: string;
    id_paymentsystem: number;
}

export interface RejectPayment {
    storeId: number;
    mallId: number;
    id: number;
    id_paymentsystem: number;
    cod_external: string;
    cod_marketplace: string;
}

export interface GetAllPaymentsInput {
    clientId: number;
    storeId: number;
    mallId: number;
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

export interface GetAllPaymentItemsInput {
    clientId: number;
    storeId: number;
    mallId: number;
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