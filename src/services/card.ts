import { Service, Inject } from 'typedi';
import { ICardDTOInput, CardInteface } from '../interfaces/Icard';
import axios from 'axios';
import config from '../config';
import cardModel from '../business/card';

@Service()
export default class cardService extends CardInteface {
    private _cardController: cardModel;
    constructor(
        @Inject('logger') private logger: any
    ) {
        super();
        this._cardController = new cardModel();        
    }

    public createCard = async (input: ICardDTOInput): Promise<any>  => {
        try {            
            this.logger.silly('Calling createCardSchema');     
            
            const cardCustomer: any = await this._cardController.getCustomerId();            

            Object.assign(input, {customer: cardCustomer[0].id_payment});

            var card: any =  (await axios.post(
                config.PaymentsApi.host + config.PaymentsApi.endpoints.createCard,                
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

            var output = await this._cardController.registerCard(card, input)
                    
            return Promise.resolve(output);
        }                    
        catch (e) {
            return Promise.reject(e);
        }
    }

    public updateCard = async (input: ICardDTOInput): Promise<any>  => {
        try {            
            this.logger.silly('Calling updateCardSchema');     
            
            const clients: any = await this._cardController.getCardId(input.clientId);                                    
            
            var card =  (await axios.delete(
                config.PaymentsApi.host + config.PaymentsApi.endpoints.updateCard
                    .replace('{card_id}',clients[0].id),
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
                         
            var output = await this._cardController.updateCardAssociation(card, input)            
                    
            return Promise.resolve(output);
        }                    
        catch (e) {
            return Promise.reject(e);
        }
    }

    public getAll = async (input: ICardDTOInput): Promise<any>  => {
        try {            
            this.logger.silly('Calling getAllCardSchema');                      
                        
            var output = await this._cardController.getAll(input)
                    
            return Promise.resolve(output);
        }                    
        catch (e) {
            return Promise.reject(e);
        }
    }
}