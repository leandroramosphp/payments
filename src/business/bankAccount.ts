import * as Interfaces from '../interfaces/IBankAccount';
import { bankAccountRepository } from "../repo/bankAccountRepository";

export default class bankAccount {
    private _bankAccountRepository: bankAccountRepository

    constructor() {
        this._bankAccountRepository = new bankAccountRepository();
    }

    async registerBankAccount(bankAccountData: Interfaces.BankAccountDataInput, idPayment: string): Promise<void> {
        return await this._bankAccountRepository.registerBankAccount(bankAccountData, idPayment);
    }

    async disableBankAccount(id: number): Promise<void> {
        return await this._bankAccountRepository.disableBankAccount(id);
    }

    async getBankAccountId(input: { id: number, storeId: number, mallId: number }): Promise<{ bank_account_id: string }> {
        return await this._bankAccountRepository.getBankAccountId(input);
    }

    async getAllBankAccounts(input: Interfaces.GetAllBankAccounts): Promise<Array<Interfaces.BankAccountDataOutput>> {
        return await this._bankAccountRepository.getAllBankAccounts(input);
    }
}
