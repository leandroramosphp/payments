import * as Interfaces from '../interfaces/IBankTransfer';
import { bankTransferRepository } from "../repo/bankTransferRepository";

export default class bankTransfer {
    private _bankTransferRepository: bankTransferRepository

    constructor() {
        this._bankTransferRepository = new bankTransferRepository();
    }

    async registerBankTransfer(output, input: Interfaces.CreateBankTransfer): Promise<any> {
        return await this._bankTransferRepository.registerBankTransfer(output, input);
    }
}

