import dotenv from 'dotenv';
import crypto from 'crypto'

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();
if (!envFound) {
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

export default {
    port: process.env.PORT,

    logs: {
        level: process.env.LOG_LEVEL,
    },

    privateKey: process.env.PRIVATE_KEY,

    apiMos: {
        root: "/mos",
        version: "/v1",
        prefix: "/payment-management"
    },
    
    apiMosStore: {
        root: "/mos-store",
        version: "/v1",
        prefix: "/payment-management",
    },
      
    authApi: {
        host: process.env.AUTH_API_HOST,
        mosMallPrefix: '/mos/v1/auth-api',
        mosStorePrefix: '/mos-store/v1/auth-api',
        authInternalEndpoint: '/authorization',
    },

    paymentApi: {
        username: process.env.USERNAME_ZOOP,
        password: '',
        host: 'https://api.zoop.ws/v1/marketplaces/',
        endpoints: {
            createClient: '$MARKETPLACEID' + '/buyers',
            createStore: '$MARKETPLACEID' + '/sellers/businesses',
            createBankAccount: '$MARKETPLACEID' + '/bank_accounts',
            createCreditCard: '$MARKETPLACEID' + '/cards',
            deleteCreditCard: '$MARKETPLACEID' + '/cards/{card_id}',
            bankAccount: '$MARKETPLACEID' + '/bank_accounts',
            deleteBankAccount: '$MARKETPLACEID' + '/bank_accounts/{bank_account_id}',
            createPayment: '$MARKETPLACEID' + '/transactions',
            reversePayment: '$MARKETPLACEID' + '/transactions/{transaction_id}/void',
            getAccountBalance: '$MARKETPLACEID' + '/sellers/{seller_id}/balances',
            createBankTransfer: '$MARKETPLACEID' + '/bank_accounts/{bank_account_id}/transfers',
            generateToken: '$MARKETPLACEID' + '/cards/tokens'
        }
    },

    encryption: {
        key: process.env.KEY,
        algorithm: 'aes-256-ctr',
        iv: process.env.IV,
    }
};