import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as Interfaces from '../../../interfaces/IClient';
import clientService from '../../../services/client';
import middlewares from '../../middlewares';

export default (route: Router) => {
    route.post('/clients/:clientId/register',
        middlewares.internalAuth(),
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                mallId: req.query.mallId,
                clientId: req.params.clientId
            };
            next();
        },
        middlewares.validateInput('createClientSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore
            logger.debug('Chamando endpoint para cadastro de comprador');
            try {
                const clientServiceInstance = Container.get(clientService);
                const request: Interfaces.CreateClient = {
                    mallId: +res.locals.data.mallId,
                    clientId: +res.locals.data.clientId
                }
                await clientServiceInstance.createClient(request);
                res.status(201).json({ message: "Cliente registrado com sucesso." });
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Falha ao cadastrar comprador: %o', e);
                return next(e);
            }
        });
}