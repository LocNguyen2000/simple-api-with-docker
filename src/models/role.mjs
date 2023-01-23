import { DataTypes } from 'sequelize';
import { ROLE } from '../config/variables.mjs';

export const RoleFunc = (sequelize) =>
  sequelize.define(
    'Role',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role: {
        type: DataTypes.ENUM,
        values: [ROLE.PRESIDENT, ROLE.LEADER, ROLE.MANAGER, ROLE.STAFF, ROLE.CUSTOMER],
        allowNull: false,
        unique: true,
        validate: {
          len: [2, 50],
          isIn: {
            args: [[ROLE.PRESIDENT, ROLE.LEADER, ROLE.MANAGER, ROLE.STAFF, ROLE.CUSTOMER]],
            msg: 'Must have one of these role',
          },
        },
      },
      createdBy: {
        type: DataTypes.STRING(20),
        validate: {
          len: [3, 20],
          min: {
            args: 3,
            msg: 'Username must have more than 3 characters',
          },
        },
      },
      updatedBy: {
        type: DataTypes.STRING(20),
        validate: {
          len: [3, 20],
          min: {
            args: 3,
            msg: 'Username must have more than 3 characters',
          },
        },
      },
    },
    {
      tableName: 'role',
    }
  );
