import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { IStoreDTOInput } from '../../../interfaces/IStore';
import store from '../../../services/store';
import middlewares from '../../middlewares';
import config from '../../../config';

const route = Router();

export default (app: Router) => {
    app.use(config.api.payment.root + config.api.payment.version +  config.api.payment.prefix + '/create-store', route); 
    route.post('/',        
        middlewares.validateInput('createStoreSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Calling POST /mos/v1/payments-management/create-store %o', {
                "params": req.params,
                "headers": req.headers,
                "query": req.query,
                "body": req.body
            });
            try {                
                const StoreInstance = Container.get(store);
                const StoreRequest: IStoreDTOInput = {
                    ...req.query,
                    ...req.body,
                    ...req.params,
                    ...req.headers                
                }
                const response = await StoreInstance.createStore(StoreRequest);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Could not Create store error: %o', e);
                return next(e);
            }
        });    
}