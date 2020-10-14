import { IClientDTOInput } from '../interfaces/IClient';
import sequelize from '../loaders/sequelize';
import { QueryTypes } from 'sequelize';

export class clientRepository {
  async registerClient(output, input: IClientDTOInput): Promise<any> {
    try {
      return await sequelize.transaction(async function (t) {  
        
        await sequelize.query(`
          INSERT INTO "client_zoop" (client_id, mall_id, id_zoop)
          VALUES(:client_id, :mall_id, :id_zoop)
          `, {
          replacements: {
            client_id: +input.clientId,
            mall_id: +input.mallId,
            id_zoop: output.id
          }, type: QueryTypes.INSERT
        });              

        return Promise.resolve(output)
      })
    } catch (e) {
      return Promise.reject(e);
    }
  }

}





