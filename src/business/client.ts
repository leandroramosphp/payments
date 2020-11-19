import * as Interfaces from '../interfaces/IClient';
import { clientRepository } from "../repo/clientRepository";

export default class client {
    private _clientRepository: clientRepository

    constructor() {
        this._clientRepository = new clientRepository();
    }

    async getClient(input: Interfaces.CreateClient): Promise<Array<{ cpf: string, id_payment: string }>> {
        try {
            return await this._clientRepository.getClient(input);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async registerClient(idPayment: string, input: Interfaces.CreateClient): Promise<void> {
        try {
            return await this._clientRepository.registerClient(idPayment, input);
        } catch (e) {
            if (e?.message === "Cliente já foi cadastrado.") {
                return Promise.reject({ message: e.message, status: 400 });
            }
            return Promise.reject(e);
        }
    }
}