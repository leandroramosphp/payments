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

    public createClient = async (input: IClientDTOInput): Promise<any> => {
        try {
            this.logger.silly('Calling createClientSchema');

            const clientData = (await this._clientController.getClient(input))[0];

            if (!clientData) {
                return Promise.reject({ message: "Cliente não existente.", status: 400 });
            }

            if(clientData.id_payment) {
                return Promise.reject({ message: "Cliente já foi registrado.", status: 400 });
            }

            var client = (await axios.post(
                config.PaymentsApi.host + config.PaymentsApi.endpoints.createClient,
                {
                    taxpayer_id: clientData.cpf
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

            var output = await this._clientController.registerClient(client, input)

            return Promise.resolve(output);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}