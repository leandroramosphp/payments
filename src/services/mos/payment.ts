import { Service, Inject } from 'typedi';
import axios from 'axios';

import * as Interfaces from '../../interfaces/IPayment';
import config from '../../config';
import logger from '../../loaders/logger';
import prisma from '../../loaders/prisma';
import moment from 'moment';

@Service()
export default class paymentService {

    public createPayment = async (input: Interfaces.CreatePayment): Promise<void> => {
        try {
            logger.silly('Calling createPayment');

            /* Executar tarefa de deduplicação para verificar se pagamento é duplicado (Duplicado = Transação no último minuto com mesmo valor, loja e cliente) */
            const duplicate = await this.paymentDeduplication({ clientId: input.clientId, storeId: input.storeId, value: input.value });

            if (duplicate) {
                /* Caso pagamento seja duplicado, responder com sucesso mas não criar pagamento */
                return Promise.resolve();
            }

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
                        amount: Math.ceil(input.value * 100),
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
                },
                select: {
                    id_payment: true,
                    paymentsystem_client: {
                        select: {
                            client: {
                                select: {
                                    cpf: true
                                }
                            }
                        }
                    },
                    paymentsystem_store: {
                        select: {
                            store: {
                                select: {
                                    cnpj: true
                                }
                            }
                        }
                    }
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

            if (config.promocao.login) {
                await axios.post(config.promocao.host, {
                    "cpf": payment.paymentsystem_client.client.cpf,
                    "cnpj": payment.paymentsystem_store.store.cnpj,
                    "data": moment.utc().format('YYYY-MM-DD'),
                    "numero": payment.id_payment.toString(),
                    "valor": input.value,
                    "codOrigemNota": 1,
                    "obj": "NOTAFISCAL",
                    "codigoMobits": payment.id_payment.toString()
                }, {
                    auth: {
                        username: config.promocao.login,
                        password: config.promocao.password
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

    public getAllPayments = async (input: Interfaces.GetAllPaymentsInput): Promise<{ data: Array<Interfaces.GetAllPaymentsOutput>, total: number }> => {
        try {
            logger.silly('Calling getAllPayments');
            const sortBy: string = {
                "id": "id",
                "createdAt": "createdAt",
                "clientName": "clientName",
                "storeName": "storeName",
                "installments": "installments",
                "invoiceNumber": "invoiceNumber",
                "status": "status",
                "value": "value"
            }[input.sortBy];

            let store = ``;
            let client = ``;
            let limit = ``;
            let page = ``;
            let search = ``;
            let startDateTime = ``;
            let endDateTime = ``;
            let status = ``;
            let orderBy = ``;

            orderBy = `ORDER BY ${sortBy || '"createdAt"'} ${input.order || 'DESC'}`

            if (input.limit) {
                limit = `LIMIT ${input.limit || input.limitByPage}`;
            }

            if (input.page && input.limit) {
                page = `OFFSET (${(input.page > 0) ? input.page - 1 : 0} * ${input.limit || input.limitByPage})`;
            }

            if (input.search) {
                search = `
                    AND (
                        UNACCENT(c.full_name) ILIKE UNACCENT('%${input.search}%')
                        OR UNACCENT(p.invoicenumber) ILIKE UNACCENT('%${input.search}%')
                        OR UNACCENT(s.name) ILIKE UNACCENT('%${input.search}%')
                    )`
            }

            if (input.startDateTime) {
                startDateTime = `
                    AND p.created_at >= '${input.startDateTime}'
                `;
            }

            if (input.endDateTime) {
                endDateTime = `
                    AND p.created_at <= '${input.endDateTime}'
                `;
            }

            if (input.status) {
                status = `
                    AND p.status = '${input.status}'
                `;
            }

            if (input.storeId) {
                store = `
                    AND p.id_store = ${input.storeId}
                `;
            }

            if (input.clientId) {
                client = `
                    AND p.id_client = ${input.clientId}
                `;
            }

            const query: {
                total: number,
                id: number,
                createdAt: string,
                clientName: string,
                storeName: string,
                installments: number,
                invoiceNumber: string,
                status: string,
                value: number
            }[] = await prisma.$queryRaw(`
                WITH result AS (
                    SELECT
                        p.id_payment AS id,
                        p.created_at AS "createdAt",
                        c.full_name AS "clientName",
                        s.name AS "storeName",
                        p.installments,
                        p.invoicenumber AS "invoiceNumber",
                        p.status,
                        SUM(pi.val_value) AS value
                    FROM
                        payment p
                        JOIN paymentitem pi USING (id_payment)
                        JOIN paymentsystem_client psc USING (id_client, id_paymentsystem)
                        JOIN client c ON (c.id = psc.id_client)
                        JOIN paymentsystem_store pss USING (id_store, id_paymentsystem)
                        JOIN store s ON (s.id = pss.id_store)
                    WHERE
                        p.id_paymentsystem = ${input.id_paymentsystem}
                        ${store}
                        ${client}
                        ${startDateTime}
                        ${endDateTime}
                        ${status}
                        ${search}
                    GROUP BY
                        1, 2, 3, 4, 5
                )
                SELECT
                    *
                FROM (
                    TABLE result
                    ${orderBy}
                    ${limit}
                    ${page}
                ) result_paginated
                JOIN (SELECT COUNT(*) AS total FROM result) AS total ON true
            `);

            return Promise.resolve({
                data: query.map(({ total, ...item }) => item),
                total: (query.length) ? +query[0].total : 0
            });
        }
        catch (e) {
            return Promise.reject(e);
        }
    }

    public paymentDeduplication = async (input: { value: number, clientId: number, storeId: number }) => {
        var duplicateFlag = false;
        const duplicatePayment = await prisma.paymentitem.findFirst({
            where: {
                val_value: input.value.toFixed(2),
                payment: {
                    id_client: input.clientId,
                    id_store: input.storeId,
                    created_at: {
                        gte: moment().subtract(1, 'minute').toDate()
                    }
                }
            }
        })
        if (duplicatePayment) {
            duplicateFlag = true;
        }
        return duplicateFlag;
    }
}