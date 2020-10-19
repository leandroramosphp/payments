export abstract class CardInteface {
    abstract createCard: (input: ICardDTOInput) => Promise<{ message: string, erros: any[] }>;
    abstract updateCard: (input: ICardDTOInput) => Promise<{ message: string, erros: any[] }>;
}

export interface ICardDTOInput {  
    clientId:string
    mallId:string
    cpf: string
}
