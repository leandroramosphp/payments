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
            return Promise.resolve(await this._creditCardRepository.getCreditCard(id, clientId, mallId));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getCreditCards(clientId: number, mallId: number): Promise<Array<Interfaces.CreditCardDataOutput>> {
        try {
            return Promise.resolve(await Promise.resolve(await this._creditCardRepository.getCreditCards(clientId, mallId)));
        } catch (e) {
            return Promise.reject(e);
        }
    }
}