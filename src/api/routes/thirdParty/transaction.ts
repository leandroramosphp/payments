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
                /* TODO: Adicionar parâmetros para validação */
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
                    /* TODO: Adicionar parâmetros para executar serviço */
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