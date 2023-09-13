import { ROLE } from '../config/variables.mjs';

const migration = {
  up: async function (_sequelize) {
    const txc = await _sequelize.transaction();

    try {
      const { Role, Office } = _sequelize.models;

      await this.down(_sequelize, txc);

      await Office.bulkCreate(
        [
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
        ],
        { transaction: txc }
      );

      await Role.bulkCreate(
        [
          { id: 1, role: ROLE.PRESIDENT, createdAt: new Date(), updatedAt: new Date() },
          { id: 2, role: ROLE.MANAGER, createdAt: new Date(), updatedAt: new Date() },
          { id: 3, role: ROLE.LEADER, createdAt: new Date(), updatedAt: new Date() },
          { id: 4, role: ROLE.STAFF, createdAt: new Date(), updatedAt: new Date() },
          { id: 5, role: ROLE.CUSTOMER, createdAt: new Date(), updatedAt: new Date() },
        ],
        { transaction: txc }
      );

      await txc.commit();
      console.log('Running migration to db sucessfully');
    } catch (error) {
      await txc.rollback();
      console.log(error.message);
    }
  },
  down: async function (_sequelize, _txc) {
    await _sequelize.query(`SET FOREIGN_KEY_CHECKS = 0`, { transaction: _txc });
    await _sequelize.query(`TRUNCATE table role`, { transaction: _txc });
    await _sequelize.query(`TRUNCATE table offices`, { transaction: _txc });
    await _sequelize.query(`SET FOREIGN_KEY_CHECKS = 1`, { transaction: _txc });
  },
  // for scaling: check if any of multiple instances has affect the db
  scanRecords: async function (_sequelize) {
    const employeesCount = await _sequelize.query(`SELECT COUNT(1) FROM employees`);
    const roleCount = await _sequelize.query(`SELECT COUNT(1) FROM role`);
    const officesCount = await _sequelize.query(`SELECT COUNT(1) FROM offices`);

    console.log('employeesCount >', employeesCount);
    console.log('officesCount >', officesCount);
    console.log('roleCount >', roleCount);

    if (employeesCount || officesCount || roleCount) return true;

    return false;
  },
};

export default migration;
