import { IClientDTOInput } from '../interfaces/IClient';
import { clientRepository } from "../repo/clientRepository";

export default class client implements client {
    private _clientRepository: clientRepository

    constructor() {
        this._clientRepository = new clientRepository();
    }

    async getClient(input: IClientDTOInput): Promise<any> {
        return await this._clientRepository.getClient(input);
    }

    async registerClient(output, input: IClientDTOInput): Promise<any> {
        return await this._clientRepository.registerClient(output, input);
    }
}