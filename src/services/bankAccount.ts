import { Service, Inject } from 'typedi';
import { IBankAccountDTOInput, bankAccountInteface } from '../interfaces/IBankAccount';
import axios from 'axios';
import config from '../config';
import bankAccountModel from '../business/bankAccount';

@Service()
export default class bankAccountService extends bankAccountInteface {
    private _bankAccountController: bankAccountModel;
    constructor(
        @Inject('logger') private logger: any
    ) {
        super();
        this._bankAccountController = new bankAccountModel();        
    }

    public createBankAccount = async (input: IBankAccountDTOInput): Promise<any>  => {
        try {            
            this.logger.silly('Calling createBankAccountSchema');     
            
            var bankAccount =  (await axios.post(
                config.PaymentsApi.host + config.PaymentsApi.endpoints.bankAccount,
                input,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    auth : {
                        username: config.PaymentsApi.username,
                        password: config.PaymentsApi.password
                    },
                }
            )).data                            
            
            var output = await this._bankAccountController.registerBankAccount(bankAccount, input)
                    
            return Promise.resolve(output);
        }                    
        catch (e) {
            return Promise.reject(e);
        }
    }

    public updateBankAccount = async (input: IBankAccountDTOInput): Promise<any>  => {
        try {            
            this.logger.silly('Calling updateBankAccountSchema');     
            
            const clients: any = await this._bankAccountController.getBankAccountId(input.clientId);                                    
            
            var bankAccount =  (await axios.delete(
                config.PaymentsApi.host + config.PaymentsApi.endpoints.deleteBankAccount
                    .replace('{bank_account_id}', clients[0].id),
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    auth : {
                        username: config.PaymentsApi.username,
                        password: config.PaymentsApi.password
                    },
                }
            )).data                                    

            var output = await this._bankAccountController.updateBankAccountAssociation(bankAccount, input)
                    
            return Promise.resolve(output);
        }                    
        catch (e) {
            return Promise.reject(e);
        }
    }

    public getAll = async (input: IBankAccountDTOInput): Promise<any>  => {
        try {            
            this.logger.silly('Calling getAllBankAccountSchema');                      
                        
            var output = await this._bankAccountController.getAll(input)
                    
            return Promise.resolve(output);
        }                    
        catch (e) {
            return Promise.reject(e);
        }
    }
}