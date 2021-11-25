export interface CreateStore {
    storeId: number;
    mallId: number;
}

export interface GetStoreBalance {
    storeId: number;
    mallId: number;
    cod_external: string;
    cod_marketplace: string;
}