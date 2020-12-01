import * as Interfaces from '../interfaces/IBankAccount';
import { bankAccountRepository } from "../repo/bankAccountRepository";

export default class bankAccount {
    private _bankAccountRepository: bankAccountRepository

    constructor() {
        this._bankAccountRepository = new bankAccountRepository();
    }

    async createBankAccount(bankAccountData: Interfaces.BankAccountDataInput, idPayment: string): Promise<void> {
        try {
            return Promise.resolve(await this._bankAccountRepository.createBankAccount(bankAccountData, idPayment));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async disableBankAccount(id: number): Promise<void> {
        try {
            return Promise.resolve(await this._bankAccountRepository.disableBankAccount(id));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getBankAccount(id: number, storeId: number, mallId: number): Promise<{ bank_account_id: string, enabled: boolean }> {
        try {
            return Promise.resolve(await this._bankAccountRepository.getBankAccount(id, storeId, mallId));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getBankAccounts(storeId: number, mallId: number): Promise<Array<Interfaces.BankAccountDataOutput>> {
        try {
            return Promise.resolve(await this._bankAccountRepository.getBankAccounts(storeId, mallId));
        } catch (e) {
            return Promise.reject(e);
        }
    }
}