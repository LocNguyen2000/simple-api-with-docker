import mongoose from 'mongoose';
import config from './config.mjs';
import migration from '../migration/index.mjs';

const connectToDb = async (sequelize) => {
  try {
    await sequelize.authenticate();
    console.log('---MySQL Connection has been established successfully.');

    await sequelize.sync({ force: config.env === 'prod' });
    console.log('---All models were synchronized successfully.');

    await mongoose.connect(config.mongoUri);
    console.log('---MongoDB Connection has been established successfully.');

    // // RUN ONLY ONCE (OR USE SCRIPT)
    if (config.env !== 'prod') await migration.up(sequelize);
  } catch (error) {
    console.error('---Unable to connect to all the database:', error);
  }
};

export default connectToDb;
