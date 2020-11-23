import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

const configs = {
    PORT: parseInt(process.env.PORT, 10) || 3000,
    LOG_LEVEL: process.env.LOG_LEVEL || 'silly',
    INTERNAL_API_KEY: process.env.INTERNAL_API_KEY,
    DB_NAME: process.env.DB_NAME || 'elephant',
    DB_USERNAME: process.env.DB_USERNAME || 'postgres',
    DB_PASSWORD: process.env.DB_PASSWORD || 'postgres',
    DB_HOSTNAME: process.env.DB_HOSTNAME || 'localhost',
    DB_PORT: process.env.DB_PORT || 5432,
    USERNAME_ZOOP: process.env.USERNAME_ZOOP,
    MARKET_PLACE_ID: process.env.MARKET_PLACE_ID
};

var not_configured = [];

Object.keys(configs).map((c) => {
    if (!configs[c]) {
        not_configured.push(c);
    }
});

if (not_configured.length) {
    throw new Error('List of required environment variables not configured: ' + not_configured.toString());
}

export default {
    port: configs.PORT,

    logs: {
        level: configs.LOG_LEVEL,
    },

    api: {
        payment: {
            root: '/mos',
            version: '/v1',
            prefix: '/payments-management'
        },
        thirdParty: {
            root: '/api/app'
        },
        internalApiKey: configs.INTERNAL_API_KEY
    },

    database: {
        name: configs.DB_NAME || 'elephant',
        username: configs.DB_USERNAME || 'postgres',
        password: configs.DB_PASSWORD || 'postgres',
        host: configs.DB_HOSTNAME || 'localhost',
        port: configs.DB_PORT || 5432
    },

    PaymentsApi: {
        username: configs.USERNAME_ZOOP,
        password: '',
        host: 'https://api.zoop.ws/v1/marketplaces/',
        endpoints: {
            createClient: configs.MARKET_PLACE_ID + '/buyers',
            createStore: configs.MARKET_PLACE_ID + '/sellers/businesses',
            createBankAccount: configs.MARKET_PLACE_ID + '/bank_accounts',
            createCreditCard: configs.MARKET_PLACE_ID + '/cards',
            deleteCreditCard: configs.MARKET_PLACE_ID + '/cards/{card_id}',
            bankAccount: configs.MARKET_PLACE_ID + '/bank_accounts',
            deleteBankAccount: configs.MARKET_PLACE_ID + '/bank_accounts/{bank_account_id}',
            transaction: configs.MARKET_PLACE_ID + '/transactions',
            reverseTransaction: configs.MARKET_PLACE_ID + '/transactions/{transaction_id}/void',
            getAccountBalance: configs.MARKET_PLACE_ID + '/sellers/{seller_id}/balances',
            createBankTransfer: configs.MARKET_PLACE_ID + '/bank_accounts/{bank_account_id}/transfers'
        }
    }
};