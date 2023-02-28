import mongoose from 'mongoose';
import config from './config.mjs';
import migration from '../migration/index.mjs';

const { mongoHost, mongoPort, mongodbName } = config;

const connectToDb = async (sequelize, mongodbString = `mongodb://${mongoHost}:${mongoPort}/${mongodbName}`) => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    await mongoose.connect(mongodbString);
    console.log('Connect MongoDB Successfully!');

    await migration.up(sequelize);
    console.log('Running migration to db');
  } catch (error) {
    console.error('Unable to connect to all the database:', error);
  }
};

export default connectToDb;
