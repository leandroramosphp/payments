import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as Interfaces from '../../../interfaces/IBankTransfer';
import bankTransferService from '../../../services/bankTransfer';
import middlewares from '../../middlewares';

export default (route: Router) => {
    route.post('/stores/:storeId/bank-transfers',
        middlewares.mosAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                mallId: req.query.mallId,
                storeId: req.params.storeId,
                bankAccountId: req.body.bankAccountId,
                value: req.body.value
            };
            next();
        },
        middlewares.validateInput('createBankTransferSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para criação de transferência bancária');
            try {
                const bankTransferServiceInstance = Container.get(bankTransferService);
                const request: Interfaces.CreateBankTransfer = {
                    mallId: +res.locals.data.mallId,
                    storeId: +res.locals.data.storeId,
                    bankAccountId: res.locals.data.bankAccountId,
                    value: res.locals.data.value
                }
                await bankTransferServiceInstance.createBankTransfer(request);
                res.status(201).json({ message: "Transferência bancária realizada com sucesso." });
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao criar transferência bancária: %o', e);
                return next(e);
            }
        });

    route.get('/stores/:storeId/bank-transfers',
        middlewares.mosAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.params.storeId,
                mallId: req.query.mallId
            };
            next();
        },
        middlewares.validateInput('getBankTransfersSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore
            logger.debug('Chamando endpoint para buscar transferências bancárias');
            try {
                const bankTransferServiceInstance = Container.get(bankTransferService);
                const request: Interfaces.GetBankTransfers = {
                    storeId: +res.locals.data.storeId,
                    mallId: +res.locals.data.mallId
                }
                const bankTransfers = await bankTransferServiceInstance.getBankTransfers(request);
                res.status(200).json(bankTransfers);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao buscar transferências bancárias: %o', e);
                return next(e);
            }
        });
}