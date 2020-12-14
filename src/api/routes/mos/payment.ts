import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as Interfaces from '../../../interfaces/IPayment';
import paymentService from '../../../services/payment';
import middlewares from '../../middlewares';

export default (route: Router) => {
    route.post('/stores/:storeId/payments/:id/accept',
        middlewares.mosAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.params.storeId,
                mallId: req.query.mallId,
                id: req.params.id,
                invoiceNumber: req.body.invoiceNumber
            };
            next();
        },
        middlewares.validateInput('acceptPaymentSchema'),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para aprovar pagamento');
            try {
                const paymentServiceInstance = Container.get(paymentService);
                const request: Interfaces.AcceptPayment = {
                    storeId: +res.locals.data.storeId,
                    mallId: +res.locals.data.mallId,
                    id: +res.locals.data.id,
                    invoiceNumber: res.locals.data.invoiceNumber
                }
                await paymentServiceInstance.acceptPayment(request);
                res.status(200).json({ message: "Pagamento foi aceito com sucesso." });
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao aprovar pagamento: %o', e);
                return next(e);
            }
        });

    route.post('/stores/:storeId/payments/:id/reject',
        middlewares.mosAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.params.storeId,
                mallId: req.query.mallId,
                id: req.params.id
            };
            next();
        },
        middlewares.validateInput('rejectPaymentSchema'),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para rejeitar pagamento');
            try {
                const paymentServiceInstance = Container.get(paymentService);
                const request: Interfaces.RejectPayment = {
                    storeId: +res.locals.data.storeId,
                    mallId: +res.locals.data.mallId,
                    id: +res.locals.data.id,
                    id_payment: res.locals.store.id_payment
                }
                await paymentServiceInstance.rejectPayment(request);
                res.status(200).json({ message: "Pagamento rejeitado com sucesso." });
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao rejeitar pagamento: %o', e);
                return next(e);
            }
        });

    route.get('/stores/:id/payments',
        middlewares.mosAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.params.id,
                mallId: req.query.mallId,
                origin: req.query.origin,
                status: req.query.status,
                startDate: req.query.startDate,
                endDate: req.query.endDate,
                search: req.query.search,
                limit: req.query.limit,
                page: req.query.page,
                column: req.query.column,
                order: req.query.order
            };
            next();
        },
        middlewares.validateInput('getAllPaymentsSchema'),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para buscar todas os pagamentos do lojista');
            try {
                const paymentServiceInstance = Container.get(paymentService);
                const request: Interfaces.GetAllPaymentsInput = {
                    storeId: +res.locals.data.storeId,
                    mallId: +res.locals.data.mallId,
                    origin: res.locals.data.origin,
                    status: res.locals.data.status,
                    startDate: res.locals.data.startDate,
                    endDate: res.locals.data.endDate,
                    search: res.locals.data.search,
                    limit: +res.locals.data.limit,
                    page: +res.locals.data.page,
                    column: +res.locals.data.column,
                    order: res.locals.data.order
                }
                const response = await paymentServiceInstance.getAllPayments(request);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao buscar pagamentos do lojista: %o', e);
                return next(e);
            }
        });
}