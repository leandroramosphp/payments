import { bankTransferRepository } from "../repo/bankTransferRepository";

export default class bankTransfer {
    private _bankTransferRepository: bankTransferRepository

    constructor() {
        this._bankTransferRepository = new bankTransferRepository();
    }

    async createBankTransfer(bankAccountId: number, transfers: Array<{ origin: string, value: number, externalId: string }>): Promise<void> {
        try {
            return Promise.resolve(await this._bankTransferRepository.createBankTransfer(bankAccountId, transfers));
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getBankTransfers(storeId: number, mallId: number): Promise<Array<{ id: number, bankName: string, accountNumber: string, createdAt: string, value: number }>> {
        try {
            return Promise.resolve(await this._bankTransferRepository.getBankTransfers(storeId, mallId));
        } catch (e) {
            return Promise.reject(e);
        }
    }
}