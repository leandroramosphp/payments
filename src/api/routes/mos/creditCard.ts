import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as Interfaces from '../../../interfaces/ICreditCard';
import creditCardService from '../../../services/mos/creditCard';
import middlewares from '../../middlewares';
import logger from '../../../loaders/logger';
import config from '../../../config';

const route = Router();

export default (app: Router) => {
    route.post('/',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                mallId: req.query.mallId,
                clientId: req.body.clientId,
                encryptedCreditCard: req.body.encryptedCreditCard
            };
            next();
        },
        middlewares.authRequest(false),
        middlewares.validateInput('createCreditCardSchema'),
        middlewares.paymentSystemIntegration(),
        middlewares.clientIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para cadastrar cartão de crédito');
            try {
                const creditCardServiceInstance = Container.get(creditCardService);
                const request: Interfaces.CreateCreditCard = {
                    encryptedCreditCard: res.locals.data.encryptedCreditCard,
                    clientId: +res.locals.data.clientId,
                    cod_external: res.locals.client.cod_external,
                    id_paymentsystem: +res.locals.client.id_paymentsystem,
                    cod_marketplace: res.locals.client.cod_marketplace
                }
                const creditCard = await creditCardServiceInstance.createCreditCard(request);
                res.status(201).json(creditCard);
            } catch (e) {
                logger.error('🔥 Falha ao cadastrar cartão de crédito: %o', e);
                return next(e);
            }
        });

    route.post('/:id/disable',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                mallId: req.query.mallId,
                clientId: req.body.clientId,
                id: req.params.id
            };
            next();
        },
        middlewares.authRequest(false),
        middlewares.validateInput('disableCreditCardSchema'),
        middlewares.paymentSystemIntegration(),
        middlewares.clientIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para desabilitar cartão de crédito');
            try {
                const creditCardServiceInstance = Container.get(creditCardService);
                const request: Interfaces.DisableCreditCard = {
                    clientId: +res.locals.data.clientId,
                    id: +res.locals.data.id,
                    id_paymentsystem: +res.locals.client.id_paymentsystem,
                    cod_marketplace: res.locals.client.cod_marketplace
                }
                await creditCardServiceInstance.disableCreditCard(request);
                res.status(200).json({ message: "Cartão de crédito desabilitado com sucesso." });
            } catch (e) {
                logger.error('🔥 Falha ao desabilitar cartão de crédito: %o', e);
                return next(e);
            }
        });

    route.get('/',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                mallId: req.query.mallId,
                clientId: req.query.clientId
            };
            next();
        },
        middlewares.authRequest(false),
        middlewares.validateInput('getCreditCardsSchema'),
        middlewares.paymentSystemIntegration(),
        middlewares.clientIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para listar cartões de crédito do cliente');
            try {
                const creditCardServiceInstance = Container.get(creditCardService);
                const request: Interfaces.GetCreditCards = {
                    clientId: +res.locals.data.clientId,
                    id_paymentsystem: +res.locals.client.id_paymentsystem
                }
                const response = await creditCardServiceInstance.getCreditCards(request);
                res.status(200).json(response);
            } catch (e) {
                logger.error('🔥 Falha ao listar cartões de crédito do cliente: %o', e);
                return next(e);
            }
        });

    app.use(config.apiMos.root + config.apiMos.version + config.apiMos.prefix + '/creditcards', route);
}