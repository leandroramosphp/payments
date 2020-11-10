import * as Interfaces from '../interfaces/IBankTransfer';
import sequelize from '../loaders/sequelize';
import { QueryTypes } from 'sequelize';

export class bankTransferRepository {
  async registerBankTransfer(output, input: Interfaces.CreateBankTransfer): Promise<any> {
    try {
      return await sequelize.transaction(async function (t) {
        await sequelize.query(`
          INSERT INTO "account_balance" (bank_name, account, agency, social_reason, cnpj, client_id, mall_id)
          VALUES(:bankName, :account, :agency, :socialReason, :cnpj, :clientId, :mallId)
          `, {
          replacements: {
          }, type: QueryTypes.INSERT
        });
        return Promise.resolve(output)
      })
    } catch (e) {
      return Promise.reject(e);
    }
  }
}





