import { Service, Inject } from 'typedi';
import axios from 'axios';

import * as Interfaces from '../../interfaces/IPayment';
import config from '../../config';
import logger from '../../loaders/logger';
import prisma from '../../loaders/prisma';

@Service()
export default class paymentService {

    public acceptPayment = async (input: Interfaces.AcceptPayment): Promise<void> => {
        try {
            logger.silly('Calling acceptPayment');

            const isAccepted = await prisma.payment.updateMany({
                data: {
                    invoicenumber: input.invoiceNumber
                },
                where: {
                    id_payment: input.id,
                    id_store: +input.storeId,
                    id_paymentsystem: input.id_paymentsystem
                }
            })

            if (isAccepted.count === 0) {
                return Promise.reject({ message: "Pagamento não existente.", status: 400 });
            }

            return Promise.resolve();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }

    public rejectPayment = async (input: Interfaces.RejectPayment): Promise<void> => {
        try {
            logger.silly('Calling rejectPayment');

            const paymentItems = await prisma.paymentitem.findMany({
                where: {
                    id_payment: input.id,
                    payment: {
                        id_paymentsystem: input.id_paymentsystem,
                        status: 'succeeded',
                        id_store: +input.storeId
                    }
                },
                select: {
                    paymentorigin: {
                        select: {
                            nme_origin: true
                        }
                    },
                    cod_external: true,
                    val_value: true
                }
            })

            if (!paymentItems.length) {
                return Promise.reject({ message: "Pagamento não existente ou já rejeitado.", status: 400 });
            }

            for (let i = 0; i < paymentItems.length; i++) {
                switch (paymentItems[i].paymentorigin.nme_origin) {
                    case 'creditcard':
                        await axios.post(
                            config.paymentApi.host + config.paymentApi.endpoints.reversePayment.replace('$MARKETPLACEID', input.cod_marketplace)
                                .replace('{transaction_id}', paymentItems[i].cod_external),
                            {
                                on_behalf_of: input.cod_external,
                                amount: Math.ceil(+paymentItems[i].val_value * 100)
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
                        );
                        break;
                    case 'cashback':
                        /* TODO: Implementar lógica para estorno de cashback */
                        break;
                    default:
                        break;
                }
            }

            const isRejected = await prisma.payment.updateMany({
                data: {
                    status: 'refunded'
                },
                where: {
                    id_payment: input.id,
                    status: 'succeeded',
                    id_store: +input.storeId,
                    id_paymentsystem: input.id_paymentsystem
                }
            })

            if (isRejected.count === 0) {
                return Promise.reject({ message: "Pagamento não existente ou já rejeitado.", status: 400 });
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

    public getAllPaymentsItems = async (input: Interfaces.GetAllPaymentItemsInput): Promise<{ data: Array<Interfaces.GetAllPaymentsItemsOutput>, total: number }> => {
        try {
            logger.silly('Calling getAllPaymentsItems');

            let sortBy: string = {
                "id": "id",
                "createdAt": "createdAt",
                "clientName": "clientName",
                "storeName": "storeName",
                "invoiceNumber": "invoiceNumber",
                "value": "value",
                "origin": "origin"
            }[input.sortBy];

            sortBy = !input.sortBy ? "createdAt" : sortBy[input.sortBy]

            let store = ``;
            let client = ``;
            let limit = ``;
            let page = ``;
            let search = ``;
            let startDateTime = ``;
            let endDateTime = ``;
            let origin = ``;
            let status = ``;
            let orderBy = `ORDER BY "createdAt" DESC`;

            if (input.sortBy && input.order !== null) {
                orderBy = `ORDER BY ${sortBy} ${input.order}`
            }

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

            if (input.origin) {
                origin = `
                    AND po.nme_origin = '${input.origin}'
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
                        pi.id_paymentitem AS id,
                        p.created_at AS "createdAt",
                        c.full_name AS "clientName",
                        p.invoicenumber AS "invoiceNumber",
                        s.name AS "storeName",
                        po.nme_origin AS "origin",
                        pi.val_value AS value
                    FROM
                        paymentitem pi
                        JOIN paymentorigin po USING (id_paymentorigin)
                        JOIN payment p USING (id_payment)
                        JOIN paymentsystem_client psc USING (id_client, id_paymentsystem)
                        JOIN paymentsystem_store pss USING (id_store, id_paymentsystem)
                        JOIN client c ON (c.id = psc.id_client)
                        JOIN store s ON (s.id = pss.id_store)
                    WHERE
                        p.id_paymentsystem = ${input.id_paymentsystem}
                        ${store}
                        ${client}
                        ${startDateTime}
                        ${endDateTime}
                        ${origin}
                        ${status}
                        ${search}
                    GROUP BY
                        1, 2, 3, 4, 5, 6, 7
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
}