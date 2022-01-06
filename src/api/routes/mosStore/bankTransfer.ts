import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

import middlewares from '../../middlewares';
import logger from '../../../loaders/logger';
import config from '../../../config';

import * as Interfaces from '../../../interfaces/IBankTransfer';
import bankTransferService from '../../../services/mosStore/bankTransfer';


const route = Router();

export default (app: Router) => {

    route.post('/',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.query.storeId,
                bankAccountId: req.body.bankAccountId,
                value: req.body.value.toString()
            };
            next();
        },
        async (req: Request, res: Response, next: NextFunction) => {
            await middlewares.authRequestMosStore(req, res, next, "WRITE_BANK_TRANSFER")
        },
        middlewares.validateInput('createBankTransferMosStoreSchema'),
        middlewares.paymentSystemIntegration(),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para criação de transferência bancária');
            try {
                const bankTransferServiceInstance = Container.get(bankTransferService);
                const request: Interfaces.CreateBankTransfer = {
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
                storeId: req.query.storeId,
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
        async (req: Request, res: Response, next: NextFunction) => {
            await middlewares.authRequestMosStore(req, res, next, "READ_BANK_TRANSFER")
        },
        middlewares.validateInput('getBankTransfersMosStoreSchema'),
        middlewares.paymentSystemIntegration(),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para buscar transferências bancárias');
            try {
                const bankTransferServiceInstance = Container.get(bankTransferService);
                const request: Interfaces.GetBankTransfers = {
                    storeId: +res.locals.data.storeId,
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
    app.use(config.apiMosStore.root + config.apiMosStore.version + config.apiMosStore.prefix + '/banktransfers', route);
}