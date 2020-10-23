import { Service, Inject } from 'typedi';
import { IAccountBallanceDTOInput, AccountBallanceInteface } from '../interfaces/IAccountBallance';
import axios from 'axios';
import config from '../config';
import accountBallanceModel from '../business/accountBallance';

@Service()
export default class accountBallanceService extends AccountBallanceInteface {
    private _accountBallanceController: accountBallanceModel;
    constructor(
        @Inject('logger') private logger: any
    ) {
        super();
        this._accountBallanceController = new accountBallanceModel();        
    }

    public createAccountBallance = async (input: IAccountBallanceDTOInput): Promise<any>  => {
        try {
            this.logger.silly('Calling createAccountBallanceSchema');     

            const account: any = await this._accountBallanceController.getBankAccountId(input.clientId);

            var accountBallance =  (await axios.post(
                config.PaymentsApi.host + config.PaymentsApi.endpoints.transferAccountBallance
                .replace('{bank_account_id}', account[0].id),
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
            
            var output = await this._accountBallanceController.registerAccountBallance(accountBallance, input)            
                    
            return Promise.resolve(output);
        }                    
        catch (e) {
            return Promise.reject(e);
        }
    }

    public getAccountBallance = async (input: IAccountBallanceDTOInput): Promise<any>  => {
        try {            
            this.logger.silly('Calling getAccountBallanceSchema');     
            
            const seller: any = await this._accountBallanceController.getBankAccountId(input.clientId);
            
            var accountBallance =  (await axios.get(
                config.PaymentsApi.host + config.PaymentsApi.endpoints.accountBallance
                    .replace('{seller_id}', seller[0].id),                    
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

            var output = await this._accountBallanceController.getAccountBallance(accountBallance, input)
                
            //TODO
            /*
                saldo de conta pega zoop + moneri   

            */

            return Promise.resolve(output);
        }                    
        catch (e) {
            return Promise.reject(e);
        }
    }

    public getAll = async (input: IAccountBallanceDTOInput): Promise<any>  => {
        try {            
            this.logger.silly('Calling getAllAccountBallanceSchema');                      
                        
            var output = await this._accountBallanceController.getAll(input)
                    
            return Promise.resolve(output);
        }                    
        catch (e) {
            return Promise.reject(e);
        }
    }
}