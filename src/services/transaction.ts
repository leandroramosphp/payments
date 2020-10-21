import { Service, Inject } from 'typedi';
import { ITransactionDTOInput, TransactionInteface } from '../interfaces/ITransaction';
import axios from 'axios';
import config from '../config';
import transactionModel from '../business/transaction';

@Service()
export default class transactionService extends TransactionInteface {
    private _transactionController: transactionModel;
    constructor(
        @Inject('logger') private logger: any
    ) {
        super();
        this._transactionController = new transactionModel();        
    }

    public createTransaction = async (input: ITransactionDTOInput): Promise<any>  => {
        try {            
            this.logger.silly('Calling createTransactionSchema');     
            
            var transaction =  (await axios.post(
                config.PaymentsApi.host + config.PaymentsApi.endpoints.transaction,
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
                
            var output = await this._transactionController.registerTransaction(transaction, input)

            //TODO
            /*
                CHAMAR MONERI
                PEGAR VALOR E PASSAR COMO PARAMETRO PARA INSERIR NO BANCO DE DADOS
            */
                    
            return Promise.resolve(output);
        }                    
        catch (e) {
            return Promise.reject(e);
        }
    }

    public updateTransaction = async (input: ITransactionDTOInput): Promise<any>  => {
        try {            
            this.logger.silly('Calling updateTransactionSchema');     
            
            const transactionId: any = await this._transactionController.getTransactionId(input.clientId);                                    
            
            var transaction =  (await axios.post(
                config.PaymentsApi.host + config.PaymentsApi.endpoints.reverseTransaction
                    .replace('{transaction_id}', transactionId[0].id),
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
                         
            var output = await this._transactionController.updateTransactionReverse(transaction, input)            
                    
            return Promise.resolve(output);
        }                    
        catch (e) {
            return Promise.reject(e);
        }
    }
    

    public updateTransactionApprove = async (input: ITransactionDTOInput): Promise<any>  => {
        try {            
            this.logger.silly('Calling updateTransactionApproveSchema');                      
                        
            var output = await this._transactionController.updateTransactionApprove(input)
                    
            return Promise.resolve(output);
        }                    
        catch (e) {
            return Promise.reject(e);
        }
    }

    public getAllTransaction = async (input: ITransactionDTOInput): Promise<any>  => {
        try {            
            this.logger.silly('Calling getAllCardSchema');                      
                        
            var output = await this._transactionController.getAllTransaction(input)
                    
            return Promise.resolve(output);
        }                    
        catch (e) {
            return Promise.reject(e);
        }
    }
}