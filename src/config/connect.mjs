import mongoose from 'mongoose';
import config from './config.mjs';

const connectToDb = async (sequelize, mongodbString) => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    const {mongoHost, mongoPort, mongodbName} = config

    const MONGO_URL_STRING = `mongodb://${mongoHost}:${mongoPort}/${mongodbName}`
    console.log(MONGO_URL_STRING);

    await mongoose.connect(MONGO_URL_STRING);
    console.log('Connect MongoDB Successfully!');
  } catch (error) {
    console.error('Unable to connect to all the database:', error);
  }
};

export default connectToDb;
