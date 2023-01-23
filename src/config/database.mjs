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

console.log(config.databaseName);
console.log(config.user);
console.log(config.password);
console.log(config.host);

const sequelize = new Sequelize(config.databaseName, config.user, config.password, {
  host: config.host,
  dialect: 'mysql',
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
