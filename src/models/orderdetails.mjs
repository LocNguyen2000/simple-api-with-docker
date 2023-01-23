import { DataTypes } from 'sequelize';
import { ProductFunc } from './products.mjs';
import { OrderFunc } from './orders.mjs';

export const OrderDetailFunc = (sequelize) =>
  sequelize.define(
    'OrderDetail',
    {
      orderNumber: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        validate: {
          min: 0,
        },
        references: {
          model: OrderFunc(sequelize),
          key: 'orderNumber',
        },
      },
      productCode: {
        type: DataTypes.STRING(15),
        primaryKey: true,
        validate: {
          len: [1, 15],
        },
        references: {
          model: ProductFunc(sequelize),
          key: 'productCode',
        },
      },
      quantityOrdered: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      priceEach: {
        type: DataTypes.FLOAT(10, 2),
        allowNull: false,
      },
      orderLineNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
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
      tableName: 'orderdetails',
      paranoid: true,
      deletedAt: 'deleted'
    }
  );
