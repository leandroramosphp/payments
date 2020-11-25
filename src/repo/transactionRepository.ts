import sequelize from '../loaders/sequelize';
import { QueryTypes } from 'sequelize';

export class transactionRepository {
    async createTransaction(clientPaymentId: number, storePaymentId: number, installments: number, transactions: Array<{ origin: string, value: number, externalId: string }>): Promise<void> {
        try {
            return await sequelize.transaction(async function (t) {
                const transaction: { id: number } = (await sequelize.query(`
                    INSERT INTO payment (client_payment_id, store_payment_id, installments)
                    VALUES(:clientPaymentId, :storePaymentId, :installments)
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
                        SELECT id, :value, :paymentId, :externalId
                        FROM payment_origin
                        WHERE name = :origin
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
}