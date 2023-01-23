import { DataTypes } from 'sequelize';

export const ProductFunc = sequelize => sequelize.define(
  'Product',
  {
    productCode: {
      type: DataTypes.STRING(15),
      primaryKey: true,
      validate: {
        len: [1, 15],
      },
    },
    productName: {
      type: DataTypes.STRING(70),
      allowNull: false,
      validate: {
        len: [0, 70],
      },
    },
    productScale: {
      type: DataTypes.STRING(10),
      allowNull: false,
      validate: {
        len: [0, 10],
      },
    },
    productVendor: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [0, 50],
      },
    },
    productDescription: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    quantityInStock: {
      type: DataTypes.INTEGER(6).UNSIGNED,
      allowNull: false,
    },
    buyPrice: {
      type: DataTypes.FLOAT(10, 2).UNSIGNED,
      allowNull: false,
    },
    MSRP: {
      type: DataTypes.FLOAT(10, 2).UNSIGNED,
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
    tableName: 'products',
  }
);

