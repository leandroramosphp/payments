export interface CreateCreditCard {
    mallId: number;
    clientId: number;
    creditCardToken: string;
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
    id: string;
    cardBrand: string;
    first4Digits: string;
    last4Digits: string;
    expirationMonth: string;
    expirationYear: string;
    holderName: string;
}

export interface DisableCreditCard {
    mallId: number;
    clientId: number;
    id: number;
}

export interface GetCreditCards {
    mallId: number;
    clientId: number;
}