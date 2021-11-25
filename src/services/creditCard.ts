import { Service, Inject } from 'typedi';
import * as Interfaces from '../interfaces/ICreditCard';
import axios from 'axios';
import config from '../config';
import logger from '../loaders/logger';
import prisma from '../loaders/prisma';

@Service()
export default class creditCardService {
    public createCreditCard = async (input: Interfaces.CreateCreditCard): Promise<void> => {
        try {
            logger.silly('Calling createCreditCard');

            const creditCardData: Interfaces.CreditCardDataInput = (await axios.post(
                config.paymentApi.host + config.paymentApi.endpoints.createCreditCard.replace('$MARKETPLACEID', input.cod_marketplace),
                {
                    token: input.creditCardToken,
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
                    id_paymentsystem: input.id_paymentsystem
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