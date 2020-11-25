import { Service, Inject } from 'typedi';
import * as Interfaces from '../interfaces/ITransaction';
import axios from 'axios';
import config from '../config';
import transactionModel from '../business/transaction';
import storeModel from '../business/store';
import clientModel from '../business/client';
import creditCardModel from '../business/creditCard';

@Service()
export default class transactionService {
    private _transactionController: transactionModel;
    private _storeController: storeModel;
    private _clientController: clientModel;
    private _creditCardController: creditCardModel;
    constructor(
        @Inject('logger') private logger: any
    ) {
        this._transactionController = new transactionModel();
        this._storeController = new storeModel();
        this._clientController = new clientModel();
        this._creditCardController = new creditCardModel();
    }

    public createTransaction = async (input: Interfaces.CreateTransaction): Promise<void> => {
        try {
            this.logger.silly('Calling createTransaction');

            /* TODO: Adicionar lógica para pagamento com cashback (Moneri) */

            const storeData = (await this._storeController.getStore({ storeId: input.storeId, mallId: input.mallId }));

            if (!storeData?.id_payment) {
                return Promise.reject({ message: "Loja não cadastrada.", status: 400 });
            }

            const clientData = (await this._clientController.getClient({ clientId: input.clientId, mallId: input.mallId }));

            if (!clientData?.id_payment) {
                return Promise.reject({ message: "Cliente não cadastrado.", status: 400 });
            }

            const creditCardData = (await this._creditCardController.getCreditCard(input.creditCardId, input.clientId, input.mallId));

            var transactions: Array<{ origin: string, value: number, externalId: string }> = [];

            const transaction: { id: string } = (await axios.post(
                config.PaymentsApi.host + config.PaymentsApi.endpoints.createTransaction,
                {
                    payment_type: "credit",
                    on_behalf_of: storeData.id_payment,
                    statement_descriptor: storeData.name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").substring(0, 13),
                    source: {
                        type: "card",
                        currency: "BRL",
                        usage: "single_use",
                        amount: input.value,
                        card: {
                            id: creditCardData.id_payment
                        },
                        installment_plan: {
                            number_installments: input.installments || 1
                        }
                    }
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

            transactions.push({
                origin: 'ZOOP',
                value: input.value,
                externalId: transaction.id
            });

            await this._transactionController.createTransaction(clientData.clientPaymentId, storeData.storePaymentId, input.installments, transactions);

            return Promise.resolve();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }

    public acceptTransaction = async (input: Interfaces.AcceptTransaction): Promise<any> => {
        try {
            this.logger.silly('Calling acceptTransaction');
            /* TODO */
        }
        catch (e) {
            return Promise.reject(e);
        }
    }

    public rejectTransaction = async (input: Interfaces.RejectTransaction): Promise<any> => {
        try {
            this.logger.silly('Calling rejectTransaction');
            /* TODO */
        }
        catch (e) {
            return Promise.reject(e);
        }
    }

    public getAllTransactions = async (input: Interfaces.GetAllTransactions): Promise<any> => {
        try {
            this.logger.silly('Calling getAllTransactions');
            /* TODO */
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}