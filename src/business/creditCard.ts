import * as Interfaces from '../interfaces/ICreditCard';
import { creditCardRepository } from "../repo/creditCardRepository";

export default class creditCard {
    private _creditCardRepository: creditCardRepository

    constructor() {
        this._creditCardRepository = new creditCardRepository();
    }

    async createCreditCard(creditCardData: Interfaces.CreditCardDataInput, clientPaymentId: number): Promise<void> {
        try {
            return Promise.resolve(await this._creditCardRepository.createCreditCard(creditCardData, clientPaymentId));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async disableCreditCard(id: number): Promise<void> {
        try {
            return Promise.resolve(await this._creditCardRepository.disableCreditCard(id));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getCreditCard(id: number, clientId: number, mallId: number): Promise<{ id_payment: string, enabled: boolean }> {
        try {
            const creditCard = await this._creditCardRepository.getCreditCard(id, clientId, mallId);
            if (!creditCard) {
                return Promise.reject({ message: "Cliente não cadastrado.", status: 400 });
            } else if (!creditCard.id_payment) {
                return Promise.reject({ message: "Cartão de crédito não cadastrado.", status: 400 });
            } else if (creditCard.enabled === false) {
                return Promise.reject({ message: "Cartão de crédito desabilitado.", status: 400 });
            }
            return Promise.resolve(creditCard);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getCreditCards(clientId: number, mallId: number): Promise<Array<Interfaces.CreditCardDataOutput>> {
        try {
            const creditCards = await Promise.resolve(await this._creditCardRepository.getCreditCards(clientId, mallId));
            if (!creditCards.length) {
                return Promise.reject({ message: "Cliente não cadastrado.", status: 400 });
            }
            return Promise.resolve(creditCards.filter(cc => { return cc.id != null }));
        } catch (e) {
            return Promise.reject(e);
        }
    }
}