import { DataTypes } from 'sequelize';

export const ProductLineFunc = sequelize => sequelize.define(
  'ProductLine',
  {
    productLine: {
      type: DataTypes.STRING(50),
      primaryKey: true,
    },
    textDescription: {
      type: DataTypes.STRING(4000),
    },
    htmlDescription: {
      type: DataTypes.TEXT('medium'),
    },
    image: {
      type: DataTypes.BLOB('medium'),
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
    tableName: 'productlines',
  }
);

