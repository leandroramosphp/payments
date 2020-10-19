import { IClientDTOInput } from '../interfaces/IClient';
import sequelize from '../loaders/sequelize';
import { QueryTypes } from 'sequelize';

export class clientRepository {
  async registerClient(output, input: IClientDTOInput): Promise<any> {
    try {
      return await sequelize.transaction(async function (t) {          
        await sequelize.query(`
          INSERT INTO "client_payment" (client_id, mall_id, id_payment)
          VALUES(:client_id, :mall_id, :id_payment)
          `, {
          replacements: {
            client_id: +input.clientId,
            mall_id: +input.mallId,
            id_payment: output.id,
          }, type: QueryTypes.INSERT
        });              

        return Promise.resolve(output)
      })
    } catch (e) {
      return Promise.reject(e);
    }
  }

}





