import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as Interfaces from '../../interfaces/IStore';
import storeService from '../../services/store';
import middlewares from '../middlewares';
import logger from '../../loaders/logger';

const route = Router();

export default (app: Router) => {
    route.get('/balance',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.query.storeId,
                mallId: req.query.mallId
            };
            next();
        },
        middlewares.authRequest(false),
        middlewares.validateInput('getStoreBalanceSchema'),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para buscar saldo do lojista');
            try {
                const storeServiceInstance = Container.get(storeService);
                const request: Interfaces.GetStoreBalance = {
                    storeId: +res.locals.data.storeId,
                    mallId: +res.locals.data.mallId,
                    cod_external: res.locals.store.cod_external,
                    cod_marketplace: res.locals.store.cod_marketplace
                }
                const response = await storeServiceInstance.getStoreBalance(request);
                res.status(200).json(response);
            } catch (e) {
                logger.error('🔥 Falha ao buscar saldo do lojista: %o', e);
                return next(e);
            }
        });
    
    route.post('/qrcode',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.body.storeId,
            };
            next();
        },
        middlewares.authRequest(false),
        middlewares.validateInput('generateQrcodeSchema'),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para gerar qrcode de uma loja');
            try {
                const storeServiceInstance = Container.get(storeService);
                const request = {
                    storeId: +res.locals.data.storeId,
                    name: res.locals.store.name
                }
                const response = await storeServiceInstance.generateQrcode(request);
                res.status(200).send(response);
            } catch (e) {
                logger.error('🔥 Falha ao gerar QR-code: %o', e);
                return next(e);
            }
        });
    app.use('/stores', route);
}