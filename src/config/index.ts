import dotenv from 'dotenv';

const envFound = dotenv.config();

if (envFound && envFound.error) {
  throw new Error("⚠️  Couldn't find .env file  ⚠️");
}

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

export default {
  port: parseInt(process.env.PORT, 10) || 3001,

  logs: {
    level: process.env.LOG_LEVEL || 'silly',
  },

  api: {
    root: '/mos',
    version: '/v1',
    prefix: '/communication-management'
  },

  database: {
    name: process.env.DB_NAME || 'elephant',
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    host: process.env.DB_HOSTNAME || 'localhost',
    port: process.env.DB_PORT || 5432
  },

  sendgrid: {
    apikey: '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'
  },
  sms: {
    api: {
      auth: {
        marketing: 'Basic bWFya2V0aW5nX3Nwb3Q6c3AwdHhyNjZoem5tN3RhaA==',
        operational: 'Basic c21zX3Nwb3Q6c3AwdHljcDJuNHhyOWhkNQ=='
      },
      envio: 'https://ws.smsdigital.com.br/sms/envio'
    }
  },
  push: {
    api: {
      auth: 'Basic YWQ5ODU1M2MtODhkZS00MmM4LWI0MTMtMTkwYmQ4YzcxNzc3',
      envio: 'https://onesignal.com/api/v1/notifications'
    }
  },

  dev: (process.env.NODE_ENV !== 'production') ? true : false
};