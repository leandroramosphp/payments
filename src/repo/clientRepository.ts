

import { IClientDTOInput } from '../interfaces/IClient';
import sequelize from '../loaders/sequelize';
import { QueryTypes } from 'sequelize';

export class clientRepository {
  async createClient(output): Promise<any> {
    try {
      return await sequelize.transaction(async function (t) {  
        
        await sequelize.query(`
          INSERT INTO "client_zoop" (client_id, mall_id, id_zoop)
          VALUES(:client_id, :mall_id, :id_zoop)
          `, {
          replacements: {
            client_id: 367387,
            mall_id: 6,
            id_zoop: output.data.id
          }, type: QueryTypes.INSERT
        });              

        return Promise.resolve(output)
      })
    } catch (e) {
      return Promise.reject(e);
    }
  }

}





