import { IAccountBallanceDTOInput } from '../interfaces/IAccountBallance';
import sequelize from '../loaders/sequelize';
import { QueryTypes } from 'sequelize';

export class accountBallanceRepository {
  async registerAccountBallance(output, input: IAccountBallanceDTOInput): Promise<any> {
    try {
      return await sequelize.transaction(async function (t) {                 
        await sequelize.query(`
          INSERT INTO "account_balance" (bank_name, account, agency, social_reason, cnpj, client_id, mall_id)
          VALUES(:bankName, :account, :agency, :socialReason, :cnpj, :clientId, :mallId)
          `, {
          replacements: {    
            bankName: input.bankName,
            account: input.account,
            agency: input.agency,
            socialReason: input.socialReason,
            cnpj: input.cnpj,           
            clientId: input.clientId,
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
      SELECT store_id AS "id"
        FROM 
        payment_accountBallance            
      WHERE id = ${clientId}
      `, {        
      type: QueryTypes.SELECT
    });  
  }  

  async getAccountBallance(output,input: IAccountBallanceDTOInput): Promise<any> {
    try {
      return await sequelize.transaction(async function (t) {                          
        var output = await sequelize.query(`
          UPDATE             
            "account_balance"
          SET 
            status = 'paid'          
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
  
  async getAll(input: IAccountBallanceDTOInput): Promise<any> {
    try {      
      return await sequelize.transaction(async function (t) {                  
        var output = await sequelize.query(`
        SELECT           
          bank_name, account, agency, social_reason, cnpj
        FROM
            account_balance                       
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





