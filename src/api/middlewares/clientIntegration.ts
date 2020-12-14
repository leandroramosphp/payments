import { Request, Response, NextFunction } from 'express';
import { clientRepository } from "../../repo/clientRepository";
import axios from 'axios';
import config from '../../config';

let clientIntegration = () => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const _clientRepository = new clientRepository();
            const clientData = (await _clientRepository.getClient({ clientId: +res.locals.data.clientId, mallId: +res.locals.data.mallId }));

            if (!clientData) {
                return res.status(400).json({ message: "Cliente não cadastrado." });
            }

            if (clientData.id_payment) {
                /* Cliente já cadastrado */
                res.locals.client = clientData;
                return next();
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

            await _clientRepository.registerClient(client.id, {clientId: +res.locals.data.clientId, mallId: +res.locals.data.mallId});
            res.locals.client = { ...clientData, id_payment: client.id };

            return next();
        }
        catch (e) {
            return next(e);
        }
    }

}

export default clientIntegration;