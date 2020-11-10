import { Service, Inject } from 'typedi';
import * as Interfaces from '../interfaces/ICreditCard';
import axios from 'axios';
import config from '../config';
import creditCardModel from '../business/creditCard';

@Service()
export default class creditCardService {
    private _creditCardController: creditCardModel;
    constructor(
        @Inject('logger') private logger: any
    ) {
        this._creditCardController = new creditCardModel();
    }

    public createCreditCard = async (input: Interfaces.CreateCreditCard): Promise<any> => {
        try {
            this.logger.silly('Calling createCreditCard');
            /* TODO */
        }
        catch (e) {
            return Promise.reject(e);
        }
    }

    public disableCreditCard = async (input: Interfaces.DisableCreditCard): Promise<any> => {
        try {
            this.logger.silly('Calling disableCreditCard');
            /* TODO */
        }
        catch (e) {
            return Promise.reject(e);
        }
    }

    public getAllCreditCards = async (input: Interfaces.GetAllCreditCards): Promise<any> => {
        try {
            this.logger.silly('Calling getAllCreditCards');
            /* TODO */
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}