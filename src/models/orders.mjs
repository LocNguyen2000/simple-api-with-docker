import { DataTypes } from 'sequelize';
import { ORDER_STATUS } from '../config/variables.mjs';


export const OrderFunc = sequelize => sequelize.define(
  'Order',
  {
    orderNumber: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      validate: {
        min: {
          args: 1,
          msg: 'Order number must be at least 1'
        }
      },
    },
    orderDate: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: 'Must be date string'
        }
      }
    },
    requiredDate: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: 'Must be date string'
        }
      }
    },
    shippedDate: {
      type: DataTypes.DATE,
      validate: {
        isDate: {
          msg: 'Must be date string'
        }
      }
    },
    status: {
      type: DataTypes.STRING(15),
      allowNull: false,
      enum: [ORDER_STATUS.IN_PROCESS, ORDER_STATUS.CANCELLED, ORDER_STATUS.COD, ORDER_STATUS.DISPUTED, ORDER_STATUS.ON_HOLD, ORDER_STATUS.RESOLVED, ORDER_STATUS.SHIPPED],
      validate: {
        isIn: {
          args: [[ORDER_STATUS.IN_PROCESS, ORDER_STATUS.CANCELLED, ORDER_STATUS.COD, ORDER_STATUS.DISPUTED, ORDER_STATUS.ON_HOLD, ORDER_STATUS.RESOLVED, ORDER_STATUS.SHIPPED]],
          msg: 'Must have one of these order status',
        },
      },
    },
    comments: {
      type: DataTypes.STRING,
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
    tableName: 'orders',
    paranoid: true,
    deletedAt: 'deleted'
  }
);

