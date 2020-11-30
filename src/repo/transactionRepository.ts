import * as Interfaces from '../interfaces/ITransaction';
import sequelize from '../loaders/sequelize';
import { QueryTypes } from 'sequelize';

export class transactionRepository {
    async createTransaction(clientPaymentId: number, storePaymentId: string, installments: number, transactions: Array<{ origin: string, value: number, externalId: string }>): Promise<void> {
        try {
            return await sequelize.transaction(async function (t) {
                const transaction: { id: number } = (await sequelize.query(`
                    INSERT INTO payment (client_payment_id, external_store_payment_id, installments)
                    SELECT :clientPaymentId, id, :installments
                    FROM external_store_payment esp
                    WHERE id_payment = :storePaymentId
                    RETURNING id
                `, {
                    replacements: {
                        clientPaymentId: clientPaymentId,
                        storePaymentId: storePaymentId,
                        installments: installments
                    }, type: QueryTypes.INSERT, transaction: t
                }))[0][0];
                for (let i = 0; i < transactions.length; i++) {
                    await sequelize.query(`
                        INSERT INTO payment_item (origin, value, payment_id, external_id)
                        VALUES (:origin, :value, :paymentId, :externalId)
                    `, {
                        replacements: {
                            value: transactions[i].value,
                            paymentId: transaction.id,
                            externalId: transactions[i].externalId,
                            origin: transactions[i].origin
                        }, type: QueryTypes.INSERT, transaction: t
                    });
                }
                return Promise.resolve();
            })
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async acceptTransaction(id: number, invoiceNumber: string): Promise<number> {
        try {
            const isAccepted: number = (await sequelize.query(`
                    UPDATE payment
                    SET status = 'succeeded', invoice_number = :invoiceNumber
                    WHERE status = 'pending' AND id = :id
                `, {
                replacements: {
                    id: id,
                    invoiceNumber: invoiceNumber
                }, type: QueryTypes.UPDATE
            }))[1];
            return Promise.resolve(isAccepted);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async rejectTransaction(id: number): Promise<number> {
        try {
            const isAccepted: number = (await sequelize.query(`
                    UPDATE payment
                    SET status = 'refunded'
                    WHERE status = 'pending' AND id = :id
                `, {
                replacements: {
                    id: id
                }, type: QueryTypes.UPDATE
            }))[1];
            return Promise.resolve(isAccepted);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getPendingTransaction(id: number): Promise<Array<{ externalId: string, origin: string, value: number }>> {
        try {
            return await sequelize.transaction(async function (t) {
                return await sequelize.query(`
                        SELECT
                            pi.external_id as "externalId",
                            pi.origin,
                            pi.value
                        FROM
                            payment p
                            JOIN payment_item pi ON (p.id = pi.payment_id)
                        WHERE p.id = :id AND status = 'pending'
                    `, {
                    replacements: {
                        id: id
                    }, type: QueryTypes.SELECT
                });
            });
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getAllTransactions(input: Interfaces.GetAllTransactionsInput): Promise<{ data: Array<Interfaces.GetAllTransactionsOutput>, total: number }> {
        try {
            let limit = ``;
            let page = ``;
            let search = ``;
            let startDate = ``;
            let endDate = ``;
            let origin = ``;
            let status = ``;
            let orderBy = `ORDER BY "createdAt" DESC`;

            if (input.column != null && input.order != null) {
                if (input.column >= 0 && input.column <= 5) {
                    orderBy = `ORDER BY ${input.column + 1} ${input.order}`
                }
            }

            if (input.limit) {
                limit = `LIMIT :limit`;
            }

            if (input.page && input.limit) {
                page = `OFFSET (:page * :limit)`;
            }

            if (input.search) {
                search = `
                    AND (
                        UNACCENT(c.full_name) ILIKE UNACCENT(:search)
                    )`
            }

            if (input.startDate) {
                startDate = `
                    AND p.created_at::DATE >= :startDate
                `;
            }

            if (input.endDate) {
                endDate = `
                    AND p.created_at::DATE <= :endDate
                `;
            }

            if (input.origin) {
                origin = `
                    AND pi.origin = :origin
                `;
            }

            if (input.status) {
                status = `
                    AND p.status = :status
                `;
            }

            const transactions: Array<Interfaces.GetAllTransactionsOutput & { total: string }> = await sequelize.query(`
                WITH result AS (
                    SELECT
                        p.id,
                        p.created_at AS "createdAt",
                        c.full_name AS "clientName",
                        p.installments,
                        p.status,
                        SUM(pi.value) AS value
                    FROM
                        external_store_payment esp
                        JOIN store_payment sp ON (esp.id = sp.id_payment)
                        JOIN store s ON (sp.store_id = s.id)
                        JOIN payment p ON (esp.id = p.external_store_payment_id)
                        JOIN payment_item pi ON (p.id = pi.payment_id)
                        JOIN client_payment cp ON (p.client_payment_id = cp.id)
                        JOIN client c ON (cp.client_id = c.id)
                    WHERE
                        s.id = :storeId
                        AND s.mall_id = :mallId
                        ${startDate}
                        ${endDate}
                        ${origin}
                        ${status}
                        ${search}
                    GROUP BY
                        1,
                        2,
                        3,
                        4,
                        5
                )
                SELECT
                    *
                FROM (
                    TABLE result
                    ${orderBy}
                    ${limit}
                    ${page}
                ) result_paginated
                JOIN (SELECT COUNT(value) AS total FROM result) AS total ON true
              `, {
                replacements: {
                    storeId: input.storeId,
                    mallId: input.mallId,
                    limit: input.limit,
                    page: input.page,
                    search: '%' + input.search + '%',
                    startDate: input.startDate,
                    endDate: input.endDate,
                    origin: input.origin,
                    status: input.status
                }, type: QueryTypes.SELECT
            });
            return Promise.resolve({
                data: transactions.map(({ total, ...item }) => item),
                total: (transactions.length) ? +transactions[0].total : 0
            });
        } catch (e) {
            return Promise.reject(e);
        }
    }
}