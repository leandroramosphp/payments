import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as Interfaces from '../../../interfaces/IStore';
import storeService from '../../../services/store';
import middlewares from '../../middlewares';

export default (route: Router) => {
    route.post('/stores/:storeId/register',
        middlewares.internalAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.params.storeId,
                mallId: req.query.mallId
            };
            next();
        },
        middlewares.validateInput('createStoreSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para cadastro de lojista');
            try {
                const storeServiceInstance = Container.get(storeService);
                const request: Interfaces.CreateStore = {
                    storeId: +res.locals.data.storeId,
                    mallId: +res.locals.data.mallId
                }
                await storeServiceInstance.createStore(request);
                res.status(201).json({ message: "Loja cadastrada com sucesso." });
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao cadastrar lojista: %o', e);
                return next(e);
            }
        });

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
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para buscar saldo do lojista');
            try {
                const storeServiceInstance = Container.get(storeService);
                const request: Interfaces.GetStoreBalance = {
                    storeId: +res.locals.data.storeId,
                    mallId: +res.locals.data.mallId
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