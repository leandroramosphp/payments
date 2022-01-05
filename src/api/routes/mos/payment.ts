import { Router, Request, Response, NextFunction } from 'express';
import { Container } from 'typedi';
import * as Interfaces from '../../../interfaces/IPayment';
import paymentService from '../../../services/mos/payment';
import mosStorepaymentService from '../../../services/mosStore/payment';
import middlewares from '../../middlewares';
import logger from '../../../loaders/logger';
import config from '../../../config';

const route = Router();


export default (app: Router) => {
    route.post('/',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                storeId: req.body.storeId,
                clientId: req.body.clientId,
                mallId: req.query.mallId,
                value: req.body.value.toString(),
                installments: req.body.installments,
                creditCardId: req.body.creditCardId
            };
            next();
        },
        middlewares.decoder,
        middlewares.authRequest(false),
        middlewares.validateInput('createPaymentMosSchema'),
        middlewares.paymentSystemIntegration(),
        middlewares.storeIntegration(),
        middlewares.clientIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para criar pagamento');
            try {
                const paymentServiceInstance = Container.get(paymentService);
                const request: Interfaces.CreatePayment = {
                    storeId: +res.locals.data.storeId,
                    clientId: res.locals.data.clientId,
                    mallId: +res.locals.data.mallId,
                    value: +res.locals.data.value,
                    installments: +res.locals.data.installments,
                    creditCardId: +res.locals.data.creditCardId,
                    storeName: res.locals.store.name,
                    id_paymentsystem: +res.locals.store.id_paymentsystem,
                    cod_external: res.locals.store.cod_external,
                    cod_marketplace: res.locals.store.cod_marketplace
                }
                await paymentServiceInstance.createPayment(request);
                res.status(201).json({ message: "Pagamento cadastrado com sucesso." });
            } catch (e) {
                logger.error('🔥 Falha ao criar pagamento: %o', e);
                return next(e);
            }
        });
    route.get('/',
        async (req: Request, res: Response, next: NextFunction) => {
            res.locals.data = {
                clientId: req.query.clientId,
                mallId: req.query.mallId,
                storeId: req.query.storeId,
                status: req.query.status,
                startDateTime: req.query.startDateTime,
                endDateTime: req.query.endDateTime,
                search: req.query.search,
                limit: req.query.limit,
                limitByPage: req.query.limitByPage,
                page: req.query.page,
                sortBy: req.query.sortBy,
                order: req.query.order
            };
            next();
        },
        middlewares.decoder,
        middlewares.authRequest(false),
        middlewares.validateInput('getAllPaymentsMosSchema'),
        middlewares.paymentSystemIntegration(),
        middlewares.storeIntegration(),
        middlewares.clientIntegration(),
        async (req: Request, res: Response, next: NextFunction) => {
            logger.debug('Chamando endpoint para buscar todas os pagamentos do lojista');
            try {
                const paymentServiceInstance = Container.get(paymentService);
                const request: Interfaces.GetAllPaymentsInput = {
                    clientId: +res.locals.data.clientId,
                    mallId: +res.locals.data.mallId,
                    storeId: +res.locals.data.storeId,
                    status: res.locals.data.status,
                    startDateTime: res.locals.data.startDateTime,
                    endDateTime: res.locals.data.endDateTime,
                    search: res.locals.data.search,
                    limit: +res.locals.data.limit,
                    limitByPage: +res.locals.data.limitByPage,
                    page: +res.locals.data.page,
                    sortBy: +res.locals.data.sortBy,
                    order: res.locals.data.order,
                    id_paymentsystem: (res.locals.store) ? +res.locals.store.id_paymentsystem : +res.locals.client.id_paymentsystem
                }
                const response = await paymentServiceInstance.getAllPayments(request);
                res.status(200).json(response);
            } catch (e) {
                logger.error('🔥 Falha ao buscar pagamentos do lojista: %o', e);
                return next(e);
            }
        });
    app.use(config.apiMos.root + config.apiMos.version + config.apiMos.prefix + '/payments', route);
}