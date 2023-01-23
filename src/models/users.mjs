import { DataTypes } from 'sequelize';

export const UserFunc = sequelize => sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(20),
      validate: {
        len: [3, 20],
        min: {
          args: 3,
          msg: 'Username must have more than 3 characters'
        }
      },
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(100),
      validate: {
        len: [6, 100],
        min: {
          args: 6,
          msg: 'Password must have more than 6 characters',
        },
      },
      allowNull: false,
    },
    isEmployee: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Must have this field isEmployee',
        },
      },
    },
    createdBy: {
      type: DataTypes.STRING(20),
      defaultValue: 'admin',
      validate: {
        len: [2, 50],
      },
    },
    updatedBy: {
        type: DataTypes.STRING(20),
        defaultValue: 'admin',
        validate: {
            len: [2, 50],
        },
    },
  },
  {
    tableName: 'users',
  }
);
