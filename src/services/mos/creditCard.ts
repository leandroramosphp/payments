import { Service, Inject } from 'typedi';
import axios from 'axios';

import config from '../../config';
import logger from '../../loaders/logger';
import prisma from '../../loaders/prisma';
import rsa from 'node-rsa';

import * as Interfaces from '../../interfaces/ICreditCard';

@Service()
export default class creditCardService {
    private generateToken = async (encryptedCreditCard: string, cod_marketplace: string): Promise<Interfaces.IResponseGenerateToken> => {
        try {
            const privateKey = new rsa(config.privateKey); 
            const decrypt = privateKey.decrypt(encryptedCreditCard, "utf8");
            const cardObj:any = JSON.parse(decrypt);

            const token = (await axios.post(
                config.paymentApi.host + config.paymentApi.endpoints.generateToken.replace('$MARKETPLACEID', cod_marketplace),
                {
                    holder_name: cardObj.holder_name,
                    expiration_month: cardObj.expiration_month,
                    expiration_year: cardObj.expiration_year,
                    card_number: cardObj.card_number,
                    security_code: cardObj.security_code
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    auth: {
                        username: config.paymentApi.username,
                        password: config.paymentApi.password
                    },
                }
            )).data;

            return {
                id: token.id
            }
        } catch (e) {
            if (e?.message.includes('decoding error') || e?.message.includes('Incorrect data or key')) {
                return Promise.reject({ message: "Falha ao decodificar dados do cartão, verifique se dados foram encriptados utilizando a chave pública fornecida pelo administrador com criptografia RSA OAEP e codificados em base64", status: 400 });
            }
            if (e instanceof SyntaxError) {
                return Promise.reject({ message: "Objeto JSON contendo dados do cartão de crédito inválido", status: 400 });
            }
            if (e?.response?.data?.error?.type === 'invalid_request_error') {
                return Promise.reject({ message: "Dados do cartão de crédito inválidos.", status: 400 });
            }
            return Promise.reject(e);
        }
    }

    public createCreditCard = async (input: Interfaces.CreateCreditCard): Promise<void> => {
        try {
            logger.silly('Calling createCreditCard');

            const token = await this.generateToken(input.encryptedCreditCard, input.cod_marketplace)
            const creditCardData: Interfaces.CreditCardDataInput = (await axios.post(
                config.paymentApi.host + config.paymentApi.endpoints.createCreditCard.replace('$MARKETPLACEID', input.cod_marketplace),
                {
                    token: token.id,
                    customer: input.cod_external
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    auth: {
                        username: config.paymentApi.username,
                        password: config.paymentApi.password
                    },
                }
            )).data;

            await prisma.creditcard.create({
                data: {
                    id_client: input.clientId,
                    id_paymentsystem: input.id_paymentsystem,
                    cod_external: creditCardData.id,
                    cardbrand: creditCardData.card_brand,
                    expirationmonth: creditCardData.expiration_month,
                    expirationyear: creditCardData.expiration_year,
                    first4digits: creditCardData.first4_digits,
                    last4digits: creditCardData.last4_digits,
                    holdername: creditCardData.holder_name,
                    flg_active: true
                }
            })

            return Promise.resolve();
        }
        catch (e) {
            if (e?.response?.data?.error?.type === 'invalid_request_error') {
                return Promise.reject({ message: "Token do cartão de crédito inválido ou expirado.", status: 400 });
            }
            return Promise.reject(e);
        }
    }

    public disableCreditCard = async (input: Interfaces.DisableCreditCard): Promise<any> => {

        try {
            logger.silly('Calling disableCreditCard');

            const creditCard = await prisma.creditcard.findFirst({
                where: {
                    id_creditcard: input.id,
                    id_paymentsystem: input.id_paymentsystem,
                    id_client: input.clientId
                },
                select: {
                    flg_active: true,
                    cod_external: true
                }
            })

            if (!creditCard) {
                return Promise.reject({ message: "Cartão de crédito não cadastrado.", status: 400 });
            } else if (creditCard.flg_active === false) {
                return Promise.reject({ message: "Cartão de crédito desabilitado.", status: 400 });
            }

            await axios.delete(
                config.paymentApi.host + config.paymentApi.endpoints.deleteCreditCard.replace('$MARKETPLACEID', input.cod_marketplace)
                    .replace('{card_id}', creditCard.cod_external),
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    auth: {
                        username: config.paymentApi.username,
                        password: config.paymentApi.password
                    },
                }
            );

            await prisma.creditcard.update({
                where: {
                    id_creditcard: input.id
                },
                data: {
                    flg_active: false
                }
            })

            return Promise.resolve();
        }
        catch (e) {
            if (e?.response?.data?.error?.message === 'Sorry, the resource you are trying to use does not exist or has been deleted.') {
                return Promise.reject({ message: "Cartão de crédito já foi excluído na API externa.", status: 400 });
            }
            return Promise.reject(e);
        }
    }

    public getCreditCards = async (input: Interfaces.GetCreditCards): Promise<Array<Interfaces.CreditCardDataOutput>> => {
        try {
            logger.silly('Calling getCreditCards');

            const output = (await prisma.creditcard.findMany({
                where: {
                    id_client: input.clientId,
                    id_paymentsystem: input.id_paymentsystem,
                    flg_active: true
                },
                select: {
                    id_creditcard: true,
                    cardbrand: true,
                    expirationmonth: true,
                    expirationyear: true,
                    first4digits: true,
                    last4digits: true,
                    holdername: true
                }
            })).map(o => ({
                id: o.id_creditcard,
                cardBrand: o.cardbrand,
                first4Digits: o.first4digits,
                last4Digits: o.last4digits,
                expirationMonth: o.expirationmonth,
                expirationYear: o.expirationyear,
                holderName: o.holdername
            }))

            return Promise.resolve(output);
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}