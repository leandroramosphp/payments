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

export interface IRequestGetStoreSalesPlans {
    storeId: number;
}


interface ICreditCardInfo {
    card_brand: string;
    percent_amount: number;
    payment_type: string;
    number_installments: number;
}
export interface IResponseGetStoreSalesPlans {
    id: number,
    name: string,
    fee_details: Array<ICreditCardInfo>
}