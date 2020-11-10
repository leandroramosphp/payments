import { Service, Inject } from 'typedi';
import * as Interfaces from '../interfaces/IBankTransfer';
import axios from 'axios';
import config from '../config';
import bankTransferModel from '../business/bankTransfer';

@Service()
export default class bankTransferService {
    private _bankTransferController: bankTransferModel;
    constructor(
        @Inject('logger') private logger: any
    ) {
        this._bankTransferController = new bankTransferModel();
    }

    public createBankTransfer = async (input: Interfaces.CreateBankTransfer): Promise<any> => {
        try {
            return Promise.resolve();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}