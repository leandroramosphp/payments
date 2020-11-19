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

    async getBankTransfers(storeId: number, mallId: number): Promise<Array<{ bank_name: string, account_number: string, created_at: string, value: number }>> {
        try {
            var bankTransfers = await this._bankTransferRepository.getBankTransfers(storeId, mallId);
            if (!bankTransfers.length) {
                return Promise.reject({ message: "Loja não cadastrada.", status: 400 });
            }
            return Promise.resolve(bankTransfers.filter(bt => { return bt.value != null }));
        } catch (e) {
            return Promise.reject(e);
        }
    }
}