import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as Interfaces from '../../../interfaces/IPayment';
import paymentService from '../../../services/mos/payment';
import middlewares from '../../middlewares';
import logger from '../../../loaders/logger';
import config from '../../../config';

const route = Router();

export default (app: Router) => {
    route.post('/',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.body.storeId,
                clientId: req.body.clientId,
                mallId: req.query.mallId,
                value: req.body.value,
                installments: req.body.installments,
                creditCardId: req.body.creditCardId
            };
            next();
        },
        middlewares.decoder,
        middlewares.authRequest(false),
        middlewares.validateInput('createPaymentMosSchema'),
        middlewares.storeIntegration(),
        middlewares.clientIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
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
                    id_paymentsystem: +res.locals.store.id_paymentsystem,
                    cod_external: res.locals.store.cod_external,
                    cod_marketplace: res.locals.store.cod_marketplace
                }
                await paymentServiceInstance.createPayment(request);
                res.status(201).json({ message: "Pagamento cadastrado com sucesso." });
            } catch (e) {
                logger.error('🔥 Falha ao criar pagamento: %o', e);
                return next(e);
            }
        });

    app.use(config.apiMos.root + config.apiMos.version + config.apiMos.prefix + '/payments', route);
}