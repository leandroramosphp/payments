import { IStoreDTOInput } from '../interfaces/IStore';
import { storeRepository } from "../repo/storeRepository";

export default class client implements client {
    private _storeRepository: storeRepository

    constructor() {
        this._storeRepository = new storeRepository();
    }

    async registerStore(output, input: IStoreDTOInput): Promise<any> {
        return await this._storeRepository.registerStore(output, input);
    }
}

