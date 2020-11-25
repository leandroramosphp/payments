import { storeRepository } from "../repo/storeRepository";

export default class store {
    private _storeRepository: storeRepository

    constructor() {
        this._storeRepository = new storeRepository();
    }

    async getStore(input: { storeId: number, mallId: number }): Promise<{ cnpj: string, id_payment: string, name: string, storePaymentId: number }> {
        try {
            return await this._storeRepository.getStore(input);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async checkDupStore(cnpj: string): Promise<{ id_payment: string, mall_id: number }> {
        try {
            return await this._storeRepository.checkDupStore(cnpj);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async registerStore(idPayment: string, storeId: number): Promise<void> {
        try {
            return await this._storeRepository.registerStore(idPayment, storeId);
        } catch (e) {
            if (e?.message === "Loja já foi cadastrada.") {
                return Promise.reject({ message: e.message, status: 400 });
            }
            return Promise.reject(e);
        }
    }
}