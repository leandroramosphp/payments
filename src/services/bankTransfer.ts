import { Service, Inject, Container } from 'typedi';
import * as Interfaces from '../interfaces/IBankTransfer';
import axios from 'axios';
import config from '../config';
import bankTransferModel from '../business/bankTransfer';
import bankAccountModel from '../business/bankAccount';
import storeService from './store';

@Service()
export default class bankTransferService {
    private _bankAccountController: bankAccountModel;
    private _bankTransferController: bankTransferModel;
    constructor(
        @Inject('logger') private logger: any
    ) {
        this._bankAccountController = new bankAccountModel();
        this._bankTransferController = new bankTransferModel();
    }

    public createBankTransfer = async (input: Interfaces.CreateBankTransfer): Promise<void> => {
        try {
            this.logger.silly('Calling createBankTransfer');

            const bankAccount = await this._bankAccountController.getBankAccount(input.bankAccountId, input.storeId, input.mallId);

            const storeServiceInstance = Container.get(storeService);
            const balance = (await storeServiceInstance.getStoreBalance({ storeId: input.storeId, mallId: input.mallId })).balance;

            if (input.value > balance) {
                return Promise.reject({ message: "Saldo insuficiente.", status: 400 });
            }

            /* TODO:
                Adicionar condicionais para saldos provenientes de múltiplas origens (Zoop e Moneri) */

            var transfers: Array<{ origin: string, value: number, externalId: string }> = [];

            const transfer: { id: string } = (await axios.post(
                config.PaymentsApi.host + config.PaymentsApi.endpoints.createBankTransfer
                    .replace('{bank_account_id}', bankAccount.bank_account_id),
                {
                    amount: input.value
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

            transfers.push({
                value: input.value,
                externalId: transfer.id,
                origin: 'creditcard'
            });

            await this._bankTransferController.createBankTransfer(input.bankAccountId, transfers);

            return Promise.resolve();
        }
        catch (e) {
            /* TODO:
                Adicionar exceção para caso onde valor da transferência é maior que saldo disponível para transferência */
            return Promise.reject(e);
        }
    }

    public getBankTransfers = async (input: Interfaces.GetBankTransfers): Promise<Array<{ id: number, bank_name: string, account_number: string, created_at: string, value: number }>> => {
        try {
            this.logger.silly('Calling getBankTransfers');

            return await this._bankTransferController.getBankTransfers(input.storeId, input.mallId);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}