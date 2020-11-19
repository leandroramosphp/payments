export interface CreateBankTransfer {
    mallId: number;
    storeId: number;
    bankAccountId: number;
    value: number;
}

export interface GetBankTransfers {
    storeId: number;
    mallId: number;
}