import * as Interfaces from '../interfaces/IBankAccount';
import { bankAccountRepository } from "../repo/bankAccountRepository";

export default class bankAccount {
    private _bankAccountRepository: bankAccountRepository

    constructor() {
        this._bankAccountRepository = new bankAccountRepository();
    }

    async registerBankAccount(bankAccountData: Interfaces.BankAccountDataInput, idPayment: string): Promise<void> {
        try {
            return Promise.resolve(await this._bankAccountRepository.registerBankAccount(bankAccountData, idPayment));
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
            const bankAccount = await this._bankAccountRepository.getBankAccount(id, storeId, mallId);
            if (!bankAccount) {
                return Promise.reject({ message: "Loja não cadastrada.", status: 400 });
            } else if (!bankAccount.bank_account_id) {
                return Promise.reject({ message: "Conta bancária não cadastrada.", status: 400 });
            } else if (bankAccount.enabled === false) {
                return Promise.reject({ message: "Conta bancária desabilitada.", status: 400 });
            }
            return Promise.resolve(bankAccount);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getBankAccounts(storeId: number, mallId: number): Promise<Array<Interfaces.BankAccountDataOutput>> {
        try {
            const bankAccounts = await this._bankAccountRepository.getBankAccounts(storeId, mallId);
            if (!bankAccounts) {
                return Promise.reject({ message: "Loja não cadastrada.", status: 400 });
            }
            return Promise.resolve(bankAccounts);
        } catch (e) {
            return Promise.reject(e);
        }
    }
}