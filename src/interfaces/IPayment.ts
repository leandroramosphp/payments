export interface CreatePayment {
    storeId: number;
    mallId: number;
    clientId: number;
    value: number;
    installments: number;
    creditCardId: number;
    id_payment: string;
    storeName: string;
    clientPaymentId: number;
}

export interface AcceptPayment {
    storeId: number;
    mallId: number;
    id: number;
    invoiceNumber: string;
}

export interface RejectPayment {
    storeId: number;
    mallId: number;
    id: number;
    id_payment: string;
}

export interface GetAllPaymentsInput {
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

export interface GetAllPaymentsOutput {
    id: number;
    createdAt: string;
    clientName: string;
    installments: number;
    value: number;
    status: string;
}