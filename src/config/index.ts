import dotenv from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
    port: parseInt(process.env.PORT, 10) || 3000,

    logs: {
        level: process.env.LOG_LEVEL || 'silly',
    },

    api: {
        payment: {
            root: '/mos',
            version: '/v1',
            prefix: '/payments-management'
        },
        thirdParty: {
            root: '/api/app'
        }
    },

    database: {
        name: process.env.DB_NAME || 'elephant',
        username: process.env.DB_USERNAME || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        host: process.env.DB_HOSTNAME || 'localhost',
        port: process.env.DB_PORT || 5432
    },

    PaymentsApi: {
        username:  process.env.USERNAME_ZOOP,
        password: '',
        host: 'https://api.zoop.ws/v1/marketplaces/',    
        endpoints: {
            createClient: process.env.MARKET_PLACE_ID + '/buyers',
            createStore: process.env.MARKET_PLACE_ID + '/sellers/businesses',
            createBankAccount: process.env.MARKET_PLACE_ID + '/bank_accounts',
            createCard: process.env.MARKET_PLACE_ID + '/cards',
            updateCard: process.env.MARKET_PLACE_ID + '/cards/{card_id}',
            bankAccount: process.env.MARKET_PLACE_ID + '/bank_accounts',
            deleteBankAccount: process.env.MARKET_PLACE_ID + '/bank_accounts/{bank_account_id}',
            transaction: process.env.MARKET_PLACE_ID + '/transactions',
            reverseTransaction: process.env.MARKET_PLACE_ID + '/transactions/{transaction_id}/void',
            accountBallance: process.env.MARKET_PLACE_ID + 'sellers/{seller_id}/balances',
        }        
    }
};

