import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { IBankAccountDTOInput } from '../../../interfaces/IBankAccount';
import bankAccount from '../../../services/bankAccount';
import middlewares from '../../middlewares';
import config from '../../../config';

const route = Router();

export default (app: Router) => {
    app.use(config.api.payment.root + config.api.payment.version +  config.api.payment.prefix + '/bankAccount', route); 
    route.post('/create-bankAccount',        
        middlewares.validateInput('createBankAccountSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Calling POST /mos/v1/payments-management/bankAccount/create-bankAccount %o', {
                "params": req.params,
                "headers": req.headers,
                "query": req.query,
                "body": req.body
            });
            try {                
                const bankAccountInstance = Container.get(bankAccount);
                const bankAccountRequest: IBankAccountDTOInput = {
                    ...req.query,
                    ...req.body,
                    ...req.params,
                    ...req.headers                
                }
                const response = await bankAccountInstance.createBankAccount(bankAccountRequest);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Could not Create bankAccount error: %o', e);
                return next(e);
            }
        });           
    route.patch('/patch-bankAccount/:clientId',        
        middlewares.validateInput('updateBankAccountSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Calling PATCH /mos/v1/payments-management/bankAccount/delete-bankAccount %o', {
                "params": req.params,
                "headers": req.headers,
                "query": req.query,
                "body": req.body
            });
            try {                
                const bankAccountInstance = Container.get(bankAccount);
                const bankAccountRequest: IBankAccountDTOInput = {
                    ...req.query,
                    ...req.body,
                    ...req.params,
                    ...req.headers                
                }
                const response = await bankAccountInstance.updateBankAccount(bankAccountRequest);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Could not Create bankAccount error: %o', e);
                return next(e);
            }
        }); 
        
    route.get('/',        
        middlewares.validateInput('getAllBankAccountSchema'),
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
                const bankAccountInstance = Container.get(bankAccount);
                const bankAccountRequest: IBankAccountDTOInput = {
                    ...req.query,
                    ...req.body,
                    ...req.params,
                    ...req.headers                
                }
                const response = await bankAccountInstance.getAll(bankAccountRequest);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Could not Create bankAccount error: %o', e);
                return next(e);
            }
        });
}