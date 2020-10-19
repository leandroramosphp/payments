import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { IAccountBallanceDTOInput } from '../../../interfaces/IAccountBallance';
import accountBallance from '../../../services/AccountBallance';
import middlewares from '../../middlewares';
import config from '../../../config';

const route = Router();

export default (app: Router) => {
    app.use(config.api.payment.root + config.api.payment.version +  config.api.payment.prefix + '/accountBallance', route); 
    route.post('/create-accountBallance',        
        middlewares.validateInput('createAccountBallanceSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Calling POST /mos/v1/payments-management/accountBallance/create-accountBallance %o', {
                "params": req.params,
                "headers": req.headers,
                "query": req.query,
                "body": req.body
            });
            try {                
                const accountBallanceInstance = Container.get(accountBallance);
                const accountBallanceRequest: IAccountBallanceDTOInput = {
                    ...req.query,
                    ...req.body,
                    ...req.params,
                    ...req.headers                
                }
                const response = await accountBallanceInstance.createAccountBallance(accountBallanceRequest);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Could not Create accountBallance error: %o', e);
                return next(e);
            }
        });           
    route.get('/:clientId',
        middlewares.validateInput('getAccountBallanceSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Calling GET /mos/v1/payments-management/accountBallance/delete-accountBallance %o', {
                "params": req.params,
                "headers": req.headers,
                "query": req.query,
                "body": req.body
            });
            try {                
                const accountBallanceInstance = Container.get(accountBallance);
                const accountBallanceRequest: IAccountBallanceDTOInput = {
                    ...req.query,
                    ...req.body,
                    ...req.params,
                    ...req.headers                
                }
                const response = await accountBallanceInstance.getAccountBallance(accountBallanceRequest);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Could not Create accountBallance error: %o', e);
                return next(e);
            }
        }); 
        
    route.get('/',        
        middlewares.validateInput('getAllAccountBallanceSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Calling GET /mos/v1/payments-management/getAll %o', {
                "params": req.params,
                "headers": req.headers,
                "query": req.query,
                "body": req.body
            });
            try {                
                const accountBallanceInstance = Container.get(accountBallance);
                const accountBallanceRequest: IAccountBallanceDTOInput = {
                    ...req.query,
                    ...req.body,
                    ...req.params,
                    ...req.headers                
                }
                const response = await accountBallanceInstance.getAll(accountBallanceRequest);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Could not Create accountBallance error: %o', e);
                return next(e);
            }
        });
}