import * as Interfaces from '../interfaces/IBankAccount';
import sequelize from '../loaders/sequelize';
import { QueryTypes } from 'sequelize';

export class bankAccountRepository {
  async registerBankAccount(bankAccountData: Interfaces.BankAccountDataInput, idPayment: string): Promise<void> {
    try {
      await sequelize.query(`
            INSERT INTO "store_payment_bank_account" (external_store_payment_id, bank_account_id, holder_name, bank_name, bank_code, routing_number, account_number, cnpj, type)
            SELECT id, :bankAccountId, :holderName, :bankName, :bankCode, :routingNumber, :accountNumber, :cnpj, :type
            FROM external_store_payment esp
            WHERE id_payment = :idPayment
          `, {
        replacements: {
          idPayment: idPayment,
          bankAccountId: bankAccountData.id,
          holderName: bankAccountData.holder_name,
          bankName: bankAccountData.bank_name,
          bankCode: bankAccountData.bank_code,
          routingNumber: bankAccountData.routing_number,
          accountNumber: bankAccountData.account_number,
          cnpj: bankAccountData.taxpayer_id,
          type: bankAccountData.type
        }, type: QueryTypes.INSERT
      });

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getBankAccount(id: number, storeId: number, mallId: number): Promise<{ bank_account_id: string, enabled: boolean }> {
    try {
      const output: Array<{ bank_account_id: string, enabled: boolean }> = await sequelize.query(`
        SELECT
            spba.bank_account_id,
            spba.enabled
        FROM
            external_store_payment esp
            JOIN store_payment sp ON (esp.id = sp.id_payment)
            JOIN store s ON (sp.store_id = s.id)
            LEFT JOIN store_payment_bank_account spba ON (esp.id = spba.external_store_payment_id AND spba.id = :id)
        WHERE
            s.id = :storeId
            AND s.mall_id = :mallId
        `, {
        replacements: {
          storeId: storeId,
          id: id,
          mallId: mallId
        }, type: QueryTypes.SELECT
      });

      return Promise.resolve(output[0]);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async disableBankAccount(id: number): Promise<void> {
    try {
      await sequelize.query(`
          UPDATE             
            store_payment_bank_account
          SET 
            enabled = false
          WHERE id = :id
          `, {
        replacements: {
          id: id
        }, type: QueryTypes.UPDATE
      });

      return Promise.resolve();
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async getBankAccounts(storeId: number, mallId: number): Promise<Array<Interfaces.BankAccountDataOutput>> {
    try {
      var output: Array<Interfaces.BankAccountDataOutput> = await sequelize.query(`
          SELECT 
            spba.id,
            spba.holder_name AS "holderName",
            spba.bank_name AS "bankName",
            spba.bank_code AS "bankCode",
            spba.routing_number AS "routingNumber",
            spba.account_number AS "accountNumber",
            spba.cnpj,
            spba.type
          FROM
            external_store_payment esp
            JOIN store_payment sp ON (esp.id = sp.id_payment)
            JOIN store s ON (sp.store_id = s.id)
            LEFT JOIN store_payment_bank_account spba ON (esp.id = spba.external_store_payment_id AND spba.enabled = true)
          WHERE
            s.id = :storeId
            AND s.mall_id = :mallId
          `, {
        replacements: {
          storeId: storeId,
          mallId: mallId
        }, type: QueryTypes.SELECT
      });
      return Promise.resolve(output);
    } catch (e) {
      return Promise.reject(e);
    }
  }
}