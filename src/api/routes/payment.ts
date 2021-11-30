import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as Interfaces from '../../interfaces/IPayment';
import paymentService from '../../services/payment';
import middlewares from '../middlewares';
import logger from '../../loaders/logger';

const route = Router();

export default (app: Router) => {
    route.post('/:id/accept',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.body.storeId,
                mallId: req.query.mallId,
                id: req.params.id,
                invoiceNumber: req.body.invoiceNumber
            };
            next();
        },
        middlewares.authRequest(false),
        middlewares.validateInput('acceptPaymentSchema'),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para aprovar pagamento');
            try {
                const paymentServiceInstance = Container.get(paymentService);
                const request: Interfaces.AcceptPayment = {
                    storeId: res.locals.data.storeId,
                    mallId: +res.locals.data.mallId,
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
                storeId: req.body.storeId,
                mallId: req.query.mallId,
                id: req.params.id
            };
            next();
        },
        middlewares.authRequest(false),
        middlewares.validateInput('rejectPaymentSchema'),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para rejeitar pagamento');
            try {
                const paymentServiceInstance = Container.get(paymentService);
                const request: Interfaces.RejectPayment = {
                    storeId: res.locals.data.storeId,
                    mallId: +res.locals.data.mallId,
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
                mallId: req.query.mallId,
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
        middlewares.authRequest(false),
        middlewares.validateInput('getAllPaymentsSchema'),
        middlewares.storeIntegration(),
        middlewares.clientIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para buscar todas os pagamentos do lojista');
            try {
                const paymentServiceInstance = Container.get(paymentService);
                const request: Interfaces.GetAllPaymentsInput = {
                    clientId: +res.locals.data.clientId,
                    storeId: +res.locals.data.storeId,
                    mallId: +res.locals.data.mallId,
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
                const response = await paymentServiceInstance.getAllPayments(request);
                res.status(200).json(response);
            } catch (e) {
                logger.error('🔥 Falha ao buscar pagamentos do lojista: %o', e);
                return next(e);
            }
        });

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
        middlewares.authRequest(false),
        middlewares.validateInput('createPaymentSchema'),
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

    app.use('/payments', route);
}