import * as Interfaces from '../interfaces/IStore';
import { storeRepository } from "../repo/storeRepository";

export default class store {
    private _storeRepository: storeRepository

    constructor() {
        this._storeRepository = new storeRepository();
    }

    async getStore(input: { storeId: number, mallId: number }): Promise<Array<{ cnpj: string, id_payment: string }>> {
        return await this._storeRepository.getStore(input);
    }

    async checkDupStore(cnpj: string): Promise<Array<{ id_payment: string, mall_id: number }>> {
        return await this._storeRepository.checkDupStore(cnpj);
    }

    async registerStore(idPayment: string, input: Interfaces.CreateStore): Promise<void> {
        return await this._storeRepository.registerStore(idPayment, input);
    }
}