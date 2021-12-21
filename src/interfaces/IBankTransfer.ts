export interface CreateBankTransfer {
    storeId: number;
    bankAccountId: number;
    value: number;
    cod_marketplace: string;
    id_paymentsystem: number;
}

export interface GetBankTransfers {
    storeId: number;
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