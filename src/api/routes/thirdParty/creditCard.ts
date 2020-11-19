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
                /* TODO: Adicionar parâmetros para validação */
            };
            next();
        },
        middlewares.validateInput('createCreditCardSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para cadastrar cartão de crédito');
            try {
                const creditCardServiceInstance = Container.get(creditCardService);
                const request: Interfaces.CreateCreditCard = {
                    /* TODO: Adicionar parâmetros para executar serviço */
                }
                await creditCardServiceInstance.createCreditCard(request);
                res.status(201).json({ message: "Cartão de crédito cadastrado com sucesso." });
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao cadastrar cartão de crédito: %o', e);
                return next(e);
            }
        });

    route.post('/clients/:clientId/credit-cards/:creditCardId/disable',
        middlewares.thirdPartyAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                /* TODO: Adicionar parâmetros para validação */
            };
            next();
        },
        middlewares.validateInput('disableCreditCardSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para desabilitar cartão de crédito');
            try {
                const creditCardServiceInstance = Container.get(creditCardService);
                const request: Interfaces.DisableCreditCard = {
                    /* TODO: Adicionar parâmetros para executar serviço */
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
                /* TODO: Adicionar parâmetros para validação */
            };
            next();
        },
        middlewares.validateInput('getAllCreditCardsSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Chamando endpoint para listar cartões de crédito do cliente');
            try {
                const creditCardServiceInstance = Container.get(creditCardService);
                const request: Interfaces.GetAllCreditCards = {
                    /* TODO: Adicionar parâmetros para executar serviço */
                }
                const response = await creditCardServiceInstance.getAllCreditCards(request);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao listar cartões de crédito do cliente: %o', e);
                return next(e);
            }
        });
}