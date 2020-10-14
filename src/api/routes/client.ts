import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { IClientDTOInput } from '../../interfaces/IClient';
import Client from '../../services/client';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
    app.use('/create-client', route); 
    route.post('/',        
        middlewares.validateInput('createClientSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Calling POST /mos/v1/payments-management/create-client %o', {
                "params": req.params,
                "headers": req.headers,
                "query": req.query,
                "body": req.body
            });
            try {                
                const ClientInstance = Container.get(Client);
                const ClientRequest: IClientDTOInput = {
                    ...req.query,
                    ...req.body,
                    ...req.params,
                    ...req.headers                
                }
                const response = await ClientInstance.createClient(ClientRequest);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Could not Create Client error: %o', e);
                return next(e);
            }
        });    
}