import { IBankAccountDTOInput } from '../interfaces/IBankAccount';
import sequelize from '../loaders/sequelize';
import { QueryTypes } from 'sequelize';

export class bankAccountRepository {
  async registerBankAccount(output, input: IBankAccountDTOInput): Promise<any> {
    try {      
      return await sequelize.transaction(async function (t) { 
        await sequelize.query(`
          INSERT INTO "store_payment_bank_account" (store_payment_id, bank_account_id, bank_name, routing_number, account_number, mall_id)
          VALUES(:storePaymentId, :bankAccountId, :bankName, :routingNumber, :accountNumber, :mallId)
          `, {                     
          replacements: {    
            storePaymentId: input.storePaymentId,
            bankAccountId: output.id,            
            bankName: output.bank_name, 
            routingNumber: output.routing_number,
            accountNumber: output.account_number,
            mallId: input.mallId                   
          }, type: QueryTypes.INSERT
        });  
        
        return Promise.resolve(output)
      })
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getBankAccountId(clientId): Promise<any> {
    return await sequelize.query(`
      SELECT bank_account_id AS "id"
        FROM 
        store_payment_bank_account            
      WHERE id = ${clientId}
      `, {        
      type: QueryTypes.SELECT
    });  
  }

  async updateBankAccountAssociation(output, input: IBankAccountDTOInput): Promise<any> {
    try {
      return await sequelize.transaction(async function (t) {                        
        await sequelize.query(`
          UPDATE             
            "store_payment_bank_account"
          SET 
            enabled = false
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
  
  async getAll(input: IBankAccountDTOInput): Promise<any> {
    try {
      return await sequelize.transaction(async function (t) {                  
        var output = await sequelize.query(`
          SELECT 
            *
          FROM 
            "store_payment_bank_account"
          WHERE enabled IS TRUE
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





