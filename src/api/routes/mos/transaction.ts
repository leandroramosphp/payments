import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as Interfaces from '../../../interfaces/ITransaction';
import transactionService from '../../../services/transaction';
import middlewares from '../../middlewares';

export default (route: Router) => {
    route.post('/stores/:storeId/transactions/:id/accept',
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
        middlewares.validateInput('acceptTransactionSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para aprovar transação');
            try {
                const transactionServiceInstance = Container.get(transactionService);
                const request: Interfaces.AcceptTransaction = {
                    storeId: +res.locals.data.storeId,
                    mallId: +res.locals.data.mallId,
                    id: +res.locals.data.id,
                    invoiceNumber: res.locals.data.invoiceNumber
                }
                await transactionServiceInstance.acceptTransaction(request);
                res.status(200).json({ message: "Transação foi aceita com sucesso." });
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao aprovar transação: %o', e);
                return next(e);
            }
        });

    route.post('/stores/:storeId/transactions/:id/reject',
        middlewares.mosAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.params.storeId,
                mallId: req.query.mallId,
                id: req.params.id
            };
            next();
        },
        middlewares.validateInput('rejectTransactionSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para rejeitar transação');
            try {
                const transactionServiceInstance = Container.get(transactionService);
                const request: Interfaces.RejectTransaction = {
                    storeId: +res.locals.data.storeId,
                    mallId: +res.locals.data.mallId,
                    id: +res.locals.data.id,
                }
                await transactionServiceInstance.rejectTransaction(request);
                res.status(200).json({ message: "Transação rejeitada com sucesso." });
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao rejeitar transação: %o', e);
                return next(e);
            }
        });

    route.get('/stores/:id/transactions',
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
        middlewares.validateInput('getAllTransactionsSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para buscar todas as transações do lojista');
            try {
                const transactionServiceInstance = Container.get(transactionService);
                const request: Interfaces.GetAllTransactionsInput = {
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
                const response = await transactionServiceInstance.getAllTransactions(request);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao buscar transações do lojista: %o', e);
                return next(e);
            }
        });
}