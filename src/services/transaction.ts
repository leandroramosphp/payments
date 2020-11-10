import { Service, Inject } from 'typedi';
import * as Interfaces from '../interfaces/ITransaction';
import axios from 'axios';
import config from '../config';
import transactionModel from '../business/transaction';

@Service()
export default class transactionService {
    private _transactionController: transactionModel;
    constructor(
        @Inject('logger') private logger: any
    ) {
        this._transactionController = new transactionModel();
    }

    public createTransaction = async (input: Interfaces.CreateTransaction): Promise<any> => {
        try {
            this.logger.silly('Calling createTransaction');
            /* TODO */
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