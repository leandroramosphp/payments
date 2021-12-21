import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

import middlewares from '../../middlewares';
import logger from '../../../loaders/logger';
import config from '../../../config';

import * as Interfaces from '../../../interfaces/IPayment';
import paymentServiceMosStore from '../../../services/mosStore/payment';
import paymentServiceMos from '../../../services/mos/payment';


const route = Router();

export default (app: Router) => {
    route.post('/:id/accept',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.query.storeId,
                id: req.params.id,
                invoiceNumber: req.body.invoiceNumber
            };
            next();
        },
        middlewares.decoder,
        async (req: Request, res: Response, next: NextFunction) => {
            await middlewares.authRequestMosStore(req, res, next, "WRITE_PAYMENT")
        },
        middlewares.validateInput('acceptPaymentMosStoreSchema'),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para aprovar pagamento');
            try {
                const paymentServiceInstance = Container.get(paymentServiceMosStore);
                const request: Interfaces.AcceptPayment = {
                    storeId: res.locals.data.storeId,
                    id: +res.locals.data.id,
                    invoiceNumber: res.locals.data.invoiceNumber,
                    id_paymentsystem: +res.locals.store.id_paymentsystem
                }
                await paymentServiceInstance.acceptPayment(request);
                res.status(200).json({ message: "Pagamento foi aceito com sucesso." });
            } catch (e) {
                logger.error('🔥 Falha ao aprovar pagamento: %o', e);
                return next(e);
            }
        });

    route.post('/:id/reject',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.query.storeId,
                id: req.params.id
            };
            next();
        },
        middlewares.decoder,
        async (req: Request, res: Response, next: NextFunction) => {
            await middlewares.authRequestMosStore(req, res, next, "WRITE_PAYMENT")
        },
        middlewares.validateInput('rejectPaymentMosStoreSchema'),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para rejeitar pagamento');
            try {
                const paymentServiceInstance = Container.get(paymentServiceMosStore);
                const request: Interfaces.RejectPayment = {
                    storeId: res.locals.data.storeId,
                    id: +res.locals.data.id,
                    id_paymentsystem: +res.locals.store.id_paymentsystem,
                    cod_external: res.locals.store.cod_external,
                    cod_marketplace: res.locals.store.cod_marketplace
                }
                await paymentServiceInstance.rejectPayment(request);
                res.status(200).json({ message: "Pagamento rejeitado com sucesso." });
            } catch (e) {
                logger.error('🔥 Falha ao rejeitar pagamento: %o', e);
                return next(e);
            }
        });

    route.get('/',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                clientId: req.query.clientId,
                storeId: req.query.storeId,
                status: req.query.status,
                startDateTime: req.query.startDateTime,
                endDateTime: req.query.endDateTime,
                search: req.query.search,
                limit: req.query.limit,
                limitByPage: req.query.limitByPage,
                page: req.query.page,
                sortBy: req.query.sortBy,
                order: req.query.order
            };
            next();
        },
        middlewares.decoder,
        async (req: Request, res: Response, next: NextFunction) => {
            await middlewares.authRequestMosStore(req, res, next, "READ_PAYMENT")
        },
        middlewares.validateInput('getAllPaymentsMosStoreSchema'),
        middlewares.storeIntegration(),
        middlewares.clientIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para buscar todas os pagamentos do lojista');
            try {
                const paymentServiceInstance = Container.get(paymentServiceMos);
                const request: Interfaces.GetAllPaymentsInput = {
                    clientId: +res.locals.data.clientId,
                    storeId: +res.locals.data.storeId,
                    status: res.locals.data.status,
                    startDateTime: res.locals.data.startDateTime,
                    endDateTime: res.locals.data.endDateTime,
                    search: res.locals.data.search,
                    limit: +res.locals.data.limit,
                    limitByPage: +res.locals.data.limitByPage,
                    page: +res.locals.data.page,
                    sortBy: +res.locals.data.sortBy,
                    order: res.locals.data.order,
                    id_paymentsystem: (res.locals.store) ? +res.locals.store.id_paymentsystem : +res.locals.client.id_paymentsystem
                }
                const response = await paymentServiceInstance.getAllPayments(request);
                res.status(200).json(response);
            } catch (e) {
                logger.error('🔥 Falha ao buscar pagamentos do lojista: %o', e);
                return next(e);
            }
        });

    route.get('/items',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                clientId: req.query.clientId,
                storeId: req.query.storeId,
                origin: req.query.origin,
                status: req.query.status,
                startDateTime: req.query.startDateTime,
                endDateTime: req.query.endDateTime,
                search: req.query.search,
                limit: req.query.limit,
                limitByPage: req.query.limitByPage,
                page: req.query.page,
                sortBy: req.query.sortBy,
                order: req.query.order
            };
            next();
        },
        middlewares.decoder,
        async (req: Request, res: Response, next: NextFunction) => {
            await middlewares.authRequestMosStore(req, res, next, "READ_PAYMENT")
        },
        middlewares.validateInput('getAllPaymentItemsMosStoreSchema'),
        middlewares.storeIntegration(),
        middlewares.clientIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para buscar conciliações de todos os pagamentos do lojista');
            try {
                const paymentServiceInstance = Container.get(paymentServiceMosStore);
                const request: Interfaces.GetAllPaymentItemsInput = {
                    clientId: +res.locals.data.clientId,
                    storeId: +res.locals.data.storeId,
                    origin: res.locals.data.origin,
                    status: res.locals.data.status,
                    startDateTime: res.locals.data.startDateTime,
                    endDateTime: res.locals.data.endDateTime,
                    search: res.locals.data.search,
                    limit: +res.locals.data.limit,
                    limitByPage: +res.locals.data.limitByPage,
                    page: +res.locals.data.page,
                    sortBy: +res.locals.data.sortBy,
                    order: res.locals.data.order,
                    id_paymentsystem: (res.locals.store) ? +res.locals.store.id_paymentsystem : +res.locals.client.id_paymentsystem
                }
                const response = await paymentServiceInstance.getAllPaymentsItems(request);
                res.status(200).json(response);
            } catch (e) {
                logger.error('🔥 Falha ao buscar conciliações de pagamentos do lojista: %o', e);
                return next(e);
            }
        });
    
    app.use(config.apiMosStore.root + config.apiMosStore.version + config.apiMosStore.prefix + '/payments', route);
}