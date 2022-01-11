import { Service, Inject } from 'typedi';
import { toString } from 'qrcode';
import crypto from 'crypto'
import axios from 'axios';
import prisma from '../../loaders/prisma';

import config from '../../config';
import logger from '../../loaders/logger';

import * as Interfaces from '../../interfaces/IStore';

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

    public generateQrcode = async (input: Interfaces.CreateQRCode): Promise<void> => {
        try {
            const algorithm = config.encryption.algorithm
            const key = config.encryption.key
            const iv = config.encryption.iv

            const cipher = crypto.createCipheriv(algorithm, key, iv)
            let crypted = cipher.update(input.storeId.toString(), 'utf-8', 'hex')
            crypted += cipher.final('hex')
            
            const qrCodeOptions = {
                errorCorrectionLevel: 'H',
                type: 'svg',
                margin: 3,
                color: {
                    dark: "#000",
                    light: "#FFF"
                }
            }
        
            const storeObj = JSON.stringify({
                id: crypted,
                name: (await prisma.store.findUnique({
                    where: {
                        id: input.storeId
                    }
                })).name
            })
            const qrcode = await toString(storeObj, qrCodeOptions)

            return Promise.resolve(qrcode);
        }
        catch (e) {
            if (e.response)
                return Promise.reject({ status: e.response.status, data: e.response.data });
            else
                return Promise.reject(e);
        }
    }
}