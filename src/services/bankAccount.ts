import { Service, Inject } from 'typedi';
import * as Interfaces from '../interfaces/IBankAccount';
import axios from 'axios';
import config from '../config';
import bankAccountModel from '../business/bankAccount';
import storeModel from '../business/store';

@Service()
export default class bankAccountService {
    private _bankAccountController: bankAccountModel;
    private _storeController: storeModel;
    constructor(
        @Inject('logger') private logger: any
    ) {
        this._bankAccountController = new bankAccountModel();
        this._storeController = new storeModel();
    }

    public createBankAccount = async (input: Interfaces.CreateBankAccount): Promise<void> => {
        try {
            this.logger.silly('Calling createBankAccount');

            const storeData = (await this._storeController.getStore({ storeId: input.storeId, mallId: input.mallId }));

            if (!storeData?.id_payment) {
                return Promise.reject({ message: "Loja não cadastrada.", status: 400 });
            }

            const bankAccount: Interfaces.BankAccountDataInput = (await axios.post(
                config.PaymentsApi.host + config.PaymentsApi.endpoints.bankAccount,
                {
                    token: input.bankAccountToken,
                    customer: storeData.id_payment
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    auth: {
                        username: config.PaymentsApi.username,
                        password: config.PaymentsApi.password
                    },
                }
            )).data;

            await this._bankAccountController.createBankAccount(bankAccount, storeData.id_payment);

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
            this.logger.silly('Calling disableBankAccount');

            const storeData = (await this._storeController.getStore({ storeId: input.storeId, mallId: input.mallId }));

            if (!storeData?.id_payment) {
                return Promise.reject({ message: "Loja não cadastrada.", status: 400 });
            }

            const bankAccount = await this._bankAccountController.getBankAccount(input.id, input.storeId, input.mallId);

            if (!bankAccount) {
                return Promise.reject({ message: "Conta bancária não cadastrada.", status: 400 });
            } else if (bankAccount.enabled === false) {
                return Promise.reject({ message: "Conta bancária desabilitada.", status: 400 });
            }

            await axios.delete(
                config.PaymentsApi.host + config.PaymentsApi.endpoints.deleteBankAccount
                    .replace('{bank_account_id}', bankAccount.bank_account_id),
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    auth: {
                        username: config.PaymentsApi.username,
                        password: config.PaymentsApi.password
                    },
                }
            );

            await this._bankAccountController.disableBankAccount(input.id);

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
            this.logger.silly('Calling getBankAccounts');

            const storeData = (await this._storeController.getStore({ storeId: input.storeId, mallId: input.mallId }));

            if (!storeData?.id_payment) {
                return Promise.reject({ message: "Loja não cadastrada.", status: 400 });
            }

            return Promise.resolve(await this._bankAccountController.getBankAccounts(input.storeId, input.mallId));
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}