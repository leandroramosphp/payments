import { Service, Inject, Container } from 'typedi';
import axios from 'axios';

import prisma from '../../loaders/prisma';
import config from '../../config';
import logger from '../../loaders/logger';

import * as Interfaces from '../../interfaces/IBankTransfer';

@Service()
export default class bankTransferService {
    public createBankTransfer = async (input: Interfaces.CreateBankTransfer): Promise<void> => {
        try {
            logger.silly('Calling createBankTransfer');

            const bankAccount = await prisma.bankaccount.findFirst({
                where: {
                    id_paymentsystem: input.id_paymentsystem,
                    id_store: input.storeId,
                    id_bankaccount: input.bankAccountId
                },
                select: {
                    flg_active: true,
                    cod_external: true
                }
            })

            if (!bankAccount) {
                return Promise.reject({ message: "Conta bancária não cadastrada.", status: 400 });
            } else if (bankAccount.flg_active === false) {
                return Promise.reject({ message: "Conta bancária desabilitada.", status: 400 });
            }

            /* TODO:
                Adicionar condicionais para saldos provenientes de múltiplas origens (Zoop e Moneri) */

            var bankTransfers: Array<{ originId: number, value: number, externalId: string }> = [];

            const registeredBankTransfer: { id: string } = (await axios.post(
                config.paymentApi.host + config.paymentApi.endpoints.createBankTransfer.replace('$MARKETPLACEID', input.cod_marketplace)
                    .replace('{bank_account_id}', bankAccount.cod_external),
                {
                    amount: input.value * 100
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

            bankTransfers.push({
                value: input.value,
                externalId: registeredBankTransfer.id,
                originId: (await prisma.paymentorigin.findUnique({
                    where: {
                        nme_origin: 'creditcard'
                    },
                    select: {
                        id_paymentorigin: true
                    }
                })).id_paymentorigin
            });

            const bankTransfer = await prisma.banktransfer.create({
                data: {
                    id_bankaccount: input.bankAccountId
                }
            })

            for (const item of bankTransfers) {
                await prisma.banktransferitem.create({
                    data: {
                        id_paymentorigin: item.originId,
                        val_value: item.value,
                        id_banktransfer: bankTransfer.id_banktransfer,
                        cod_external: item.externalId
                    }
                })
            }

            return Promise.resolve();
        }
        catch (e) {
            /* TODO
                Corrigir tratamento de erro para saldo insuficiente */
            console.log(e);

            if (e?.response?.data?.error?.message === 'Sender is delinquent') {
                return Promise.reject({ message: "Saldo insuficiente.", status: 400 });
            }
            if (e?.response?.data?.error?.message === 'Insufficient escrow funds') {
                return Promise.reject({ message: "Saldo insuficiente.", status: 400 });
            }
            return Promise.reject(e);
        }
    }

    public getBankTransfers = async (input: Interfaces.GetBankTransfers): Promise<{ data: Array<{ id: number, bankName: string, accountNumber: string, createdAt: string, value: number }>, total: number }> => {
        try {
            logger.silly('Calling getBankTransfers');

            const sortBy: string = {
                "id": "id",
                "bankName": "bankName",
                "accountNumber": "accountNumber",
                "createdAt": "createdAt",
                "value": "value"
            }[input.sortBy];

            let limit = ``;
            let page = ``;
            let search = ``;
            let startDateTime = ``;
            let endDateTime = ``;
            let orderBy = ``;

            orderBy = `ORDER BY ${sortBy || '"createdAt"'} ${input.order || "DESC"}`

            if (input.limit) {
                limit = `LIMIT ${input.limit || input.limitByPage}`;
            }

            if (input.page && input.limit) {
                page = `OFFSET (${(input.page > 0) ? input.page - 1 : 0} * ${input.limit || input.limitByPage})`;
            }

            if (input.search) {
                search = `
                    AND (
                        UNACCENT(ba.bankname) ILIKE UNACCENT('%${input.search}%')
                        OR UNACCENT(ba.accountnumber) ILIKE UNACCENT('%${input.search}%')
                    )`
            }

            if (input.startDateTime) {
                startDateTime = `
                    AND bt.created_at >= '${input.startDateTime}'
                `;
            }

            if (input.endDateTime) {
                endDateTime = `
                    AND bt.created_at <= '${input.endDateTime}'
                `;
            }

            const query: {
                total: number,
                id: number,
                bankName: string,
                accountNumber: string,
                createdAt: string,
                value: number
            }[] = await prisma.$queryRaw(`
                WITH result AS (
                    SELECT
                        bt.id_banktransfer AS id,
                        ba.bankname AS "bankName",
                        ba.accountnumber AS "accountNumber",
                        bt.created_at AS "createdAt",
                        SUM(bti.val_value) AS value
                    FROM
                        banktransfer bt
                        JOIN banktransferitem bti USING (id_banktransfer)
                        JOIN bankaccount ba USING (id_bankaccount)
                    WHERE
                        ba.id_store = ${input.storeId}
                        AND ba.id_paymentsystem = ${input.id_paymentsystem}
                        ${startDateTime}
                        ${endDateTime}
                        ${search}
                    GROUP BY
                        1, 2, 3, 4
                )
                SELECT
                    *
                FROM (
                    TABLE result
                    ${orderBy}
                    ${limit}
                    ${page}
                ) result_paginated
                JOIN (SELECT COUNT(*) AS total FROM result) AS total ON true
            `);

            return Promise.resolve({
                data: query.map(({ total, ...item }) => item),
                total: (query.length) ? +query[0].total : 0
            });
        }
        catch (e) {
            return Promise.reject(e);
        }
    }
}