import { Service, Inject } from 'typedi';
import * as Interfaces from '../interfaces/IBankAccount';
import axios from 'axios';
import config from '../config';
import logger from '../loaders/logger';
import prisma from '../loaders/prisma';

@Service()
export default class bankAccountService {
    public createBankAccount = async (input: Interfaces.CreateBankAccount): Promise<void> => {
        try {
            logger.silly('Calling createBankAccount');

            const bankAccount: Interfaces.BankAccountDataInput = (await axios.post(
                config.paymentApi.host + config.paymentApi.endpoints.bankAccount.replace('$MARKETPLACEID', input.cod_marketplace),
                {
                    token: input.bankAccountToken,
                    customer: input.cod_external
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    auth: {
                        username: config.paymentApi.username,
                        password: config.paymentApi.password
                    },
                }
            )).data;

            await prisma.bankaccount.create({
                data: {
                    id_paymentsystem: input.id_paymentsystem,
                    id_store: input.storeId,
                    cod_external: bankAccount.id,
                    holdername: bankAccount.holder_name,
                    bankname: bankAccount.bank_name,
                    bankcode: bankAccount.bank_code,
                    routingnumber: bankAccount.routing_number,
                    accountnumber: bankAccount.account_number,
                    cnpj: bankAccount.taxpayer_id,
                    type: bankAccount.type,
                    flg_active: true
                }
            });

            return Promise.resolve();
        }
        catch (e) {
            if (e?.response?.data?.error?.message === 'Sorry, the token you are trying to use does not exist or has been deleted.') {
                return Promise.reject({ message: "Token da conta bancária inválido ou expirado.", status: 400 });
            }
            if (e?.response?.data?.error?.category === 'mismatch_taxpayer_identification') {
                return Promise.reject({ message: "Cnpj da conta bancária é diferente do cnpj do vendedor.", status: 400 });
            }
            return Promise.reject(e);
        }
    }

    public disableBankAccount = async (input: Interfaces.DisableBankAccount): Promise<void> => {
        try {
            logger.silly('Calling disableBankAccount');

            const bankAccount = await prisma.bankaccount.findFirst({
                where: {
                    id_paymentsystem: input.id_paymentsystem,
                    id_store: input.storeId,
                    id_bankaccount: input.id
                },
                select: {
                    flg_active: true,
                    cod_external: true
                }
            })

            if (!bankAccount) {
                return Promise.reject({ message: "Conta bancária não cadastrada.", status: 400 });
            } else if (bankAccount.flg_active === false) {
                return Promise.reject({ message: "Conta bancária desabilitada.", status: 400 });
            }

            await axios.delete(
                config.paymentApi.host + config.paymentApi.endpoints.deleteBankAccount.replace('$MARKETPLACEID', input.cod_marketplace)
                    .replace('{bank_account_id}', bankAccount.cod_external),
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    auth: {
                        username: config.paymentApi.username,
                        password: config.paymentApi.password
                    },
                }
            );

            await prisma.bankaccount.update({
                where: {
                    id_bankaccount: input.id
                },
                data: {
                    flg_active: false
                }
            });

            return Promise.resolve();
        }
        catch (e) {
            if (e?.response?.data?.error?.message === 'Sorry, the bank_account you are trying to use does not exist or has been deleted.') {
                return Promise.reject({ message: "Conta bancária já foi excluída na API externa.", status: 400 });
            }
            return Promise.reject(e);
        }
    }

    public getBankAccounts = async (input: Interfaces.GetBankAccounts): Promise<Array<Interfaces.BankAccountDataOutput>> => {
        try {
            logger.silly('Calling getBankAccounts');

            const bankAccounts = await prisma.bankaccount.findMany({
                where: {
                    id_paymentsystem: input.id_paymentsystem,
                    id_store: input.storeId,
                    flg_active: true
                },
                select: {
                    id_bankaccount: true,
                    holdername: true,
                    bankname: true,
                    bankcode: true,
                    routingnumber: true,
                    accountnumber: true,
                    cnpj: true,
                    type: true
                }
            })

            return Promise.resolve(bankAccounts.map(o => ({
                id: o.id_bankaccount,
                holderName: o.holdername,
                bankName: o.bankname,
                bankCode: o.bankcode,
                routingNumber: o.routingnumber,
                accountNumber: o.accountnumber,
                cnpj: o.cnpj,
                type: o.type
            })));
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}