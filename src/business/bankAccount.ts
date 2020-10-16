import { IBankAccountDTOInput } from '../interfaces/IBankAccount';
import { bankAccountRepository } from "../repo/bankAccountRepository";

export default class bankAccount implements bankAccount {
    private _bankAccountRepository: bankAccountRepository

    constructor() {
        this._bankAccountRepository = new bankAccountRepository();
    }

    async registerBankAccount(output, input: IBankAccountDTOInput): Promise<any> {
        return await this._bankAccountRepository.registerBankAccount(output, input);
    }

    
    async updateBankAccountAssociation(output,  input: IBankAccountDTOInput): Promise<any> {
        return await this._bankAccountRepository.updateBankAccountAssociation(output, input);
    }

    async getBankAccountId(clientId): Promise<any> {
        return await this._bankAccountRepository.getBankAccountId(clientId);
    }

    async getAll(input: IBankAccountDTOInput): Promise<any> {
        return await this._bankAccountRepository.getAll(input);
    }
}

