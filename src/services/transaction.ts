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
                origin: 'creditcard',
                value: input.value,
                externalId: transaction.id
            });

            await this._transactionController.createTransaction(clientData.clientPaymentId, storeData.id_payment, input.installments, transactions);

            return Promise.resolve();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }

    public acceptTransaction = async (input: Interfaces.AcceptTransaction): Promise<void> => {
        try {
            this.logger.silly('Calling acceptTransaction');

            const storeData = (await this._storeController.getStore({ storeId: input.storeId, mallId: input.mallId }));

            if (!storeData?.id_payment) {
                return Promise.reject({ message: "Loja não cadastrada.", status: 400 });
            }
            const isAccepted = await this._transactionController.acceptTransaction(input.id, input.invoiceNumber);
            if (!isAccepted) {
                return Promise.reject({ message: "Transação não existente ou já aprovada/rejeitada.", status: 400 });
            }
            return Promise.resolve();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }

    public rejectTransaction = async (input: Interfaces.RejectTransaction): Promise<void> => {
        try {
            this.logger.silly('Calling rejectTransaction');

            const storeData = (await this._storeController.getStore({ storeId: input.storeId, mallId: input.mallId }));

            if (!storeData?.id_payment) {
                return Promise.reject({ message: "Loja não cadastrada.", status: 400 });
            }

            const transactionData = await this._transactionController.getPendingTransaction(input.id);

            if (!transactionData.length) {
                return Promise.reject({ message: "Transação não existente ou já aprovada/rejeitada.", status: 400 });
            }

            for (let i = 0; i < transactionData.length; i++) {
                switch (transactionData[i].origin) {
                    case 'creditcard':
                        await axios.post(
                            config.PaymentsApi.host + config.PaymentsApi.endpoints.reverseTransaction
                                .replace('{transaction_id}', transactionData[i].externalId),
                            {
                                on_behalf_of: storeData.id_payment,
                                amount: transactionData[i].value
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
                        );
                        break;
                    case 'cashback':
                        /* TODO: Implementar lógica para estorno de cashback */
                        break;
                    default:
                        break;
                }
            }
            const isRejected = Promise.resolve(await this._transactionController.rejectTransaction(input.id));

            if (!isRejected) {
                return Promise.reject({ message: "Transação não existente ou já aprovada/rejeitada.", status: 400 });
            }
            return Promise.resolve();
        }
        catch (e) {
            if (e?.response?.data?.error?.message === 'Transactions with status canceled and with confirmed flag setted to 1 are not voidable') {
                return Promise.reject({ message: "Transação já foi estornada na API externa.", status: 400 });
            }
            if (e?.response?.data?.error?.type === 'invalid_request_error') {
                return Promise.reject({ message: "Tentativa de estornar valor maior que o valor original na API externa.", status: 400 });
            }
            return Promise.reject(e);
        }
    }

    public getAllTransactions = async (input: Interfaces.GetAllTransactionsInput): Promise<{ data: Array<Interfaces.GetAllTransactionsOutput>, total: number }> => {
        try {
            this.logger.silly('Calling getAllTransactions');

            const storeData = (await this._storeController.getStore({ storeId: input.storeId, mallId: input.mallId }));

            if (!storeData?.id_payment) {
                return Promise.reject({ message: "Loja não cadastrada.", status: 400 });
            }

            return await this._transactionController.getAllTransactions(input);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}