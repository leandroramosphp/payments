import { ITransactionDTOInput } from '../interfaces/ITransaction';
import sequelize from '../loaders/sequelize';
import { QueryTypes } from 'sequelize';

export class transactionRepository {
  async registerTransaction(output, input: ITransactionDTOInput): Promise<any> {
    try {
      return await sequelize.transaction(async function (t) {         
        
        await sequelize.query(`
          INSERT INTO "payment_transaction" (value, store_id ,client_id, portion, mall_id, description)
          VALUES(:value, :storeId , :clientId, :portion, :mallId, :description)
          `, {
          replacements: {    
            value: input.amount,
            storeId: output.id,
            clientId: input.clientId,
            portion: input.portion,
            mallId: input.mallId,
            description: input.description
          }, type: QueryTypes.INSERT
        });                        
        return Promise.resolve(output)
      })
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getTransactionId(clientId): Promise<any> {
    return await sequelize.query(`
      SELECT store_id AS "id"
        FROM 
        payment_transaction            
      WHERE id = ${clientId}
      `, {        
      type: QueryTypes.SELECT
    });  
  }

  async updateTransactionApprove(input: ITransactionDTOInput): Promise<any> {
    try {
      return await sequelize.transaction(async function (t) {                          
        var output = await sequelize.query(`
          UPDATE             
            "payment_transaction"
          SET 
            status = 'paid'
          WHERE id = :clientId
          `, {
            replacements: {    
              clientId: input.clientId
            }, type: QueryTypes.UPDATE
          });                            
          
        return Promise.resolve(output)
      })
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async updateTransactionReverse(output, input: ITransactionDTOInput): Promise<any> {
    try {
      return await sequelize.transaction(async function (t) {                          
        await sequelize.query(`
            UPDATE             
              "payment_transaction"
            SET 
              status = 'reversed'
            WHERE id = :clientId
          `, {
            replacements: {    
              clientId: input.clientId
            }, type: QueryTypes.UPDATE
          });                            
          
        return Promise.resolve(output)
      })
    } catch (e) {
      return Promise.reject(e);
    }
  }

  
  async getAllTransaction(input: ITransactionDTOInput): Promise<any> {
    try {
      return await sequelize.transaction(async function (t) {                  
        var output = await sequelize.query(`
        SELECT           
            c.full_name, pt.portion,
            pt.value, pt.description,
            pt.date_time
          FROM
            payment_transaction pt
          JOIN client_mall cm ON (cm.client_id = pt.client_id AND cm.mall_id =pt.mall_id)       
          JOIN client c ON (c.id = pt.client_id)
          `, {
          type: QueryTypes.SELECT
        });                             
        return Promise.resolve(output)
      })
    } catch (e) {
      return Promise.reject(e);
    }
  }
}





