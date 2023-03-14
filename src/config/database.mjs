import { Sequelize, DataTypes } from 'sequelize';
import config from './config.mjs';
import addRelations from './relations.mjs';
import { ProductFunc } from '../models/products.mjs';
import { OrderFunc } from '../models/orders.mjs';
import { OrderDetailFunc } from '../models/orderdetails.mjs';
import { UserFunc } from '../models/users.mjs';
import { EmployeeFunc } from '../models/employees.mjs';
import { CustomerFunc } from '../models/customers.mjs';
import { RoleFunc } from '../models/role.mjs';
import { ProductLineFunc } from '../models/productlines.mjs';
import { OfficeFunc } from '../models/offices.mjs';
import { PaymentFunc } from '../models/payments.mjs';

const { sqlHost, sqlPort, sqlUser, sqlPassword, sqlDbName } = config;

const sequelize = new Sequelize(sqlDbName, sqlUser, sqlPassword, {
  host: sqlHost,
  port: sqlPort,
  dialect: 'mysql',
  // retry: {
  //   match: [Sequelize.ConnectionError, Sequelize.ConnectionTimedOutError, Sequelize.TimeoutError],
  //   max: 5,
  // },
});

const createModelsAndRelations = () => {
  ProductFunc(sequelize);
  ProductLineFunc(sequelize);
  CustomerFunc(sequelize);
  EmployeeFunc(sequelize);
  RoleFunc(sequelize);
  OrderDetailFunc(sequelize);
  OrderFunc(sequelize);
  UserFunc(sequelize);
  OfficeFunc(sequelize);
  PaymentFunc(sequelize);

  addRelations(sequelize, DataTypes);
};

createModelsAndRelations();

export default sequelize;
