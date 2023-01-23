import { DataTypes } from 'sequelize';


export const CustomerFunc = sequelize => sequelize.define(
  'Customer',
  {
    customerNumber: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      validate: {
        min: { args: 1, msg: 'Must be a positive number' },
      },
    },
    customerName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [5, 50],
        notNull: {
          msg: 'Must not be null',
        },
        notEmpty: {
          msg: 'Must have a value',
        },
      },
    },
    contactLastName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [3, 50],
        notNull: {
          msg: 'Must not be null',
        },
        notEmpty: {
          msg: 'Must have a value',
        },
      },
    },
    contactFirstName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [3, 50],
        notNull: {
          msg: 'Must not be null',
        },
        notEmpty: {
          msg: 'Must have a value',
        },
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        len: [8, 20],
        notNull: {
          msg: 'Must not be null',
        },
        notEmpty: {
          msg: 'Must have a value',
        },
      },
    },
    addressLine1: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [10, 50],
        notNull: {
          msg: 'Must not be null',
        },
        notEmpty: {
          msg: 'Must have a value',
        },
      },
    },
    addressLine2: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: [10, 50],
      },
    },
    city: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        len: [2, 50],
        notNull: {
          msg: 'Must not be null',
        },
        notEmpty: {
          msg: 'Must have a value',
        },
      },
    },
    state: {
      type: DataTypes.STRING(50),
      allowNull: true,
      validate: {
        len: [2, 50],
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
        notNull: {
          msg: 'Must not be null',
        },
        notEmpty: {
          msg: 'Must have a value',
        },
      },
    },
    creditLimit: {
      type: DataTypes.FLOAT(10, 2),
      allowNull: true,
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
    tableName: 'customers',
  }
);

