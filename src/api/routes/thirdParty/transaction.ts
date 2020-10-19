import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { ITransactionDTOInput } from '../../../interfaces/ITransaction';
import transaction from '../../../services/transaction';
import middlewares from '../../middlewares';
import config from '../../../config';

const route = Router();

export default (app: Router) => {
    app.use(config.api.thirdParty.root + '/transaction', route); 
    route.post('/create-transaction',        
        middlewares.validateInput('createTransactionSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Calling POST /mos/v1/payments-management/transaction/create-transaction %o', {
                "params": req.params,
                "headers": req.headers,
                "query": req.query,
                "body": req.body
            });
            try {                
                const transactionInstance = Container.get(transaction);
                const transactionRequest: ITransactionDTOInput = {
                    ...req.query,
                    ...req.body,
                    ...req.params,
                    ...req.headers                
                }
                const response = await transactionInstance.createTransaction(transactionRequest);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Could not Create transaction error: %o', e);
                return next(e);
            }
        });           
    route.patch('/patch-transactionReverse/:clientId',        
        middlewares.validateInput('updateTransactionReverseSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore            
            logger.debug('Calling PATCH /mos/v1/payments-management/transaction/delete-transaction %o', {
                "params": req.params,
                "headers": req.headers,
                "query": req.query,
                "body": req.body
            });
            try {                
                const transactionInstance = Container.get(transaction);
                const transactionRequest: ITransactionDTOInput = {
                    ...req.query,
                    ...req.body,
                    ...req.params,
                    ...req.headers                
                }
                const response = await transactionInstance.updateTransaction(transactionRequest);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Could not Create transaction error: %o', e);
                return next(e);
            }
        }); 
        
    route.patch('/patch-transactionApprove/:clientId',        
        middlewares.validateInput('updateTransactionApproveSchema'),
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
                const transactionInstance = Container.get(transaction);
                const transactionRequest: ITransactionDTOInput = {
                    ...req.query,
                    ...req.body,
                    ...req.params,
                    ...req.headers                
                }
                const response = await transactionInstance.updateTransactionApprove(transactionRequest);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Could not Create transaction error: %o', e);
                return next(e);
            }
        });

    route.get('/',
        middlewares.validateInput('getAllTransactionSchema'),
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
                const transactionInstance = Container.get(transaction);
                const transactionRequest: ITransactionDTOInput = {
                    ...req.query,
                    ...req.body,
                    ...req.params,
                    ...req.headers                
                }
                const response = await transactionInstance.getAllTransaction(transactionRequest);
                res.status(200).json(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Could not Create transaction error: %o', e);
                return next(e);
            }
        });
}