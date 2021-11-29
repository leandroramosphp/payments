export interface CreateBankTransfer {
    mallId: number;
    storeId: number;
    bankAccountId: number;
    value: number;
    cod_marketplace: string;
    id_paymentsystem: number;
}

export interface GetBankTransfers {
    storeId: number;
    mallId: number;
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