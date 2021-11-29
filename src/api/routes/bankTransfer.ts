import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as Interfaces from '../../interfaces/IBankTransfer';
import bankTransferService from '../../services/bankTransfer';
import middlewares from '../middlewares';
import logger from '../../loaders/logger';

const route = Router();

export default (app: Router) => {
    route.post('/',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                mallId: req.query.mallId,
                storeId: req.body.storeId,
                bankAccountId: req.body.bankAccountId,
                value: req.body.value
            };
            next();
        },
        middlewares.authRequest(),
        middlewares.validateInput('createBankTransferSchema'),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para criação de transferência bancária');
            try {
                const bankTransferServiceInstance = Container.get(bankTransferService);
                const request: Interfaces.CreateBankTransfer = {
                    mallId: +res.locals.data.mallId,
                    storeId: +res.locals.data.storeId,
                    bankAccountId: res.locals.data.bankAccountId,
                    value: res.locals.data.value,
                    cod_marketplace: res.locals.store.cod_marketplace,
                    id_paymentsystem: +res.locals.store.id_paymentsystem
                }
                await bankTransferServiceInstance.createBankTransfer(request);
                res.status(201).json({ message: "Transferência bancária realizada com sucesso." });
            } catch (e) {
                logger.error('🔥 Falha ao criar transferência bancária: %o', e);
                return next(e);
            }
        });

    route.get('/',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.params.storeId,
                mallId: req.query.mallId,
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
        middlewares.authRequest(),
        middlewares.validateInput('getBankTransfersSchema'),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para buscar transferências bancárias');
            try {
                const bankTransferServiceInstance = Container.get(bankTransferService);
                const request: Interfaces.GetBankTransfers = {
                    storeId: +res.locals.data.storeId,
                    mallId: +res.locals.data.mallId,
                    startDateTime: res.locals.data.startDateTime,
                    endDateTime: res.locals.data.endDateTime,
                    search: res.locals.data.search,
                    limit: +res.locals.data.limit,
                    limitByPage: +res.locals.data.limitByPage,
                    page: +res.locals.data.page,
                    sortBy: +res.locals.data.sortBy,
                    order: res.locals.data.order,
                    id_paymentsystem: +res.locals.store.id_paymentsystem
                }
                const bankTransfers = await bankTransferServiceInstance.getBankTransfers(request);
                res.status(200).json(bankTransfers);
            } catch (e) {
                logger.error('🔥 Falha ao buscar transferências bancárias: %o', e);
                return next(e);
            }
        });

    app.use('/banktransfers', route);
}