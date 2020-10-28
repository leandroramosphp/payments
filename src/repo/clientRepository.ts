import { IClientDTOInput } from '../interfaces/IClient';
import sequelize from '../loaders/sequelize';
import { QueryTypes, UniqueConstraintError } from 'sequelize';

export class clientRepository {
  async getClient(input: IClientDTOInput): Promise<any> {
    try {
      return await sequelize.transaction(async function (t) {
        const output: any = await sequelize.query(`
            SELECT
              cpf,
              cp.id_payment
            FROM
              client c
              JOIN client_mall cm ON (c.id = cm.client_id)
              LEFT JOIN client_payment cp USING (client_id, mall_id)
            WHERE
              client_id = :clientId
              AND mall_id = :mallId
          `, {
          replacements: {
            clientId: +input.clientId,
            mallId: +input.mallId
          }, type: QueryTypes.SELECT
        });

        return Promise.resolve(output)
      })
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async registerClient(output, input: IClientDTOInput): Promise<any> {
    try {
      return await sequelize.transaction(async function (t) {
        await sequelize.query(`
            INSERT INTO "client_payment" (client_id, mall_id, id_payment)
            VALUES(:clientId, :mallId, :idPayment)
          `, {
          replacements: {
            clientId: +input.clientId,
            mallId: +input.mallId,
            idPayment: output.id,
          }, type: QueryTypes.INSERT
        }).catch(UniqueConstraintError, e => {
          if (e.parent.message === `duplicate key value violates unique constraint "client_id_mall_id_key"`) {
            return Promise.reject({ message: "Cliente já foi registrado.", status: 400 });
          } else {
            return Promise.reject(e);
          }
        });

        return Promise.resolve(output)
      })
    } catch (e) {
      return Promise.reject(e);
    }
  }
}