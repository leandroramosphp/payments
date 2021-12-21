import { Request, Response, NextFunction } from 'express';
import prisma from '../../loaders/prisma';
import axios from 'axios';
import logger from '../../loaders/logger';
import config from '../../config';

let clientIntegration = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!res.locals.data.clientId) {
                return next();
            }
            const initialData = await prisma.$transaction([
                prisma.paymentsystem_client.findFirst({
                    where: {
                        id_client: +res.locals.data.clientId,
                        paymentsystem: {
                            flg_active: true
                        }
                    },
                    select: {
                        paymentsystem: {
                            select: {
                                id_paymentsystem: true,
                                cod_marketplace: true
                            }
                        }
                    }
                }),
                prisma.client.findFirst({
                    where: {
                        id: +res.locals.data.clientId,
                    },
                    select: {
                        cpf: true
                    }
                })
            ])

            const paymentSystem = initialData[0]; /* Dados do sistema de pagamento do shopping */

            if (!paymentSystem) {
                return res.status(400).json({ message: 'Shopping não está configurado para integrar com sistema de pagamentos.' });
            }

            const client = initialData[1]; /* Dados do cliente */

            if (!client) {
                return res.status(400).json({ message: 'Cliente não registrado.' });
            }

            const paymentSystemClient = await prisma.paymentsystem_client.findUnique({
                where: {
                    id_client_id_paymentsystem: {
                        id_client: +res.locals.data.clientId,
                        id_paymentsystem: paymentSystem.paymentsystem.id_paymentsystem
                    }
                },
                select: {
                    cod_external: true
                }
            })

            if (paymentSystemClient) {
                /* Cliente já registrado no sistema de pagamentos */
                res.locals.client = { id_paymentsystem: paymentSystem.paymentsystem.id_paymentsystem, cod_external: paymentSystemClient.cod_external, cod_marketplace: paymentSystem.paymentsystem.cod_marketplace };
                return next();
            }

            const registeredClient: { id: string } = (await axios.post(
                config.paymentApi.host + config.paymentApi.endpoints.createClient.replace('$MARKETPLACEID', paymentSystem.paymentsystem.cod_marketplace),
                {
                    taxpayer_id: client.cpf
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

            await prisma.paymentsystem_client.create({
                data: {
                    id_client: +res.locals.data.clientId,
                    id_paymentsystem: paymentSystem.paymentsystem.id_paymentsystem,
                    cod_external: registeredClient.id
                }
            })

            res.locals.client = { id_paymentsystem: paymentSystem.paymentsystem.id_paymentsystem, cod_external: registeredClient.id, cod_marketplace: paymentSystem.paymentsystem.cod_marketplace };

            return next();
        }
        catch (e) {
            logger.error(e);
            return next(e);
        }
    }

}

export default clientIntegration;