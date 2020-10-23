export abstract class CardInteface {
    abstract createCard: (input: ICardDTOInput) => Promise<{ message: string, erros: any[] }>;
    abstract updateCard: (input: ICardDTOInput) => Promise<{ message: string, erros: any[] }>;
}

export interface ICardDTOInput {  
    cardCustomer:string
    customer:string
    clientId:string
    mallId:string
    cpf: string
}
