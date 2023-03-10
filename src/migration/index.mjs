import { ROLE } from '../config/variables.mjs';

const migration = {
  up: async function (_sequelize) {
    const txc = await _sequelize.transaction();

    try {
      const { Role, Employee, Office } = _sequelize.models;

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

      await Employee.bulkCreate(
        [
          {
            employeeNumber: 1000,
            firstName: 'Loc',
            lastName: 'Nguyen',
            extension: 'x5800',
            email: 'locnh12@gmail.com',
            officeCode: '1',
            jobTitle: ROLE.PRESIDENT,
            role: 1,
          },
          {
            employeeNumber: 1001,
            firstName: 'Tien',
            lastName: 'Ngoc',
            extension: 'x5800',
            email: 'tiennn9@gmail.com',
            officeCode: '1',
            jobTitle: ROLE.MANAGER,
            role: 2,
          },
          {
            employeeNumber: 1002,
            firstName: 'Khai',
            lastName: 'Quang',
            extension: 'x5800',
            email: 'khaitq7@gmail.com',
            officeCode: '1',
            jobTitle: ROLE.LEADER,
            role: 3,
          },
          {
            employeeNumber: 1003,
            firstName: 'Nhan',
            lastName: 'Vien A',
            extension: 'x5800',
            email: 'staff1@gmail.com',
            officeCode: '1',
            jobTitle: ROLE.STAFF,
            role: 4,
          },
          {
            employeeNumber: 1004,
            firstName: 'Nhan',
            lastName: 'Vien B',
            extension: 'x5800',
            email: 'staff2@gmail.com',
            officeCode: '1',
            jobTitle: ROLE.STAFF,
            role: 4,
          },
          {
            employeeNumber: 1005,
            firstName: 'Nhan',
            lastName: 'Vien C',
            extension: 'x5800',
            email: 'staff3@gmail.com',
            officeCode: '1',
            jobTitle: ROLE.STAFF,
            role: 4,
          },
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
    await _sequelize.query(`TRUNCATE table users`, { transaction: _txc });
    await _sequelize.query(`TRUNCATE table employees`, { transaction: _txc });
    await _sequelize.query(`TRUNCATE table role`, { transaction: _txc });
    await _sequelize.query(`TRUNCATE table offices`, { transaction: _txc });
    await _sequelize.query(`SET FOREIGN_KEY_CHECKS = 1`, { transaction: _txc });
  },
  // for scaling: check if any of multiple instances has affect the db
  scanRecords: async function (_sequelize) {
    // const { Role, Employee, Office } = _sequelize.models;
    // const employeesCount = await Employee.count({ transaction: _txc });
    // const roleCount = await Role.count({ transaction: _txc });
    // const officesCount = await Office.count({ transaction: _txc });

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
