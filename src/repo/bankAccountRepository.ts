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

  async getBankAccountId(input: { id: number, storeId: number, mallId: number }): Promise<{ bank_account_id: string }> {
    try {
      const output: Array<{ bank_account_id: string, enabled: boolean, id: number }> = await sequelize.query(`
          SELECT
            spba.bank_account_id,
            spba.enabled,
            spba.id
          FROM 
            external_store_payment esp
            JOIN store_payment sp ON (esp.id = sp.id_payment)
            LEFT JOIN store_payment_bank_account spba ON (esp.id = spba.external_store_payment_id)
          WHERE
            sp.store_id = :storeId
            AND sp.mall_id = :mallId
        `, {
        replacements: {
          id: input.id,
          storeId: input.storeId,
          mallId: input.mallId
        }, type: QueryTypes.SELECT
      });
      if (!output.length) {
        return Promise.reject({ message: "Loja não existente.", status: 400 });
      }
      const bankAccount: { bank_account_id: string, enabled: boolean, id: number } = output.find((o) => {
        return (o.id === input.id);
      });
      if (!bankAccount) {
        return Promise.reject({ message: "Conta bancária não existente ou não associada a está loja.", status: 400 });
      } else if (bankAccount.enabled === false) {
        return Promise.reject({ message: "Conta bancária já foi desabilitada.", status: 400 });
      }

      return Promise.resolve({ bank_account_id: bankAccount.bank_account_id });
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

  async getAllBankAccounts(input: Interfaces.GetAllBankAccounts): Promise<Array<Interfaces.BankAccountDataOutput>> {
    try {
      var output: Array<Interfaces.BankAccountDataOutput & { enabled: boolean }> = await sequelize.query(`
          SELECT 
            spba.id,
            spba.holder_name AS "holderName",
            spba.bank_name AS "bankName",
            spba.bank_code AS "bankCode",
            spba.routing_number AS "routingNumber",
            spba.account_number AS "accountNumber",
            spba.cnpj,
            spba.type,
            spba.enabled
          FROM 
            external_store_payment esp
            JOIN store_payment sp ON (esp.id = sp.id_payment)
            LEFT JOIN store_payment_bank_account spba ON (esp.id = spba.external_store_payment_id)
          WHERE
            sp.store_id = :storeId
            AND sp.mall_id = :mallId
          `, {
        replacements: {
          storeId: +input.storeId,
          mallId: +input.mallId
        }, type: QueryTypes.SELECT
      });
      if (!output.length) {
        return Promise.reject({ message: "Loja não existente.", status: 400 });
      }
      output = output.filter((o) => {
        return o.enabled === true;
      });
      return Promise.resolve(output.map((o) => {
        delete o.enabled;
        return o;
      }));
    } catch (e) {
      return Promise.reject(e);
    }
  }
}