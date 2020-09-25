import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import { ISendEmail, IWebHookEmail } from '../../interfaces/IEmail';
import emailService from '../../services/email/';
import middlewares from '../middlewares';

const route = Router();

export default (app: Router) => {
    app.use(route);
    route.post('/send-email',
        middlewares.validateInput('sendEmailSchema'),
        async (req: Request, res: Response, next: NextFunction) => {
            const logger = Container.get('logger');
            // @ts-ignore
            logger.debug('Calling POST /communication-management/send-email: with: %o', {
                "params": req.params,
                "headers": req.headers,
                "query": req.query,
                "body": req.body
            });
            try {
                const emailServiceInstance = Container.get(emailService);
                const communicationRequest: ISendEmail = {
                    ...req.query,
                    ...req.body
                }
                res.status(200).json({ message: "Mensagens programadas para envio." });
                const response = await emailServiceInstance.sendEmail(communicationRequest);
                console.log(response);
            } catch (e) {
                // @ts-ignore
                logger.error('🔥 Error calling POST /communication-management/send-email: %o', e);
                return next(e);
            }

        });
}