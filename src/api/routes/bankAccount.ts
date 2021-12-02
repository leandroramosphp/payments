import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as Interfaces from '../../interfaces/IBankAccount';
import bankAccountService from '../../services/bankAccount';
import middlewares from '../middlewares';
import logger from '../../loaders/logger';

const route = Router();

export default (app: Router) => {
    route.post('/',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.body.storeId,
                bankAccountToken: req.body.bankAccountToken,
                mallId: req.query.mallId
            };
            next();
        },
        middlewares.decoder,
        middlewares.authRequest(false),
        middlewares.validateInput('createBankAccountSchema'),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para cadastro de conta bancária');
            try {
                const bankAccountServiceInstance = Container.get(bankAccountService);
                const request: Interfaces.CreateBankAccount = {
                    storeId: +res.locals.data.storeId,
                    bankAccountToken: res.locals.data.bankAccountToken,
                    mallId: +res.locals.data.mallId,
                    cod_external: res.locals.store.cod_external,
                    cod_marketplace: res.locals.store.cod_marketplace,
                    id_paymentsystem: +res.locals.store.id_paymentsystem
                };
                await bankAccountServiceInstance.createBankAccount(request);
                res.status(201).json({ message: "Conta bancária cadastrada com sucesso." });
            } catch (e) {
                logger.error('🔥 Falha ao cadastrar conta bancária: %o', e);
                return next(e);
            }
        });

    route.post('/:id/disable',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                id: req.params.id,
                storeId: req.body.storeId,
                mallId: req.query.mallId
            };
            next();
        },
        middlewares.decoder,
        middlewares.authRequest(false),
        middlewares.validateInput('disableBankAccountSchema'),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para desabilitar conta bancária');
            try {
                const bankAccountServiceInstance = Container.get(bankAccountService);
                const request: Interfaces.DisableBankAccount = {
                    id: +res.locals.data.id,
                    storeId: +res.locals.data.storeId,
                    mallId: +res.locals.data.mallId,
                    cod_external: res.locals.store.cod_external,
                    cod_marketplace: res.locals.store.cod_marketplace,
                    id_paymentsystem: +res.locals.store.id_paymentsystem
                };
                await bankAccountServiceInstance.disableBankAccount(request);
                res.status(200).json({ message: "Conta bancária desabilitada com sucesso." });
            } catch (e) {
                logger.error('🔥 Falha ao desabilitar conta bancária: %o', e);
                return next(e);
            }
        });

    route.get('/',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.query.storeId,
                mallId: req.query.mallId
            };
            next();
        },
        middlewares.decoder,
        middlewares.authRequest(false),
        middlewares.validateInput('getBankAccountsSchema'),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para listar todas as contas bancárias do lojista');
            try {
                const bankAccountServiceInstance = Container.get(bankAccountService);
                const request: Interfaces.GetBankAccounts = {
                    storeId: +res.locals.data.storeId,
                    mallId: +res.locals.data.mallId,
                    id_paymentsystem: +res.locals.store.id_paymentsystem
                };
                const response = await bankAccountServiceInstance.getBankAccounts(request);
                res.status(200).json(response);
            } catch (e) {
                logger.error('🔥 Falha ao listar contas bancárias do lojista: %o', e);
                return next(e);
            }
        });

    app.use('/bankaccounts', route);
}