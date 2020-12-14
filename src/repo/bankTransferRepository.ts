import sequelize from '../loaders/sequelize';
import { QueryTypes } from 'sequelize';

export class bankTransferRepository {
  async createBankTransfer(bankAccountId: number, transfers: Array<{ origin: string, value: number, externalId: string }>): Promise<void> {
    try {
      return await sequelize.transaction(async function (t) {
        const bankTransfer: { id: number } = (await sequelize.query(`
          INSERT INTO store_payment_bank_transfer (bank_account_id)
          VALUES(:bankAccountId)
          RETURNING id
          `, {
          replacements: {
            bankAccountId: bankAccountId
          }, type: QueryTypes.INSERT, transaction: t
        }))[0][0];
        for (let i = 0; i < transfers.length; i++) {
          await sequelize.query(`
          INSERT INTO store_payment_bank_transfer_item (origin, value, bank_transfer_id, external_id)
          VALUES(:origin, :value, :bankTransferId, :externalId)
          `, {
            replacements: {
              value: transfers[i].value,
              bankTransferId: bankTransfer.id,
              externalId: transfers[i].externalId,
              origin: transfers[i].origin
            }, type: QueryTypes.INSERT, transaction: t
          });
        }
        return Promise.resolve();
      })
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getBankTransfers(storeId: number, mallId: number): Promise<Array<{ id: number, bankName: string, accountNumber: string, createdAt: string, value: number }>> {
    try {
      return await sequelize.query(`
        SELECT
            spbt.id,
            spba.bank_name AS "bankName",
            spba.account_number AS "accountNumber",
            TO_CHAR(spbt.created_at, :format) AS "createdAt",
            SUM(spbti.value)::INTEGER AS value
        FROM
            external_store_payment esp
            JOIN store_payment sp ON (esp.id = sp.id_payment)
            JOIN store s ON (sp.store_id = s.id)
            JOIN store_payment_bank_account spba ON (esp.id = spba.external_store_payment_id)
            JOIN store_payment_bank_transfer spbt ON (spba.id = spbt.bank_account_id)
            JOIN store_payment_bank_transfer_item spbti ON (spbt.id = spbti.bank_transfer_id)
        WHERE
            s.id = :storeId
            AND s.mall_id = :mallId
        GROUP BY
            1,
            2,
            3,
            4
          `, {
        replacements: {
          storeId: storeId,
          mallId: mallId,
          format: 'YYYY-MM-DD"T"HH24:MI:SS"Z"'
        }, type: QueryTypes.SELECT
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
}





