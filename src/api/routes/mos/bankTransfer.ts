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
                storeId: req.params.storeId,
                mallId: req.query.mallId,
                bankAccountId: req.body.bankAccountId
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
                    storeId: +res.locals.data.storeId,
                    mallId: +res.locals.data.mallId,
                    bankAccountId: res.locals.data.bankAccountId
                }
                await bankTransferServiceInstance.createBankTransfer(request);
                res.status(201).json({ message: "Transferência bancária realizada com sucesso." });
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao criar transferência bancária: %o', e);
                return next(e);
            }
        });
}