import * as Interfaces from '../interfaces/ITransaction';
import { transactionRepository } from "../repo/transactionRepository";

export default class transaction {
    private _transactionRepository: transactionRepository

    constructor() {
        this._transactionRepository = new transactionRepository();
    }

    async createTransaction(clientPaymentId: number, storePaymentId: string, installments: number, transactions: Array<{ origin: string, value: number, externalId: string }>): Promise<void> {
        try {
            return Promise.resolve(await this._transactionRepository.createTransaction(clientPaymentId, storePaymentId, installments, transactions));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async acceptTransaction(id: number, invoiceNumber: string): Promise<number> {
        try {
            return Promise.resolve(await this._transactionRepository.acceptTransaction(id, invoiceNumber));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async rejectTransaction(id: number): Promise<number> {
        try {
            return Promise.resolve(await this._transactionRepository.rejectTransaction(id));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getPendingTransaction(id: number): Promise<Array<{ externalId: string, origin: string, value: number }>> {
        try {
            return Promise.resolve(await this._transactionRepository.getPendingTransaction(id));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getAllTransactions(input: Interfaces.GetAllTransactionsInput): Promise<{ data: Array<Interfaces.GetAllTransactionsOutput>, total: number }> {
        try {
            return Promise.resolve(await this._transactionRepository.getAllTransactions(input));
        } catch (e) {
            return Promise.reject(e);
        }
    }
}