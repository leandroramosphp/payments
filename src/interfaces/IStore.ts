export interface CreateStore {
    storeId: number;
}
export interface CreateQRCode {
    storeId: number;
}
export interface GetStoreBalance {
    storeId: number;
    cod_external: string;
    cod_marketplace: string;
}
