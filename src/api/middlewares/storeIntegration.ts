import { Request, Response, NextFunction } from 'express';
import { storeRepository } from "../../repo/storeRepository";
import axios from 'axios';
import config from '../../config';

let storeIntegration = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const _storeRepository = new storeRepository();
            const storeData = await _storeRepository.getStore({ storeId: +res.locals.data.storeId, mallId: +res.locals.data.mallId });

            if (!storeData) {
                return res.status(400).json({ message: "Loja não cadastrada." });
            }

            if (!storeData.payment_enabled) {
                return res.status(400).json({ message: "Loja não habilitada para participar do módulo de pagamentos." });
            }

            if (storeData.id_payment) {
                /* Loja já cadastrada */
                res.locals.store = storeData;
                return next();
            }

            const dupStore = (await _storeRepository.checkDupStore(storeData.cnpj));

            if (dupStore) {
                if (dupStore.mall_id == +res.locals.data.mallId) {
                    await _storeRepository.registerStore(dupStore.id_payment, +res.locals.data.storeId);
                    res.locals.store = { ...storeData, id_payment: dupStore.id_payment };
                } else {
                    return res.status(400).json({ message: "cnpj já cadastrado em outro empreendimento." });
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

                await _storeRepository.registerStore(store.id, +res.locals.data.storeId);
                res.locals.store = { ...storeData, id_payment: store.id };
            }
            return next();
        }
        catch (e) {
            if (e?.response?.data?.error?.category === 'duplicate_taxpayer_id') {
                return res.status(400).json({ message: "cnpj já cadastrado na api externa." });
            }
            return next(e);
        }
    }
}

export default storeIntegration;