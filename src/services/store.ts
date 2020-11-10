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

            const storeData = (await this._storeController.getStore(input))[0];

            if (!storeData) {
                return Promise.reject({ message: "Loja não existente.", status: 400 });
            }

            if (storeData.id_payment) {
                return Promise.reject({ message: "Loja já foi registrada.", status: 400 });
            }

            const dupStore = (await this._storeController.checkDupStore(storeData.cnpj))[0];

            if (dupStore) {
                if (dupStore.mall_id == input.mallId) {
                    await this._storeController.registerStore(dupStore.id_payment, input);
                } else {
                    return Promise.reject({ message: "cnpj já registrado em outro empreendimento.", status: 400 });
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

                await this._storeController.registerStore(store.id, input);
            }

            return Promise.resolve();
        }
        catch (e) {
            if (e?.response?.data?.error?.category === 'duplicate_taxpayer_id') {
                return Promise.reject({ message: "cnpj já registrado na api externa.", status: 400 });
            }
            return Promise.reject(e);
        }
    }

    public getStoreBalance = async (input: Interfaces.GetStoreBalance): Promise<{ balance: number }> => {
        try {
            this.logger.silly('Calling getStoreBalance');

            const storeData = (await this._storeController.getStore(input))[0];

            if (!storeData) {
                return Promise.reject({ message: "Loja não existente.", status: 400 });
            }

            const accountBalance: any = (await axios.get(
                config.PaymentsApi.host + config.PaymentsApi.endpoints.accountBallance
                    .replace('{seller_id}', storeData.id_payment),
                {
                    auth: {
                        username: config.PaymentsApi.username,
                        password: config.PaymentsApi.password
                    }
                }
            )).data;

            console.log(accountBalance);

            return Promise.resolve({ balance: null });
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}