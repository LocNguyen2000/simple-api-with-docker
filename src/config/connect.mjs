import mongoose from 'mongoose';
import config from './config.mjs';
import migration from '../migration/index.mjs';

const { mongoHost, mongoPort, mongodbName } = config;

const connectToDb = async (sequelize, mongodbString = `mongodb://${mongoHost}:${mongoPort}/${mongodbName}`) => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Connection has been established successfully.');

    await sequelize.sync({ force: config.NODE_ENV === 'prod' });
    console.log('All models were synchronized successfully.');

    await mongoose.connect(mongodbString);
    console.log('MongoDB Connection has been established successfully.');

    // // RUN ONLY ONCE (OR USE SCRIPT)
    await migration.up(sequelize);
  } catch (error) {
    console.error('Unable to connect to all the database:', error);
  }
};

export default connectToDb;
