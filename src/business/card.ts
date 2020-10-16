import { ICardDTOInput } from '../interfaces/ICard';
import { cardRepository } from "../repo/cardRepository";

export default class card implements card {
    private _cardRepository: cardRepository

    constructor() {
        this._cardRepository = new cardRepository();
    }

    async registerCard(output, input: ICardDTOInput): Promise<any> {
        return await this._cardRepository.registerCard(output, input);
    }

    
    async updateCardAssociation(output,  input: ICardDTOInput): Promise<any> {
        return await this._cardRepository.updateCardAssociation(output, input);
    }

    async getCardId(clientId): Promise<any> {
        return await this._cardRepository.getCardId(clientId);
    }

    async getAll(input: ICardDTOInput): Promise<any> {
        return await this._cardRepository.getAll(input);
    }
}

