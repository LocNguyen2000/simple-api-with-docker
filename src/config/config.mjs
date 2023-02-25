import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const NODE_ENV = process.env.NODE_ENV; // dev & test & docker
let config;

console.log(NODE_ENV);

if (NODE_ENV === 'test') {
  config = {
    host: '0.0.0.0',
    port: 4000,
    secretKey: 1234,

    sqlHost: '0.0.0.0',
    sqlPort: 3306,
    sqlUser: 'root',
    sqlPassword: '',
    sqlDbName: 'rootdb',

    mongoHost: '0.0.0.0',
    mongoPort: 27017,
    mongodbName: 'loggerdb',
  };
} else if (NODE_ENV === 'docker') {
  config = {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 4000,
    secretKey: process.env.SECRET_KEY || 1234,

    sqlHost: process.env.SQL_HOST || 'mysql0',
    sqlPort: process.env.SQL_PORT || 3306,
    sqlUser: process.env.SQL_USER || 'root',
    sqlPassword: process.env.SQL_PASSWORD || '',
    sqlDbName: process.env.SQL_DB_NAME || 'rootdb',

    mongoHost: process.env.MONG0_HOST || 'mongo0',
    mongoPort: process.env.MONGO_PORT || 27017,
    mongodbName: process.env.MONGO_DB_NAME || 'loggerdb',
  };
} else {
  config = {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 4000,
    secretKey: process.env.SECRET_KEY || 1234,

    sqlHost: process.env.SQL_HOST || '0.0.0.0',
    sqlPort: process.env.SQL_PORT || 3306,
    sqlUser: process.env.SQL_USER || 'root',
    sqlPassword: process.env.SQL_PASSWORD || '',
    sqlDbName: process.env.SQL_DB_NAME || 'rootdb',

    mongoHost: process.env.MONG0_HOST || '0.0.0.0',
    mongoPort: process.env.MONGO_PORT || 27017,
    mongodbName: process.env.MONGO_DB_NAME || 'loggerdb',
  };
}

export default config;
