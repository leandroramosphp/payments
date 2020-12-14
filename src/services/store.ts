import { Service, Inject } from 'typedi';
import * as Interfaces from '../interfaces/IStore';
import axios from 'axios';
import config from '../config';

@Service()
export default class storeService {
    @Inject('logger') private logger: any

    public getStoreBalance = async (input: Interfaces.GetStoreBalance): Promise<{ balance: number }> => {
        try {
            this.logger.silly('Calling getStoreBalance');

            const accountBalance: { items: { current_balance: string, current_blocked_balance: string, account_balance: string } } = (await axios.get(
                config.PaymentsApi.host + config.PaymentsApi.endpoints.getAccountBalance
                    .replace('{seller_id}', input.id_payment),
                {
                    auth: {
                        username: config.PaymentsApi.username,
                        password: config.PaymentsApi.password
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