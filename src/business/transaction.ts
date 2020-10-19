import { ITransactionDTOInput } from '../interfaces/ITransaction';
import { transactionRepository } from "../repo/transactionRepository";

export default class transaction implements transaction {
    private _transactionRepository: transactionRepository

    constructor() {
        this._transactionRepository = new transactionRepository();
    }

    async registerTransaction(output, input: ITransactionDTOInput): Promise<any> {
        return await this._transactionRepository.registerTransaction(output, input);
    }

    async updateTransactionApprove(input: ITransactionDTOInput): Promise<any> {
        return await this._transactionRepository.updateTransactionApprove(input);
    }
    
    async updateTransactionReverse(output,  input: ITransactionDTOInput): Promise<any> {
        return await this._transactionRepository.updateTransactionReverse(output, input);
    }

    async getTransactionId(clientId): Promise<any> {
        return await this._transactionRepository.getTransactionId(clientId);
    }    
}

