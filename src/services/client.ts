import { Service, Inject } from 'typedi';
import { IClientDTOInput, ClientInteface } from '../interfaces/IClient';
import axios from 'axios';
import config from '../config';
import clientModel from '../business/client';

@Service()
export default class ClientService extends ClientInteface {
    private _clientController: clientModel;
    constructor(
        @Inject('logger') private logger: any
    ) {
        super();
        this._clientController = new clientModel();        
    }

    public createClient = async (input: IClientDTOInput): Promise<any>  => {
        try {            
            this.logger.silly('Calling createClientSchema');     
            
            var client =  (await axios.post(
                config.PaymentsApi.hostClient + config.PaymentsApi.endpoints.createClient,
                input,
                {                                       
                    auth : {
                        username: config.PaymentsApi.username,
                        password: config.PaymentsApi.password
                    },
                }
            )).data                            

            var output = await this._clientController.registerClient(client, input)
                    
            return Promise.resolve(output);
        }                    
        catch (e) {
            return Promise.reject(e);
        }
    }
}