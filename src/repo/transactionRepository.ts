import { ITransactionDTOInput } from '../interfaces/ITransaction';
import sequelize from '../loaders/sequelize';
import { QueryTypes } from 'sequelize';

export class transactionRepository {
  async registerTransaction(output, input: ITransactionDTOInput): Promise<any> {
    try {
      return await sequelize.transaction(async function (t) {         
        console.log(output.split_rules[0].percentage,"sutta")   
        await sequelize.query(`
          INSERT INTO "payment_transaction" (value, store_id ,card_id, portion)
          VALUES(:value, :storeId , :cardId, :portion)
          `, {
          replacements: {    
            value: input.amount,
            storeId: output.id,
            cardId: input.cardId,
            portion: output.split_rules[0].percentage 
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
}





