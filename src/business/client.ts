
import { clientRepository } from "../repo/clientRepository";

export default class client implements client {
    private _clientRepository: clientRepository

    constructor() {
        this._clientRepository = new clientRepository();
    }

    async createClient(output): Promise<any> {
        return await this._clientRepository.createClient(output);
    }
}

