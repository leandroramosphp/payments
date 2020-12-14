import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as Interfaces from '../../../interfaces/IStore';
import storeService from '../../../services/store';
import middlewares from '../../middlewares';

export default (route: Router) => {
    route.get('/stores/:storeId/balance',
        middlewares.mosAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.params.storeId,
                mallId: req.query.mallId
            };
            next();
        },
        middlewares.validateInput('getStoreBalanceSchema'),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para buscar saldo do lojista');
            try {
                const storeServiceInstance = Container.get(storeService);
                const request: Interfaces.GetStoreBalance = {
                    storeId: +res.locals.data.storeId,
                    mallId: +res.locals.data.mallId,
                    id_payment: res.locals.store.id_payment
                }
                const response = await storeServiceInstance.getStoreBalance(request);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao buscar saldo do lojista: %o', e);
                return next(e);
            }
        });
}