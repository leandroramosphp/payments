import { Request, Response, NextFunction } from 'express';
import prisma from '../../loaders/prisma';
import axios from 'axios';
import logger from '../../loaders/logger';
import config from '../../config';

let storeIntegration = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!res.locals.data.storeId) {
                return next();
            }

            const getStore = await prisma.store.findFirst({
                where: {
                    id: +res.locals.data.storeId,
                },
                select: {
                    mall_id: true
                }
            })

            if (!getStore) {
                return res.status(400).json({ message: 'A loja informada não foi encontrada.' });
            }

            const initialData = await prisma.$transaction([
                prisma.paymentsystem.findFirst({
                    where: {
                        id_mall: getStore.mall_id,
                        flg_active: true
                    },
                    select: {
                        id_paymentsystem: true,
                        cod_marketplace: true
                    }
                }),
                prisma.store.findUnique({
                    where: {
                        store_id_mall_id_key: {
                            id: +res.locals.data.storeId,
                            mall_id: getStore.mall_id
                        }
                    },
                    select: {
                        cnpj: true,
                        name: true
                    }
                })
            ])

            const paymentSystem = initialData[0]; /* Dados do sistema de pagamento do shopping */

            if (!paymentSystem) {
                return res.status(400).json({ message: 'Shopping não está configurado para integrar com sistema de pagamentos.' });
            }

            const store = initialData[1]; /* Dados da loja */

            if (!store || !store.cnpj || !store.name) {
                return res.status(400).json({ message: 'Loja não registrada ou sem CNPJ/nome cadastrado.' });
            }

            const paymentSystemStore = await prisma.paymentsystem_store.findUnique({
                where: {
                    id_store_id_paymentsystem: {
                        id_store: +res.locals.data.storeId,
                        id_paymentsystem: paymentSystem.id_paymentsystem
                    }
                },
                select: {
                    cod_external: true
                }
            })

            if (paymentSystemStore) {
                /* Loja já registrada no sistema de pagamentos */
                res.locals.store = { id_paymentsystem: paymentSystem.id_paymentsystem, cod_external: paymentSystemStore.cod_external, cod_marketplace: paymentSystem.cod_marketplace, name: store.name };
                return next();
            }

            const dupStore = await prisma.paymentsystem_store.findFirst({
                where: {
                    store: {
                        id: +res.locals.data.storeId,
                        cnpj: store.cnpj
                    }
                },
                select: {
                    cod_external: true
                }
            })

            if (dupStore) { /* Já existe outra loja cadastrada com esse cnpj no sistema de pagamentos deste shopping, nova loja vai compartilhar o mesmo código externo */
                await prisma.paymentsystem_store.create({
                    data: {
                        cod_external: dupStore.cod_external,
                        id_paymentsystem: paymentSystem.id_paymentsystem,
                        id_store: +res.locals.data.storeId
                    }
                })

                res.locals.store = { id_paymentsystem: paymentSystem.id_paymentsystem, cod_external: dupStore.cod_external, cod_marketplace: paymentSystem.cod_marketplace, name: store.name };
            } else { /* cnpj não cadastrado no sistema de pagamentos, novo cadastro será realizado */
                const registeredStore: { id: string } = (await axios.post(
                    config.paymentApi.host + config.paymentApi.endpoints.createStore.replace('$MARKETPLACEID', paymentSystem.cod_marketplace),
                    {
                        ein: store.cnpj,
                        business_name: store.name
                    },
                    {
                        headers: {
                            "Content-Type": "application/json"
                        },
                        auth: {
                            username: config.paymentApi.username,
                            password: config.paymentApi.password
                        },
                    }
                )).data;

                await prisma.paymentsystem_store.create({
                    data: {
                        cod_external: registeredStore.id,
                        id_paymentsystem: paymentSystem.id_paymentsystem,
                        id_store: +res.locals.data.storeId
                    }
                })

                res.locals.store = { id_paymentsystem: paymentSystem.id_paymentsystem, cod_external: registeredStore.id, cod_marketplace: paymentSystem.cod_marketplace, name: store.name };
            }

            return next();
        }
        catch (e) {
            if (e?.response?.data?.error?.category === 'duplicate_taxpayer_id') {
                return res.status(400).json({ message: "cnpj já cadastrado na api externa." });
            }
            logger.error(e);
            return next(e);
        }
    }
}

export default storeIntegration;