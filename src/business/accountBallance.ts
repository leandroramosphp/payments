import { IAccountBallanceDTOInput } from '../interfaces/IaccountBallance';
import { accountBallanceRepository } from "../repo/accountBallanceRepository";

export default class accountBallance implements accountBallance {
    private _accountBallanceRepository: accountBallanceRepository

    constructor() {
        this._accountBallanceRepository = new accountBallanceRepository();
    }

    async registerAccountBallance(input: IAccountBallanceDTOInput): Promise<any> {
        return await this._accountBallanceRepository.registerAccountBallance(input);
    }

    async getAccountBallance(output,  input: IAccountBallanceDTOInput): Promise<any> {
        return await this._accountBallanceRepository.getAccountBallance(output, input);
    }

    async getBankAccountId(clientId): Promise<any> {
        return await this._accountBallanceRepository.getBankAccountId(clientId);
    }    

    async getAll(input: IAccountBallanceDTOInput): Promise<any> {
        return await this._accountBallanceRepository.getAll(input);
    }
}

