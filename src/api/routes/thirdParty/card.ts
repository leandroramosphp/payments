import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { ICardDTOInput } from '../../../interfaces/ICard';
import card from '../../../services/card';
import middlewares from '../../middlewares';
import config from '../../../config';

const route = Router();

export default (app: Router) => {
    app.use(config.api.thirdParty.root + '/card', route); 
    route.post('/create-card',        
        middlewares.validateInput('createCardSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Calling POST /mos/v1/payments-management/card/create-card %o', {
                "params": req.params,
                "headers": req.headers,
                "query": req.query,
                "body": req.body
            });
            try {                
                const cardInstance = Container.get(card);
                const cardRequest: ICardDTOInput = {
                    ...req.query,
                    ...req.body,
                    ...req.params,
                    ...req.headers                
                }
                const response = await cardInstance.createCard(cardRequest);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Could not Create card error: %o', e);
                return next(e);
            }
        });           
    route.delete('/delete-card/:clientId',        
        middlewares.validateInput('deleteCardSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Calling POST /mos/v1/payments-management/card/delete-card %o', {
                "params": req.params,
                "headers": req.headers,
                "query": req.query,
                "body": req.body
            });
            try {                
                const cardInstance = Container.get(card);
                const cardRequest: ICardDTOInput = {
                    ...req.query,
                    ...req.body,
                    ...req.params,
                    ...req.headers                
                }
                const response = await cardInstance.deleteCard(cardRequest);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Could not Create card error: %o', e);
                return next(e);
            }
        }); 
        
    route.get('/',        
        middlewares.validateInput('getAllCardSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Calling POST /mos/v1/payments-management/getAll %o', {
                "params": req.params,
                "headers": req.headers,
                "query": req.query,
                "body": req.body
            });
            try {                
                const cardInstance = Container.get(card);
                const cardRequest: ICardDTOInput = {
                    ...req.query,
                    ...req.body,
                    ...req.params,
                    ...req.headers                
                }
                const response = await cardInstance.getAll(cardRequest);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Could not Create card error: %o', e);
                return next(e);
            }
        });
}