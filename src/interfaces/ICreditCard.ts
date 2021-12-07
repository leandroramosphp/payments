export interface CreateCreditCard {
    clientId: number;
    creditCardToken: string;
    cod_external: string;
    id_paymentsystem: number;
    cod_marketplace: string;
}

export interface CreditCardDataInput {
    id: string;
    card_brand: string;
    first4_digits: string;
    last4_digits: string;
    expiration_month: string;
    expiration_year: string;
    holder_name: string;
}

export interface CreditCardDataOutput {
    id: number;
    cardBrand: string;
    first4Digits: string;
    last4Digits: string;
    expirationMonth: string;
    expirationYear: string;
    holderName: string;
}

export interface DisableCreditCard {
    clientId: number;
    id: number;
    id_paymentsystem: number;
    cod_marketplace: string;
}

export interface GetCreditCards {
    clientId: number;
    id_paymentsystem: number;
}