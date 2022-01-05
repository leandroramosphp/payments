import { Request, Response, NextFunction } from 'express';
import prisma from '../../loaders/prisma';
import logger from '../../loaders/logger';

let paymentSystemIntegration = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            var idMall: number;
            if (res.locals.data.mallId) {
                idMall = +res.locals.data.mallId
            } else if (res.locals.data.storeId) {
                idMall = (await prisma.store.findUnique({
                    where: {
                        id: +res.locals.data.storeId
                    }
                })).mall_id
            } else {
                return res.status(400).json({ message: 'Não foi possível detectar o shopping de origem.' });
            }
            /* Dados do sistema de pagamento do shopping */
            const paymentSystem = await prisma.paymentsystem.findFirst({
                where: {
                    id_mall: idMall,
                    flg_active: true
                },
                select: {
                    id_paymentsystem: true,
                    cod_marketplace: true,
                    id_mall: true
                }
            });

            if (!paymentSystem) {
                return res.status(400).json({ message: 'Shopping não está configurado para integrar com sistema de pagamentos.' });
            }

            res.locals.paymentSystem = { id_paymentsystem: paymentSystem.id_paymentsystem, cod_marketplace: paymentSystem.cod_marketplace, id_mall: paymentSystem.id_mall };

            return next();
        }
        catch (e) {
            logger.error(e);
            return next(e);
        }
    }

}

export default paymentSystemIntegration;