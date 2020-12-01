import sequelize from '../loaders/sequelize';
import { QueryTypes, UniqueConstraintError } from 'sequelize';

export class storeRepository {
  async getStore(input: { storeId: number, mallId: number }): Promise<{ cnpj: string, id_payment: string, name: string, storePaymentId: number }> {
    try {
      const output: Array<{ cnpj: string, id_payment: string, name: string, storePaymentId: number }> = await sequelize.query(`
        SELECT
          cnpj,
          esp.id_payment,
          s.name,
          sp.id AS "storePaymentId"
        FROM
          store s
          LEFT JOIN store_payment sp ON (s.id = sp.store_id)
          LEFT JOIN external_store_payment esp ON (sp.id_payment = esp.id)
        WHERE
          s.id = :storeId
          AND s.mall_id = :mallId
      `, {
        replacements: {
          storeId: input.storeId,
          mallId: input.mallId
        }, type: QueryTypes.SELECT
      });

      return Promise.resolve(output[0]);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async checkDupStore(cnpj: string): Promise<{ id_payment: string, mall_id: number }> {
    try {
      const output: Array<{ id_payment: string, mall_id: number }> = await sequelize.query(`
        SELECT
          esp.id_payment,
          s.mall_id
        FROM
          store s
          JOIN store_payment sp ON (s.id = sp.store_id)
          JOIN external_store_payment esp ON (sp.id_payment = esp.id)
        WHERE
          s.cnpj = :cnpj
      `, {
        replacements: {
          cnpj: cnpj
        }, type: QueryTypes.SELECT
      });

      return Promise.resolve(output[0]);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async registerStore(idPayment: string, storeId: number): Promise<void> {
    try {
      return await sequelize.transaction(async function (t) {
        const externalStorePayment: { id: number } = (await sequelize.query(`
          INSERT INTO "external_store_payment" (id_payment)
          VALUES(:idPayment)
          ON CONFLICT DO NOTHING
          RETURNING id
          `, {
          replacements: {
            idPayment: idPayment
          }, type: QueryTypes.INSERT, transaction: t
        }))[0][0];
        if (!externalStorePayment) {
          await sequelize.query(`
          INSERT INTO "store_payment" (store_id, id_payment)
          SELECT :storeId, id
          FROM external_store_payment
          WHERE id_payment = :idPayment
          `, {
            replacements: {
              storeId: storeId,
              idPayment: idPayment
            }, type: QueryTypes.INSERT, transaction: t
          });
        } else {
          await sequelize.query(`
            INSERT INTO "store_payment" (store_id, id_payment)
            VALUES(:storeId, :idPayment)
            `, {
            replacements: {
              storeId: storeId,
              idPayment: externalStorePayment.id
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