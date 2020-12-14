import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as Interfaces from '../../../interfaces/IPayment';
import paymentService from '../../../services/payment';
import middlewares from '../../middlewares';

export default (route: Router) => {
    route.post('/stores/:id/payments',
        middlewares.thirdPartyAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.params.id,
                clientId: req.body.clientId,
                mallId: req.query.mallId,
                value: req.body.value,
                installments: req.body.installments,
                creditCardId: req.body.creditCardId
            };
            next();
        },
        middlewares.validateInput('createPaymentSchema'),
        middlewares.storeIntegration(),
        middlewares.clientIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para criar pagamento');
            try {
                const paymentServiceInstance = Container.get(paymentService);
                const request: Interfaces.CreatePayment = {
                    storeId: +res.locals.data.storeId,
                    clientId: res.locals.data.clientId,
                    mallId: +res.locals.data.mallId,
                    value: +res.locals.data.value,
                    installments: +res.locals.data.installments,
                    creditCardId: +res.locals.data.creditCardId,
                    storeName: res.locals.store.name,
                    id_payment: res.locals.store.id_payment,
                    clientPaymentId: +res.locals.client.clientPaymentId
                }
                await paymentServiceInstance.createPayment(request);
                res.status(201).json({ message: "Pagamento cadastrado com sucesso." });
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao criar pagamento: %o', e);
                return next(e);
            }
        });
}