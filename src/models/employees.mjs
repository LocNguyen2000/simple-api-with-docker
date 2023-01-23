import { DataTypes } from 'sequelize';

export const EmployeeFunc = (sequelize) =>
  sequelize.define(
    'Employee',
    {
      employeeNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        validate: {
          len: [1, 11],
          min: { args: 1, msg: 'Must be a positive number' },
        },
      },
      firstName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Must not be null',
          },
          notEmpty: {
            msg: 'Must have a value',
          },
        },
      },
      lastName: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Must not be null',
          },
          notEmpty: {
            msg: 'Must have a value',
          },
        },
      },
      extension: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Must not be null',
          },
          notEmpty: {
            msg: 'Must have a value',
          },
        },
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Must not be null',
          },
          notEmpty: {
            msg: 'Must have a value',
          },
          isEmail: {
            msg: 'Must be an email',
          },
        },
      },
      jobTitle: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Must not be null',
          },
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
      tableName: 'employees',
    }
  );
