import { Service, Inject } from 'typedi';
import * as Interfaces from '../interfaces/IPayment';
import axios from 'axios';
import config from '../config';
import paymentModel from '../business/payment';
import creditCardModel from '../business/creditCard';

@Service()
export default class paymentService {
    private _paymentController: paymentModel;
    private _creditCardController: creditCardModel;
    constructor(
        @Inject('logger') private logger: any
    ) {
        this._paymentController = new paymentModel();
        this._creditCardController = new creditCardModel();
    }

    public createPayment = async (input: Interfaces.CreatePayment): Promise<void> => {
        try {
            this.logger.silly('Calling createPayment');

            /* TODO: Adicionar lógica para pagamento com cashback (Moneri) */

            const creditCard = await this._creditCardController.getCreditCard(input.creditCardId, input.clientId, input.mallId);

            if (!creditCard) {
                return Promise.reject({ message: "Cartão de crédito não cadastrado.", status: 400 });
            } else if (creditCard.enabled === false) {
                return Promise.reject({ message: "Cartão de crédito desabilitado.", status: 400 });
            }

            var payments: Array<{ origin: string, value: number, externalId: string }> = [];

            const payment: { id: string } = (await axios.post(
                config.PaymentsApi.host + config.PaymentsApi.endpoints.createPayment,
                {
                    payment_type: "credit",
                    on_behalf_of: input.id_payment,
                    statement_descriptor: input.storeName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 13),
                    source: {
                        type: "card",
                        currency: "BRL",
                        usage: "single_use",
                        amount: input.value,
                        card: {
                            id: creditCard.id_payment
                        },
                        installment_plan: {
                            number_installments: input.installments || 1
                        }
                    }
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    auth: {
                        username: config.PaymentsApi.username,
                        password: config.PaymentsApi.password
                    },
                }
            )).data;

            payments.push({
                origin: 'creditcard',
                value: input.value,
                externalId: payment.id
            });

            await this._paymentController.createPayment(input.clientPaymentId, input.id_payment, input.installments, payments);

            return Promise.resolve();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }

    public acceptPayment = async (input: Interfaces.AcceptPayment): Promise<void> => {
        try {
            this.logger.silly('Calling acceptPayment');

            const isAccepted = await this._paymentController.acceptPayment(input.id, input.invoiceNumber);
            if (!isAccepted) {
                return Promise.reject({ message: "Pagamento não existente ou já aprovado/rejeitado.", status: 400 });
            }
            return Promise.resolve();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }

    public rejectPayment = async (input: Interfaces.RejectPayment): Promise<void> => {
        try {
            this.logger.silly('Calling rejectPayment');

            const paymentData = await this._paymentController.getPendingPayment(input.id);

            if (!paymentData.length) {
                return Promise.reject({ message: "Pagamento não existente ou já aprovado/rejeitado.", status: 400 });
            }

            for (let i = 0; i < paymentData.length; i++) {
                switch (paymentData[i].origin) {
                    case 'creditcard':
                        await axios.post(
                            config.PaymentsApi.host + config.PaymentsApi.endpoints.reversePayment
                                .replace('{transaction_id}', paymentData[i].externalId),
                            {
                                on_behalf_of: input.id_payment,
                                amount: paymentData[i].value
                            },
                            {
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                auth: {
                                    username: config.PaymentsApi.username,
                                    password: config.PaymentsApi.password
                                },
                            }
                        );
                        break;
                    case 'cashback':
                        /* TODO: Implementar lógica para estorno de cashback */
                        break;
                    default:
                        break;
                }
            }
            const isRejected = Promise.resolve(await this._paymentController.rejectPayment(input.id));

            if (!isRejected) {
                return Promise.reject({ message: "Pagamento não existente ou já aprovado/rejeitado.", status: 400 });
            }
            return Promise.resolve();
        }
        catch (e) {
            if (e?.response?.data?.error?.message === 'Transactions with status canceled and with confirmed flag setted to 1 are not voidable') {
                return Promise.reject({ message: "Pagamento já foi estornado na API externa.", status: 400 });
            }
            if (e?.response?.data?.error?.type === 'invalid_request_error') {
                return Promise.reject({ message: "Tentativa de estornar valor maior que o valor original na API externa.", status: 400 });
            }
            return Promise.reject(e);
        }
    }

    public getAllPayments = async (input: Interfaces.GetAllPaymentsInput): Promise<{ data: Array<Interfaces.GetAllPaymentsOutput>, total: number }> => {
        try {
            this.logger.silly('Calling getAllPayments');

            return await this._paymentController.getAllPayments(input);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}