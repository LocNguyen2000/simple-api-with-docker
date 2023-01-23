import { DataTypes } from 'sequelize';

export const PaymentFunc = sequelize => sequelize.define(
  'Payment',
  {
    customerNumber: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      validate: {
        min: 0,
      },
    },
    checkNumber: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      validate: {
        min: 0,
      },
    },
    paymentDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: false,
    },
    createdBy: {
      type: DataTypes.STRING(20),
      validate: {
        len: [3, 20],
        min: {
          args: 3,
          msg: 'Username must have more than 3 characters'
        }
      },
    },
    updatedBy: {
      type: DataTypes.STRING(20),
      validate: {
        len: [3, 20],
        min: {
          args: 3,
          msg: 'Username must have more than 3 characters'
        }
      },
    },
  },
  {
    tableName: 'payments',
    paranoid: true,
    deletedAt: 'deleted'
  }
);

