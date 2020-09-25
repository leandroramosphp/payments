import { Sequelize } from 'sequelize-typescript';
import path from 'path';
import config from '../config';
var pg = require('pg');

/* 
    Solution to prevent pg from updating datetime to local time zone
    https://github.com/sequelize/sequelize/issues/854#issuecomment-491942457 */

pg.types.setTypeParser(1082, 'text', function (text) { return text; });
pg.types.setTypeParser(1184, 'text', function (text) { return text; });
pg.types.setTypeParser(1114, 'text', function (text) { return text; });

const sequelize = new Sequelize({
    database: config.database.name,
    dialect: 'postgres',
    username: config.database.username,
    password: config.database.password,
    logging: console.log,
    models: [path.join(__dirname, '../models')],
    timezone: '+00:00',
    host: config.database.host,
    port: parseInt(config.database.port.toString())
});

export default sequelize;