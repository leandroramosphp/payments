import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as Interfaces from '../../../interfaces/IBankAccount';
import bankAccountService from '../../../services/bankAccount';
import middlewares from '../../middlewares';

export default (route: Router) => {
    route.post('/stores/:storeId/bank-accounts',
        middlewares.mosAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.params.storeId,
                mallId: req.query.mallId,
                bankAccountToken: req.body.bankAccountToken
            };
            next();
        },
        middlewares.validateInput('createBankAccountSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para cadastro de conta bancária');
            try {
                const bankAccountServiceInstance = Container.get(bankAccountService);
                const request: Interfaces.CreateBankAccount = {
                    storeId: +res.locals.data.storeId,
                    mallId: +res.locals.data.mallId,
                    bankAccountToken: res.locals.data.bankAccountToken
                };
                await bankAccountServiceInstance.createBankAccount(request);
                res.status(201).json({ message: "Conta bancária registrada com sucesso." });
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao cadastrar conta bancária: %o', e);
                return next(e);
            }
        });

    route.post('/stores/:storeId/bank-accounts/:id/disable',
        middlewares.mosAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                id: +req.params.id,
                mallId: +req.query.mallId,
                storeId: +req.params.storeId
            };
            next();
        },
        middlewares.validateInput('disableBankAccountSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para desabilitar conta bancária');
            try {
                const bankAccountServiceInstance = Container.get(bankAccountService);
                const request: Interfaces.DisableBankAccount = {
                    id: +res.locals.data.id,
                    storeId: +res.locals.data.storeId,
                    mallId: +res.locals.data.mallId
                };
                await bankAccountServiceInstance.disableBankAccount(request);
                res.status(200).json({ message: "Conta bancária desabilitada com sucesso." });
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao desabilitar conta bancária: %o', e);
                return next(e);
            }
        });

    route.get('/stores/:storeId/bank-accounts',
        middlewares.mosAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.params.storeId,
                mallId: req.query.mallId,
            };
            next();
        },
        middlewares.validateInput('getAllBankAccountsSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para listar todas as contas bancárias do lojista');
            try {
                const bankAccountServiceInstance = Container.get(bankAccountService);
                const request: Interfaces.GetAllBankAccounts = {
                    storeId: +res.locals.data.storeId,
                    mallId: +res.locals.data.mallId
                };
                const response = await bankAccountServiceInstance.getAllBankAccounts(request);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao listar contas bancárias do lojista: %o', e);
                return next(e);
            }
        });
}