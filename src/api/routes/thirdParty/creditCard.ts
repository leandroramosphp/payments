import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as Interfaces from '../../../interfaces/ICreditCard';
import creditCardService from '../../../services/creditCard';
import middlewares from '../../middlewares';

export default (route: Router) => {
    route.post('/clients/:clientId/credit-cards',
        middlewares.thirdPartyAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                mallId: req.query.mallId,
                clientId: req.params.clientId,
                creditCardToken: req.body.creditCardToken
            };
            next();
        },
        middlewares.validateInput('createCreditCardSchema'),
        middlewares.clientIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para cadastrar cartão de crédito');
            try {
                const creditCardServiceInstance = Container.get(creditCardService);
                const request: Interfaces.CreateCreditCard = {
                    mallId: +res.locals.data.mallId,
                    clientId: +res.locals.data.clientId,
                    creditCardToken: res.locals.data.creditCardToken,
                    id_payment: res.locals.client.id_payment,
                    clientPaymentId: +res.locals.client.clientPaymentId
                }
                await creditCardServiceInstance.createCreditCard(request);
                res.status(201).json({ message: "Cartão de crédito cadastrado com sucesso." });
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao cadastrar cartão de crédito: %o', e);
                return next(e);
            }
        });

    route.post('/clients/:clientId/credit-cards/:id/disable',
        middlewares.thirdPartyAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                mallId: req.query.mallId,
                clientId: req.params.clientId,
                id: req.params.id
            };
            next();
        },
        middlewares.validateInput('disableCreditCardSchema'),
        middlewares.clientIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para desabilitar cartão de crédito');
            try {
                const creditCardServiceInstance = Container.get(creditCardService);
                const request: Interfaces.DisableCreditCard = {
                    mallId: +res.locals.data.mallId,
                    clientId: +res.locals.data.clientId,
                    id: +res.locals.data.id
                }
                await creditCardServiceInstance.disableCreditCard(request);
                res.status(200).json({ message: "Cartão de crédito desabilitado com sucesso." });
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao desabilitar cartão de crédito: %o', e);
                return next(e);
            }
        });

    route.get('/clients/:clientId/credit-cards',
        middlewares.thirdPartyAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                mallId: req.query.mallId,
                clientId: req.params.clientId
            };
            next();
        },
        middlewares.validateInput('getCreditCardsSchema'),
        middlewares.clientIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para listar cartões de crédito do cliente');
            try {
                const creditCardServiceInstance = Container.get(creditCardService);
                const request: Interfaces.GetCreditCards = {
                    mallId: +res.locals.data.mallId,
                    clientId: +res.locals.data.clientId
                }
                const response = await creditCardServiceInstance.getCreditCards(request);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao listar cartões de crédito do cliente: %o', e);
                return next(e);
            }
        });
}