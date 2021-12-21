import { Service, Inject } from 'typedi';
import axios from 'axios';

import * as Interfaces from '../../interfaces/IPayment';
import config from '../../config';
import logger from '../../loaders/logger';
import prisma from '../../loaders/prisma';

@Service()
export default class paymentService {

    public createPayment = async (input: Interfaces.CreatePayment): Promise<void> => {
        try {
            logger.silly('Calling createPayment');

            /* TODO: Adicionar lógica para pagamento com cashback (Moneri) */

            const creditCard = await prisma.creditcard.findFirst({
                where: {
                    id_creditcard: input.creditCardId,
                    id_paymentsystem: input.id_paymentsystem,
                    id_client: input.clientId
                },
                select: {
                    flg_active: true,
                    cod_external: true
                }
            })

            if (!creditCard) {
                return Promise.reject({ message: "Cartão de crédito não cadastrado.", status: 400 });
            } else if (creditCard.flg_active === false) {
                return Promise.reject({ message: "Cartão de crédito desabilitado.", status: 400 });
            }

            var payments: Array<{ originId: number, value: number, externalId: string }> = [];

            const registeredPayment: { id: string } = (await axios.post(
                config.paymentApi.host + config.paymentApi.endpoints.createPayment.replace('$MARKETPLACEID', input.cod_marketplace),
                {
                    payment_type: "credit",
                    on_behalf_of: input.cod_external,
                    statement_descriptor: input.storeName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 13),
                    source: {
                        type: "card",
                        currency: "BRL",
                        usage: "single_use",
                        amount: input.value,
                        card: {
                            id: creditCard.cod_external
                        },
                        installment_plan: {
                            number_installments: input.installments
                        }
                    }
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    auth: {
                        username: config.paymentApi.username,
                        password: config.paymentApi.password
                    },
                }
            )).data;

            payments.push({
                originId: (await prisma.paymentorigin.findUnique({
                    where: {
                        nme_origin: 'creditcard'
                    },
                    select: {
                        id_paymentorigin: true
                    }
                })).id_paymentorigin,
                value: input.value,
                externalId: registeredPayment.id
            });

            const payment = await prisma.payment.create({
                data: {
                    id_client: input.clientId,
                    id_paymentsystem: input.id_paymentsystem,
                    id_store: input.storeId,
                    installments: input.installments
                }
            })

            for (const item of payments) {
                await prisma.paymentitem.create({
                    data: {
                        val_value: item.value,
                        cod_external: item.externalId,
                        id_paymentorigin: item.originId,
                        id_payment: payment.id_payment
                    }
                })
            }

            return Promise.resolve();
        }
        catch (e) {
            if (e?.response?.data?.error?.category === 'expired_card_error') {
                return Promise.reject({ message: "O cartão de crédito expirou.", status: 400 });
            }
            if (e?.response?.data?.error?.category === 'invalid_card_number') {
                return Promise.reject({ message: "O número do cartão não é um número de cartão de crédito válido.", status: 400 });
            }
            if (e?.response?.data?.error?.category === 'service_request_timeout') {
                return Promise.reject({ message: "Serviço temporariamente indisponível, tente novamente mais tarde.", status: 400 });
            }
            return Promise.reject(e);
        }
    }
}