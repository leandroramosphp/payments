import * as Interfaces from '../interfaces/ITransaction';
import { transactionRepository } from "../repo/transactionRepository";

export default class transaction {
    private _transactionRepository: transactionRepository

    constructor() {
        this._transactionRepository = new transactionRepository();
    }

    async createTransaction(clientPaymentId: number, storePaymentId: number, transactions: Array<{ origin: string, value: number, externalId: string }>): Promise<void> {
        try {
            return Promise.resolve(await this._transactionRepository.createTransaction(clientPaymentId, storePaymentId, transactions));
        } catch (e) {
            return Promise.reject(e);
        }
    }
}