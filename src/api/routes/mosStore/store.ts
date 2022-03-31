import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';

import middlewares from '../../middlewares';
import logger from '../../../loaders/logger';
import config from '../../../config';

import * as Interfaces from '../../../interfaces/IStore';
import storeService from '../../../services/mosStore/store';


const route = Router();

export default (app: Router) => {
    route.get('/balance',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.query.storeId,
            };
            next();
        },
        async (req: Request, res: Response, next: NextFunction) => {
            await middlewares.authRequestMosStore(req, res, next, "READ_BANK_ACCOUNT")
        },
        middlewares.validateInput('getStoreBalanceMosStoreSchema'),
        middlewares.paymentSystemIntegration(),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para buscar saldo do lojista');
            try {
                const storeServiceInstance = Container.get(storeService);
                const request: Interfaces.GetStoreBalance = {
                    storeId: +res.locals.data.storeId,
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

    route.get('/marketplace',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.query.storeId,
            };
            next();
        },
        async (req: Request, res: Response, next: NextFunction) => {
            await middlewares.authRequestMosStore(req, res, next, "WRITE_BANK_ACCOUNT")
        },
        middlewares.validateInput('getStoreMarketplaceMosStoreSchema'),
        middlewares.paymentSystemIntegration(),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para buscar cod. marketplace da loja');
            try {
                const response = { marketplaceId: res.locals.store.cod_marketplace }
                res.status(200).json(response);
            } catch (e) {
                logger.error('🔥 Falha ao buscar  cod. marketplace da loja: %o', e);
                return next(e);
            }
        });

    route.post('/qrcode',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.query.storeId,
            };
            next();
        },
        async (req: Request, res: Response, next: NextFunction) => {
            await middlewares.authRequestMosStore(req, res, next)
        },
        middlewares.validateInput('generateQrcodeMosStoreSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para gerar qrcode de uma loja');
            try {
                const storeServiceInstance = Container.get(storeService);
                const request = {
                    storeId: res.locals.data.storeId
                }
                const response = await storeServiceInstance.generateQrcode(request);
                res.status(200).send(response);
            } catch (e) {
                logger.error('🔥 Falha ao gerar QR-code: %o', e);
                return next(e);
            }
        });
    
    route.get('/sales-plans',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.query.storeId,
                storeCode: req.query.storeCode,
            };
            next();
        },
        middlewares.validateInput('getSalesPlanMosstoreSchema'),
        middlewares.decoder,
        async (req: Request, res: Response, next: NextFunction) => {
            req.query.storeId = res.locals.data.storeId
            await middlewares.authRequestMosStore(req, res, next)
        },
        middlewares.paymentSystemIntegration(),
        middlewares.storeIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para buscar saldo do lojista');
            try {
                const storeServiceInstance = Container.get(storeService);
                const request: Interfaces.IRequestGetStoreSalesPlans = {
                    storeId: +res.locals.data.storeId,
                }
                const response = await storeServiceInstance.getSalesPlans(request);
                res.status(200).json(response);
            } catch (e) {
                logger.error('🔥 Falha ao buscar plano de venda: %o', e);
                return next(e);
            }
        });
    
    app.use(config.apiMosStore.root + config.apiMosStore.version + config.apiMosStore.prefix + '/stores', route);
}