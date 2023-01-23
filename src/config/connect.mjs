import mongoose from 'mongoose';

const connectToDb = async (sequelize, mongodbString) => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    await sequelize.sync({ alter: true });
    console.log('All models were synchronized successfully.');

    await mongoose.connect(mongodbString);
    console.log('Connect MongoDB Successfully!');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export default connectToDb;
