import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as Interfaces from '../../../interfaces/ITransaction';
import transactionService from '../../../services/transaction';
import middlewares from '../../middlewares';

export default (route: Router) => {
    route.post('/stores/:id/transactions/:id/accept',
        middlewares.thirdPartyAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                /* TODO: Adicionar parâmetros para validação */
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
                    /* TODO: Adicionar parâmetros para executar serviço */
                }
                await transactionServiceInstance.acceptTransaction(request);
                res.status(200).json({ message: "Transação foi aceita com sucesso." });
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao aprovar transação: %o', e);
                return next(e);
            }
        });

    route.post('/stores/:id/transactions/:id/reject',
        middlewares.thirdPartyAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                /* TODO: Adicionar parâmetros para validação */
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
                    /* TODO: Adicionar parâmetros para executar serviço */
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
        middlewares.thirdPartyAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                /* TODO: Adicionar parâmetros para validação */
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
                const request: Interfaces.GetAllTransactions = {
                    /* TODO: Adicionar parâmetros para executar serviço */
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