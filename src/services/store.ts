import { Service, Inject } from 'typedi';
import { IStoreDTOInput, StoreInteface } from '../interfaces/IStore';
import axios from 'axios';
import config from '../config';
import storeModel from '../business/store';

@Service()
export default class storeService extends StoreInteface {
    private _storeController: storeModel;
    constructor(
        @Inject('logger') private logger: any
    ) {
        super();
        this._storeController = new storeModel();        
    }

    public createStore = async (input: IStoreDTOInput): Promise<any>  => {
        try {            
            this.logger.silly('Calling createStoreSchema');     
            
            var store =  (await axios.post(
                config.PaymentsApi.host + config.PaymentsApi.endpoints.createStore,
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
            
            var output = await this._storeController.registerStore(store, input)
                    
            return Promise.resolve(output);
        }                    
        catch (e) {
            return Promise.reject(e);
        }
    }
}