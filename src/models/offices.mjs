import { DataTypes } from 'sequelize';

export const OfficeFunc = sequelize => sequelize.define(
  'Office',
  {
    officeCode: {
      type: DataTypes.STRING(50),
      primaryKey: true,
      validate: {
        len: [1, 50],
      },
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [5, 50],
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        len: [8, 20],
      },
    },
    addressLine1: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [5, 50],
      },
    },
    addressLine2: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: [5, 50],
      },
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: [5, 50],
      },
    },
    postalCode: {
      type: DataTypes.STRING(15),
      allowNull: true,
      validate: {
        len: [5, 15],
      },
    },
    country: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50],
      },
    },
    territory: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50],
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
    tableName: 'offices',
  }
);

// const Office = OfficeFunc(sequelize)

// export default Office;
