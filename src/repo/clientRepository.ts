import * as Interfaces from '../interfaces/IClient';
import sequelize from '../loaders/sequelize';
import { QueryTypes, UniqueConstraintError } from 'sequelize';

export class clientRepository {
  async getClient(input: { clientId: number, mallId: number }): Promise<{ cpf: string, id_payment: string, clientPaymentId: number }> {
    try {
      const output: Array<{ cpf: string, id_payment: string, clientPaymentId: number }> = await sequelize.query(`
          SELECT
            cpf,
            cp.id_payment,
            cp.id AS "clientPaymentId"
          FROM
            client c
            JOIN client_mall cm ON (c.id = cm.client_id)
            LEFT JOIN client_payment cp USING (client_id, mall_id)
          WHERE
            client_id = :clientId
            AND mall_id = :mallId
        `, {
        replacements: {
          clientId: input.clientId,
          mallId: input.mallId
        }, type: QueryTypes.SELECT
      });

      return Promise.resolve(output[0]);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async registerClient(idPayment: string, input: Interfaces.CreateClient): Promise<void> {
    try {
      await sequelize.query(`
          INSERT INTO "client_payment" (client_id, mall_id, id_payment)
          VALUES(:clientId, :mallId, :idPayment)
        `, {
        replacements: {
          clientId: input.clientId,
          mallId: input.mallId,
          idPayment: idPayment,
        }, type: QueryTypes.INSERT
      }).catch(UniqueConstraintError, (e: UniqueConstraintError) => {
        if (e.parent.message === `duplicate key value violates unique constraint "client_payment_client_id_mall_id_key"`) {
          return Promise.reject({ message: "Cliente já foi cadastrado." });
        } else {
          return Promise.reject(e);
        }
      });

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }
}