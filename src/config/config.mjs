import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

export default {
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  databaseName: process.env.DB_NAME,
  secretKey: process.env.SECRET_KEY,
  mongodb: process.env.MONGO_CONNECTION_STRING,
};
