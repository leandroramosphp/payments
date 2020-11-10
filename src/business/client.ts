import * as Interfaces from '../interfaces/IClient';
import { clientRepository } from "../repo/clientRepository";

export default class client {
    private _clientRepository: clientRepository

    constructor() {
        this._clientRepository = new clientRepository();
    }

    async getClient(input: Interfaces.CreateClient): Promise<Array<{ cpf: string, id_payment: string }>> {
        return await this._clientRepository.getClient(input);
    }

    async registerClient(idPayment: string, input: Interfaces.CreateClient): Promise<void> {
        return await this._clientRepository.registerClient(idPayment, input);
    }
}