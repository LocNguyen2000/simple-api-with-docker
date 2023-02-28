import { ROLE } from '../config/variables.mjs';

const migration = {
  up: async function (_sequelize) {
    const { Role, Employee, Office } = _sequelize.models;

    await this.down(_sequelize);

    await Office.bulkCreate([
      {
        officeCode: '1',
        city: 'San Francisco',
        phone: '+1 650 219 4782',
        addressLine1: '100 Market Street',
        addressLine2: 'Suite 300',
        state: 'CA',
        country: 'USA',
        postalCode: '94080',
        territory: 'NA',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        officeCode: '2',
        city: 'Boston',
        phone: '+1 215 837 0825',
        addressLine1: '1550 Court Place',
        addressLine2: 'Suite 102',
        state: 'MA',
        country: 'USA',
        postalCode: '02107',
        territory: 'NA',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ]);

    await Role.bulkCreate([
      { id: 1, role: ROLE.PRESIDENT, createdAt: new Date(), updatedAt: new Date() },
      { id: 2, role: ROLE.MANAGER, createdAt: new Date(), updatedAt: new Date() },
      { id: 3, role: ROLE.LEADER, createdAt: new Date(), updatedAt: new Date() },
      { id: 4, role: ROLE.STAFF, createdAt: new Date(), updatedAt: new Date() },
      { id: 5, role: ROLE.CUSTOMER, createdAt: new Date(), updatedAt: new Date() },
    ]);

    await Employee.bulkCreate([
      {
        employeeNumber: 1002,
        firstName: 'Loc',
        lastName: 'Nguyen',
        extension: 'x5800',
        email: 'locnguyenhuu2k@gmail.com',
        officeCode: '1',
        jobTitle: ROLE.PRESIDENT,
        role: 1,
      },
    ]);
  },
  down: async function (_sequelize) {
    await _sequelize.query(`SET FOREIGN_KEY_CHECKS = 0`);
    await _sequelize.query(`TRUNCATE table employees`);
    await _sequelize.query(`TRUNCATE table role`);
    await _sequelize.query(`TRUNCATE table offices`);
    await _sequelize.query(`SET FOREIGN_KEY_CHECKS = 1`);
  },
};

export default migration;
