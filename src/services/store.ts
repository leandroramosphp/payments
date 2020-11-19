import { Service, Inject } from 'typedi';
import * as Interfaces from '../interfaces/IStore';
import axios from 'axios';
import config from '../config';
import storeModel from '../business/store';

@Service()
export default class storeService {
    private _storeController: storeModel;
    constructor(
        @Inject('logger') private logger: any
    ) {
        this._storeController = new storeModel();
    }

    public createStore = async (input: Interfaces.CreateStore): Promise<void> => {
        try {
            this.logger.silly('Calling createStore');

            const storeData = (await this._storeController.getStore({ storeId: input.storeId, mallId: input.mallId }))[0];

            if (!storeData) {
                return Promise.reject({ message: "Loja não cadastrada.", status: 400 });
            }

            if (storeData.id_payment) {
                return Promise.reject({ message: "Loja já foi cadastrada.", status: 400 });
            }

            const dupStore = (await this._storeController.checkDupStore(storeData.cnpj))[0];

            if (dupStore) {
                if (dupStore.mall_id == input.mallId) {
                    await this._storeController.registerStore(dupStore.id_payment, input.storeId);
                } else {
                    return Promise.reject({ message: "cnpj já cadastrado em outro empreendimento.", status: 400 });
                }
            } else {
                const store: { id: string } = (await axios.post(
                    config.PaymentsApi.host + config.PaymentsApi.endpoints.createStore,
                    {
                        ein: storeData.cnpj
                    },
                    {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        auth: {
                            username: config.PaymentsApi.username,
                            password: config.PaymentsApi.password
                        },
                    }
                )).data;

                await this._storeController.registerStore(store.id, input.storeId);
            }

            return Promise.resolve();
        }
        catch (e) {
            if (e?.response?.data?.error?.category === 'duplicate_taxpayer_id') {
                return Promise.reject({ message: "cnpj já cadastrado na api externa.", status: 400 });
            }
            return Promise.reject(e);
        }
    }

    public getStoreBalance = async (input: Interfaces.GetStoreBalance): Promise<{ balance: number }> => {
        try {
            this.logger.silly('Calling getStoreBalance');

            const storeData = (await this._storeController.getStore({storeId: input.storeId, mallId: input.mallId}))[0];

            if (!storeData?.id_payment) {
                return Promise.reject({ message: "Loja não cadastrada.", status: 400 });
            }

            const accountBalance: { items: { current_balance: number, current_blocked_balance: number, account_balance: number } } = (await axios.get(
                config.PaymentsApi.host + config.PaymentsApi.endpoints.getAccountBalance
                    .replace('{seller_id}', storeData.id_payment),
                {
                    auth: {
                        username: config.PaymentsApi.username,
                        password: config.PaymentsApi.password
                    }
                }
            )).data;

            /* TODO:
                Adicionar lógica para consultar saldo do lojista na Moneri
                Somar saldo lojista Zoop + Moneri */

            return Promise.resolve({ balance: accountBalance.items.current_balance });
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}