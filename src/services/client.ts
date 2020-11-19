import { Service, Inject } from 'typedi';
import * as Interfaces from '../interfaces/IClient';
import axios from 'axios';
import config from '../config';
import clientModel from '../business/client';

@Service()
export default class clientService {
    private _clientController: clientModel;
    constructor(
        @Inject('logger') private logger: any
    ) {
        this._clientController = new clientModel();
    }

    public createClient = async (input: Interfaces.CreateClient): Promise<void> => {
        try {
            this.logger.silly('Calling createClient');

            const clientData = (await this._clientController.getClient(input))[0];

            if (!clientData) {
                return Promise.reject({ message: "Cliente não cadastrado.", status: 400 });
            }

            if (clientData.id_payment) {
                return Promise.reject({ message: "Cliente já foi cadastrado.", status: 400 });
            }

            const client: { id: string } = (await axios.post(
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

            await this._clientController.registerClient(client.id, input)

            return Promise.resolve();
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}