import { Service, Inject } from 'typedi';
import * as Interfaces from '../interfaces/IStore';
import axios from 'axios';
import config from '../config';
import logger from '../loaders/logger';

@Service()
export default class storeService {
    public getStoreBalance = async (input: Interfaces.GetStoreBalance): Promise<{ balance: number }> => {
        try {
            logger.silly('Calling getStoreBalance');

            const accountBalance: { items: { current_balance: string, current_blocked_balance: string, account_balance: string } } = (await axios.get(
                config.paymentApi.host + config.paymentApi.endpoints.getAccountBalance.replace('$MARKETPLACEID', input.cod_marketplace)
                    .replace('{seller_id}', input.cod_external),
                {
                    auth: {
                        username: config.paymentApi.username,
                        password: config.paymentApi.password
                    }
                }
            )).data;

            /* TODO:
                Adicionar lógica para consultar saldo do lojista na Moneri
                Somar saldo lojista Zoop + Moneri */

            return Promise.resolve({ balance: accountBalance.items.current_balance ? parseInt(accountBalance.items.current_balance) : 0 });
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}