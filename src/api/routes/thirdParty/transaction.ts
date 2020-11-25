import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as Interfaces from '../../../interfaces/ITransaction';
import transactionService from '../../../services/transaction';
import middlewares from '../../middlewares';

export default (route: Router) => {
    route.post('/stores/:id/transactions',
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
        middlewares.validateInput('createTransactionSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para criar transação');
            try {
                const transactionServiceInstance = Container.get(transactionService);
                const request: Interfaces.CreateTransaction = {
                    storeId: +res.locals.data.storeId,
                    clientId: res.locals.data.clientId,
                    mallId: +res.locals.data.mallId,
                    value: res.locals.data.value,
                    installments: res.locals.data.installments,
                    creditCardId: res.locals.data.creditCardId
                }
                await transactionServiceInstance.createTransaction(request);
                res.status(201).json({ message: "Transação cadastrada com sucesso." });
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao criar transação: %o', e);
                return next(e);
            }
        });
}