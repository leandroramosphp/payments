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
            /* Dados do cliente */
            const client = await prisma.client.findFirst({
                where: {
                    id: +res.locals.data.clientId,
                    id_mall: res.locals.paymentSystem.id_mall
                },
                select: {
                    cpf: true,
                    id_mall: true
                }
            })

            if (!client) {
                return res.status(400).json({ message: 'Cliente não registrado.' });
            }

            const paymentSystemClient = await prisma.paymentsystem_client.findUnique({
                where: {
                    id_client_id_paymentsystem: {
                        id_client: +res.locals.data.clientId,
                        id_paymentsystem: res.locals.paymentSystem.id_paymentsystem
                    }
                },
                select: {
                    cod_external: true
                }
            })

            if (paymentSystemClient) {
                /* Cliente já registrado no sistema de pagamentos */
                res.locals.client = { id_paymentsystem: res.locals.paymentSystem.id_paymentsystem, cod_external: paymentSystemClient.cod_external, cod_marketplace: res.locals.paymentSystem.cod_marketplace };
                return next();
            }

            const registeredClient: { id: string } = (await axios.post(
                config.paymentApi.host + config.paymentApi.endpoints.createClient.replace('$MARKETPLACEID', res.locals.paymentSystem.cod_marketplace),
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
                    id_paymentsystem: res.locals.paymentSystem.id_paymentsystem,
                    cod_external: registeredClient.id
                }
            })

            res.locals.client = { id_paymentsystem: res.locals.paymentSystem.id_paymentsystem, cod_external: registeredClient.id, cod_marketplace: res.locals.paymentSystem.cod_marketplace };

            return next();
        }
        catch (e) {
            logger.error(e);
            return next(e);
        }
    }

}

export default clientIntegration;