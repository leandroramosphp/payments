import * as Interfaces from '../interfaces/ICreditCard';
import sequelize from '../loaders/sequelize';
import { QueryTypes } from 'sequelize';

export class creditCardRepository {
    async createCreditCard(creditCardData: Interfaces.CreditCardDataInput, clientPaymentId: number): Promise<void> {
        try {
            await sequelize.query(`
                INSERT INTO client_payment_credit_card (client_payment_id, id_payment, first4_digits, last4_digits, expiration_month, expiration_year, holder_name, card_brand)
                VALUES(:clientPaymentId, :idPayment, :first4Digits, :last4Digits, :expirationMonth, :expirationYear, :holderName, :cardBrand)
              `, {
                replacements: {
                    clientPaymentId: clientPaymentId,
                    idPayment: creditCardData.id,
                    first4Digits: creditCardData.first4_digits,
                    last4Digits: creditCardData.last4_digits,
                    expirationMonth: creditCardData.expiration_month,
                    expirationYear: creditCardData.expiration_year,
                    holderName: creditCardData.holder_name,
                    cardBrand: creditCardData.card_brand
                }, type: QueryTypes.INSERT
            });

            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getCreditCard(id: number, clientId: number, mallId: number): Promise<{ id_payment: string, enabled: boolean }> {
        try {
            const output: Array<{ id_payment: string, enabled: boolean }> = await sequelize.query(`
                SELECT
                    cpcc.id_payment,
                    cpcc.enabled
                FROM
                    client_payment cp
                    JOIN client_mall cm USING (client_id, mall_id)
                    LEFT JOIN client_payment_credit_card cpcc ON (cp.id = cpcc.client_payment_id AND cpcc.id = :id)
                WHERE
                    cm.client_id = :clientId
                    AND cm.mall_id = :mallId
              `, {
                replacements: {
                    clientId: clientId,
                    mallId: mallId,
                    id: id
                },
                type: QueryTypes.SELECT
            });

            return Promise.resolve(output[0]);
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async disableCreditCard(id: number): Promise<void> {
        try {
            await sequelize.query(`
              UPDATE
                client_payment_credit_card
              SET
                enabled = false
              WHERE id = :id
              `, {
                replacements: {
                    id: id
                }, type: QueryTypes.UPDATE
            });

            return Promise.resolve();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    async getCreditCards(clientId: number, mallId: number): Promise<Array<Interfaces.CreditCardDataOutput>> {
        try {
            const creditCards: Array<Interfaces.CreditCardDataOutput> = await sequelize.query(`
                SELECT
                    cpcc.id,
                    cpcc.first4_digits AS "first4Digits",
                    cpcc.last4_digits AS "last4Digits",
                    cpcc.expiration_month AS "expirationMonth",
                    cpcc.expiration_year AS "expirationYear",
                    cpcc.holder_name AS "holderName",
                    cpcc.card_brand AS "cardBrand"
                FROM
                    client_payment cp
                    JOIN client_mall cm USING (client_id, mall_id)
                    LEFT JOIN client_payment_credit_card cpcc ON (cp.id = cpcc.client_payment_id AND cpcc.enabled = true)
                WHERE
                    cm.client_id = :clientId
                    AND cm.mall_id = :mallId
              `, {
                replacements: {
                    clientId: clientId,
                    mallId: mallId
                },
                type: QueryTypes.SELECT
            });

            return Promise.resolve(creditCards);
        } catch (e) {
            return Promise.reject(e);
        }
    }
}