import { IStoreDTOInput } from '../interfaces/IStore';
import sequelize from '../loaders/sequelize';
import { QueryTypes } from 'sequelize';

export class storeRepository {
  async registerStore(output, input: IStoreDTOInput): Promise<any> {
    try {
      return await sequelize.transaction(async function (t) {             
        await sequelize.query(`
          INSERT INTO "store_payment" (store_id, mall_id, id_payment, mall_id)
          VALUES(:store_id, :mall_id, :id_payment, :mallId)
          `, {
          replacements: {
            store_id: +input.storeId,
            mall_id: +input.mallId,
            id_payment: output.id,
            mallId: input.mallId
          }, type: QueryTypes.INSERT
        });                      

        return Promise.resolve(output)
      })
    } catch (e) {
      return Promise.reject(e);
    }
  }

}





