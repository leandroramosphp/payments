export interface CreateCreditCard {
    clientId: number;
    cod_external: string;
    id_paymentsystem: number;
    cod_marketplace: string;
    encryptedCreditCard: string;
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

export interface ICard {
    holder_name: any;
    expiration_month: any;
    expiration_year: any;
    card_number: any;
    security_code: any;
}

export interface IRequestGenerateToken {
    cod_marketplace: any;
    encryptedCard: any;
}

export interface IResponseGenerateToken {
    id: string;
}