import * as dotenv from 'dotenv';

dotenv.config({ path: process.cwd() + '/.env' });

const NODE_ENV = process.env.NODE_ENV; // dev & test & docker & prod
let config = {};

if (NODE_ENV === 'docker' || NODE_ENV === 'prod' || NODE_ENV === 'dev') {
  config = {
    env: NODE_ENV,
    host: process.env.HOST,
    port: process.env.PORT,
    secretKey: process.env.SECRET_KEY,
    apiKey: process.env.SECRET_KEY,
    sqlHost: process.env.SQL_HOST,
    sqlPort: process.env.SQL_PORT,
    sqlUser: process.env.SQL_USER,
    sqlPassword: process.env.SQL_PASSWORD,
    sqlDbName: process.env.SQL_DB_NAME,
    mongoHost: process.env.MONG0_HOST,
    mongoPort: process.env.MONGO_PORT,
    mongodbName: process.env.MONGO_DB_NAME,
  };

  config['mongoUri'] = process.env.MONGO_URI || `mongodb://${config.mongoHost}:${config.mongoPort}/${config.mongodbName}`;
} else {
  // test & others
  config = {
    env: NODE_ENV,
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 4000,
    secretKey: process.env.SECRET_KEY || 1234,
    apiKey: process.env.SECRET_KEY || 'x-api-key',
    sqlHost: process.env.SQL_HOST || '0.0.0.0',
    sqlPort: process.env.SQL_PORT || 3306,
    sqlUser: process.env.SQL_USER || 'root',
    sqlPassword: process.env.SQL_PASSWORD || '',
    sqlDbName: process.env.SQL_DB_NAME || 'rootdb',
    mongoHost: process.env.MONG0_HOST || '0.0.0.0',
    mongoPort: process.env.MONGO_PORT || 27018,
    mongodbName: process.env.MONGO_DB_NAME || 'loggerdb',
  };

  config['mongoUri'] = `mongodb://${config.mongoHost}:${config.mongoPort}/${config.mongodbName}`;
}

console.log(config);

export default config;
