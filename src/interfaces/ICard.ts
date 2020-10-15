export abstract class CardInteface {
    abstract createCard: (input: ICardDTOInput) => Promise<{ message: string, erros: any[] }>;
    abstract deleteCard: (input: ICardDTOInput) => Promise<{ message: string, erros: any[] }>;
}

export interface ICardDTOInput {  
    card_id:string 
    clientId:string
    cpf:string
    mallId:string
    cardBrand:string
    first4Digits:string
    last4Digits:string
    expirationMonth:string
    expirationYear:string
    holderName:string
    isActive: string
    isValid: string
    isVerified: string
}
